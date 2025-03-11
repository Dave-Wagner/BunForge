import React, { useState } from "react";
import { I18nContext } from "./I18nContext";
import en from "../locales/en.json";
import es from "../locales/es.json";

/**
 * Object containing all available translations.
 * @constant {Object} translations
 * @property {Object} en - English translations.
 * @property {Object} es - Spanish translations.
 */
const translations = { en, es };

/**
 * I18nProvider Component
 *
 * Provides internationalization support for the application by managing locale
 * selection and translations. Uses React Context API to provide access to the
 * current locale and translation function (`t`).
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped within the provider.
 * @param {string} [props.defaultLocale="en"] - The default language locale (must exist in `translations`).
 * @returns {JSX.Element} I18nContext Provider with locale and translation functions.
 *
 * @example
 * <I18nProvider defaultLocale="es">
 *   <App />
 * </I18nProvider>
 */
export const I18nProvider = ({ children, defaultLocale = "en" }) => {
  const [locale, setLocale] = useState(defaultLocale);
  const [messages, setMessages] = useState(translations[defaultLocale]);

  /**
   * Change the current locale and update translations.
   *
   * @param {string} newLocale - The new locale to switch to. Must exist in `translations`.
   * @example
   * const { changeLocale } = useI18n();
   * changeLocale("es");
   */
  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      setMessages(translations[newLocale]);
    } else {
      console.warn(`Locale "${newLocale}" not found. Falling back to default.`);
    }
  };

  /**
   * Retrieve a translated string by key, supporting interpolation.
   *
   * @param {string} key - The translation key.
   * @param {...string} args - Optional arguments for interpolation.
   * @returns {string} Translated and interpolated string.
   *
   * @example
   * // en.json -> { "greeting": "Hello, {0}!" }
   * t("greeting", "John"); // Returns: "Hello, John!"
   */
  const t = (key, ...args) => {
    let translation = messages[key] || key;
    args.forEach((value, index) => {
      translation = translation.replace(
        new RegExp(`\\{${index}\\}`, "g"),
        value
      );
    });
    return translation;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
