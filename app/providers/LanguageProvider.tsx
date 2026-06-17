'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, locales, defaultLocale } from '@/i18n.config';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

const allTranslations: Record<Locale, Record<string, any>> = { en, ar };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('language') as Locale | null;
    const newLocale = (saved && locales.includes(saved)) ? saved : defaultLocale;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.style.direction = newLocale === 'ar' ? 'rtl' : 'ltr';
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.style.direction = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('language', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.style.direction = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = allTranslations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
