import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  // Mostrar el código del idioma actual
  const currentLang = language === "es" ? "ES" : "EN";
  const nextLanguage = language === "es" ? "English" : "Español";

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg z-99999 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 bg-white dark:bg-gray-900"
      title={`${t("language.change")} (${nextLanguage})`}
      aria-label={`${t("language.change")} - ${nextLanguage}`}
    >
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
        {currentLang}
      </span>
      <span className="sr-only">
        {language === "es" ? t("language.english") : t("language.spanish")}
      </span>
    </button>
  );
};

export default LanguageToggleButton;
