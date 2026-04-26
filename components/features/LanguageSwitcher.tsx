'use client';

import { useLanguage } from '@/app/providers/LanguageProvider';
import { useEffect, useRef, useState } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black tracking-[0.18em] uppercase text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
        aria-label="Switch language"
      >
        <span className="material-symbols-outlined text-[15px]">translate</span>
        {locale === 'en' ? 'EN' : 'AR'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-surface-container/95 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden z-50">
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => { setLocale('en'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                locale === 'en'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-on-surface/5 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">English</span>
              {locale === 'en' && (
                <span className="material-symbols-outlined text-[14px] text-primary ml-auto">check_circle</span>
              )}
            </button>
            <button
              onClick={() => { setLocale('ar'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                locale === 'ar'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-on-surface/5 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="text-base">🇸🇦</span>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">العربية</span>
              {locale === 'ar' && (
                <span className="material-symbols-outlined text-[14px] text-primary ml-auto">check_circle</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
