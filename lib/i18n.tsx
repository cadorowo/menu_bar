'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, LocalizedString } from './types';

export function getTranslation(
  field?: LocalizedString | string,
  locale: Locale = 'it'
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] || field['it'] || Object.values(field)[0] || '';
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (field?: LocalizedString | string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'it',
  setLocale: () => {},
  t: (field?: LocalizedString | string) => getTranslation(field, 'it'),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('it');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('aperitivo_locale') as Locale;
      if (savedLocale === 'it' || savedLocale === 'en' || savedLocale === 'fr') {
        setLocaleState(savedLocale);
      } else {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('fr')) {
          setLocaleState('fr');
        } else if (navLang.startsWith('en')) {
          setLocaleState('en');
        } else {
          setLocaleState('it');
        }
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aperitivo_locale', newLocale);
    }
  };

  const t = (field?: LocalizedString | string) => getTranslation(field, locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
