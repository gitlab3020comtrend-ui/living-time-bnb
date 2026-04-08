'use client';

import { useState, useEffect } from 'react';
import { Locale, getTranslations } from './i18n';

const STORAGE_KEY = 'bnb-locale';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'en' || saved === 'zh') {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = getTranslations(locale);

  return { locale, setLocale, t, mounted };
}
