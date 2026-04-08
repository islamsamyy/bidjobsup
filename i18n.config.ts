export const defaultLocale = 'en';
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeConfig = {
  en: {
    name: 'English',
    direction: 'ltr',
  },
  ar: {
    name: 'العربية',
    direction: 'rtl',
  },
};
