import { createContext } from "react";

export const I18nContext = createContext({
  locale: "en",
  // Default translation function using interpolation.
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
  changeLocale: () => {},
});
