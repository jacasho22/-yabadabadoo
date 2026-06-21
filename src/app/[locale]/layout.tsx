import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../i18n';
import LocaleLayoutBody from '../../components/layout/LocaleLayoutBody';
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    es: 'Alquiler Camper Iniesta | Cuenca y Albacete | Yabadabadoo Campers',
    en: 'Camper Van Rental Spain | Yabadabadoo Campers'
  };
  
  const descriptions = {
    es: 'Alquiler de furgonetas camperizadas en Iniesta, Cuenca y Albacete. Camper pet friendly para escapadas de fin de semana, viajar con perros, cerca de Requena y Utiel, la Manchuela, Motilla del Palancar y Quintanar del Rey.',
    en: 'Rent our fully equipped 2024 Fiat Ducato. Your next adventure starts here. Double bed, shower, full kitchen.'
  };
  
  return {
    title: titles[locale as Locale] || titles.es,
    description: descriptions[locale as Locale] || descriptions.es,
    keywords: locale === 'es' 
      ? ['alquiler camper iniesta', 'alquiler camper cuenca', 'alquiler camper albacete', 'furgoneta camperizada alquiler', 'alquiler camper pet friendly', 'escapada fin de semana camper', 'alquiler camper la manchuela', 'camper para viajar con perros', 'alquiler camper particular', 'precio alquiler camper']
      : ['camper rental', 'campervan Spain', 'Fiat Ducato', 'camper trip'],
    openGraph: {
      title: titles[locale as Locale] || titles.es,
      description: descriptions[locale as Locale] || descriptions.es,
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleLayoutBody>
            {children}
          </LocaleLayoutBody>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

