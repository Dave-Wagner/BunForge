import React, { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Spinner from "@/components/Spinner";
import Logger from "@/services/logger";

// Create a default logger instance for icon-related logging.
const iconLogger = new Logger({ type: "console" });

// Mapping for supported icon sets.
// This makes the dynamic import predictable for Vite.
const iconSets = {
  fa: () => import("react-icons/fa"),
  md: () => import("react-icons/md"),
  gi: () => import("react-icons/gi"),
  // Add more icon sets here if needed.
};

/**
 * Cache for dynamically imported icons.
 * Keys are constructed from iconSet and iconName.
 * @type {Map<string, React.LazyExoticComponent<any>>}
 */
const iconCache = new Map();

/**
 * Dynamically import and cache the desired icon from react-icons.
 *
 * @param {string} iconSet - The icon set to import from (e.g., "fa", "md").
 * @param {string} iconName - The name of the icon (e.g., "FaBeer").
 * @returns {React.LazyExoticComponent<React.ComponentType<any>>} The lazy-loaded icon component.
 */
const getCachedIcon = (iconSet, iconName) => {
  const cacheKey = `${iconSet}-${iconName}`;
  if (iconCache.has(cacheKey)) {
    iconLogger.log("debug", `Icon cache hit for ${cacheKey}`);
    return iconCache.get(cacheKey);
  }

  const loadIconSet = iconSets[iconSet];
  if (!loadIconSet) {
    throw new Error(`Icon set "${iconSet}" is not supported.`);
  }

  const LazyIcon = lazy(() =>
    loadIconSet().then((module) => {
      if (!module[iconName]) {
        throw new Error(
          `Icon "${iconName}" not found in react-icons/${iconSet}`
        );
      }
      iconLogger.log(
        "info",
        `Icon "${iconName}" loaded successfully from react-icons/${iconSet}`
      );
      return { default: module[iconName] };
    })
  );
  iconCache.set(cacheKey, LazyIcon);
  iconLogger.log("debug", `Caching icon ${cacheKey}`);
  return LazyIcon;
};

/**
 * Generic Icon component that dynamically imports icons from react-icons.
 *
 * @param {Object} props - The props for the Icon component.
 * @param {string} props.iconSet - The icon set to load from (e.g., "fa", "md", "gi").
 * @param {string} props.iconName - The name of the icon to import (e.g., "FaBeer").
 * @param {number|string} [props.size] - The size of the icon.
 * @param {React.CSSProperties} [props.style] - Inline styles to apply to the icon.
 * @param {string} [props.className] - Additional class names for the icon.
 * @param {Object} [props.rest] - Any additional props to pass to the icon.
 *
 * @example
 * // Renders a FontAwesome beer icon with a size of 32px and orange color.
 * <Icon iconSet="fa" iconName="FaBeer" size={32} style={{ color: 'orange' }} />
 *
 * @returns {JSX.Element} The rendered icon component.
 */
const Icon = ({ iconSet, iconName, size, style, className, ...rest }) => {
  const LazyIcon = getCachedIcon(iconSet, iconName);
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <LazyIcon size={size} style={style} className={className} {...rest} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Icon;
