'use client';

import { useTheme } from '@/app/providers/ThemeProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black tracking-[0.18em] uppercase text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
      aria-label={t('common.toggleTheme')}
      title={isDark ? t('common.lightMode') : t('common.darkMode')}
    >
      <span className="material-symbols-outlined text-[15px]">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
      {isDark ? t('common.lightMode') : t('common.darkMode')}
    </button>
  );
}
