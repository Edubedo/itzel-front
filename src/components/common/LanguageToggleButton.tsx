import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { SpanishIcon, EnglishIcon } from "./LanguageIcons";

const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  const nextLanguage = language === "es" ? "English" : "Español";

  return (
    <button
      onClick={toggleLanguage}
      className="
        flex items-center justify-center
        w-10 h-10 rounded-lg
        border border-gray-300 dark:border-gray-700
        bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-300 group
      "
      title={`${t("language.change")} (${nextLanguage})`}
      aria-label={`${t("language.change")} - ${nextLanguage}`}
    >
      <div className="transition-transform duration-500 group-hover:scale-110">
        {language === "es" ? (
          <SpanishIcon className="w-6 h-6" /> 
        ) : (
          <EnglishIcon className="w-6 h-6" />
        )}
      </div>
    </button>
  );
};

export default LanguageToggleButton;
