export const toggleLanguage = (i18n) => {
    const newLanguage = i18n.language === 'en' ? 'lv' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  