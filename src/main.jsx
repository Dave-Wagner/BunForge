import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import App from "./App.jsx";
import { I18nProvider } from "@/i18n/I18nProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider defaultLocale="en">
      <App />
    </I18nProvider>
  </StrictMode>
);
