import React, { useState } from "react";
import { I18nContext } from "./I18nContext";
import en from "../locales/en.json";
import es from "../locales/es.json";

const translations = { en, es };

/**
 * I18nProvider Component
 *
 * Provides translation and locale switching for the app.
 */
export const I18nProvider = ({ children, defaultLocale = "en" }) => {
  const [locale, setLocale] = useState(defaultLocale);
  const [messages, setMessages] = useState(translations[defaultLocale]);

  /**
   * Change the current locale.
   * @param {string} newLocale - The new locale. Must be present in the
   *     translations object.
   * @example
   * const { changeLocale } = useI18n();
   * changeLocale('es');
   */
  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      setMessages(translations[newLocale]);
    } else {
      console.warn(`Locale "${newLocale}" not found. Falling back to default.`);
    }
  };

  // Translation function with interpolation support.
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
