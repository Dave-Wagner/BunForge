/**
 * I18nContext
 *
 * Provides internationalization functions and current locale.
 *
 * @constant {React.Context}
 * @property {string} locale - The current locale (e.g., "en", "es").
 * @property {Function} t - Function to get translated text by key with optional interpolation.
 * @property {Function} changeLocale - Function to change the current locale.
 *
 * @example
 * import { useContext } from "react";
 * import { I18nContext } from "./I18nContext";
 *
 * const MyComponent = () => {
 *   const { locale, t, changeLocale } = useContext(I18nContext);
 *   return (
 *     <div>
 *       <p>{t("greeting", "Alice")}</p>
 *       <button onClick={() => changeLocale("es")}>Switch to Spanish</button>
 *     </div>
 *   );
 * };
 */
import { createContext } from "react";

export const I18nContext = createContext({
  locale: "en",
  /**
   * Default translation function with interpolation.
   *
   * @param {string} key - Translation key.
   * @param {...string} _args - Interpolation arguments.
   * @returns {string} Translated string.
   */
  t: (key, ..._args) => {
    let translation = key;
    _args.forEach((value, index) => {
      translation = translation.replace(
        new RegExp(`\\{${index}\\}`, "g"),
        value
      );
    });
    return translation;
  },
  /**
   * Placeholder function for changing locale.
   *
   * @param {string} _newLocale - The new locale.
   */
  changeLocale: () => {},
});
