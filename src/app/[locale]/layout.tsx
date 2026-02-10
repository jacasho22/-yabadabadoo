import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../i18n';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    es: 'Alquiler Camper España | Yabadabadoo Campers',
    en: 'Camper Van Rental Spain | Yabadabadoo Campers'
  };
  
  const descriptions = {
    es: 'Alquila nuestra Fiat Ducato 2024 totalmente equipada. Tu próxima aventura empieza aquí. Cama doble, ducha, cocina completa.',
    en: 'Rent our fully equipped 2024 Fiat Ducato. Your next adventure starts here. Double bed, shower, full kitchen.'
  };
  
  return {
    title: titles[locale as Locale] || titles.es,
    description: descriptions[locale as Locale] || descriptions.es,
    keywords: locale === 'es' 
      ? ['alquiler camper', 'furgoneta camper', 'camper España', 'Fiat Ducato', 'viaje camper']
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
  console.log('LocaleLayout Rendering for locale:', locale);
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
