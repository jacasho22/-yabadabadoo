import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async (params) => {
  // Support both new (requestLocale) and old (locale) API patterns
  const requestLocale = (params as any).requestLocale;
  const localeParam = (params as any).locale;
  
  let locale = await (requestLocale || localeParam || defaultLocale);
  
  // Final fallback if everything fails
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
