import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'lv' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button onClick={toggleLanguage} className="btn btn-secondary">
      {i18n.language === 'en' ? 'Latvian' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
