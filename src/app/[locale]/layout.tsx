import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../i18n';
import LocaleLayoutBody from '../../components/layout/LocaleLayoutBody';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/seo';
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

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
  
  const title = titles[locale as Locale] || titles.es;
  const description = descriptions[locale as Locale] || descriptions.es;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: locale === 'es'
      ? ['alquiler camper iniesta', 'alquiler camper cuenca', 'alquiler camper albacete', 'furgoneta camperizada alquiler', 'alquiler camper pet friendly', 'escapada fin de semana camper', 'alquiler camper la manchuela', 'camper para viajar con perros', 'alquiler camper particular', 'precio alquiler camper']
      : ['camper rental', 'campervan Spain', 'Fiat Ducato', 'camper trip'],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/es',
        en: '/en',
        'x-default': '/es',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      siteName: 'Yabadabadoo Campers',
      images: [{ url: '/images/camper-side.jpeg', width: 2048, height: 1536, alt: 'Camper Yabadabadoo junto al agua' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/camper-side.jpeg'],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${fraunces.variable} ${publicSans.variable}`}>
      <head>
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebsiteSchema()} />
      </head>
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

