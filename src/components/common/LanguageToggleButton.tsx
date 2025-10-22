import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Languages } from "lucide-react";

const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      title={t("language.change")}
      aria-label={t("language.change")}
    >
      <Languages className="w-5 h-5" />
      <span className="sr-only">
        {language === "es" ? t("language.english") : t("language.spanish")}
      </span>
    </button>
  );
};

export default LanguageToggleButton;
