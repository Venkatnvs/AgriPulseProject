import LanguageSelector from '@/components/LanguageSelector';
import { availableLanguages } from '@/constants/Languages';
import React, { createContext, useContext, useState, useEffect } from 'react';
import './translation.css';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || availableLanguages[0].code,
  );

  useEffect(() => {
    if (document.getElementById('google_translate_element_script')) {
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.type = 'text/javascript';
    script.id = 'google_translate_element_script';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: availableLanguages.map(lang => lang.code).join(','),
        layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
        autoDisplay: false,
      },
      'google_translate_element',
    );
    selectLanguage(selectedLanguage);
  };

  const selectLanguage = langCode => {
    setSelectedLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        const event = new Event('change');
        select.dispatchEvent(event);
        window.reload = true;
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, selectLanguage }}>
      <div
        id='google_translate_element'
        className='hidden'
        style={{ display: 'none' }}
      ></div>
      {children}
      <LanguageSelector
        selectLanguage={selectLanguage}
        selectedLanguage={selectedLanguage}
      />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
