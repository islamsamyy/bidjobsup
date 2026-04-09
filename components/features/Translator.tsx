'use client';

import { useLanguage } from '@/app/providers/LanguageProvider';

interface TranslatorProps {
  children: React.ReactNode;
  translations?: Record<string, Record<string, string>>;
}

export function withTranslation(
  Component: React.ComponentType<any>,
  translationKeys?: string[]
) {
  return function TranslatedComponent(props: any) {
    const { t, dir } = useLanguage();

    return (
      <div dir={dir}>
        <Component {...props} t={t} />
      </div>
    );
  };
}

export function TranslatedText({
  children,
  tKey,
  fallback,
}: {
  children?: React.ReactNode;
  tKey?: string;
  fallback?: string;
}) {
  const { t } = useLanguage();

  if (tKey) {
    return <>{t(tKey)}</>;
  }

  return <>{children || fallback}</>;
}

export function TranslatedContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir } = useLanguage();

  return <div dir={dir}>{children}</div>;
}
