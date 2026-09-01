import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import type { Locale } from '../../i18n';

type Props = { params: Promise<{ locale: string }> };

const titles = {
  es: 'Alquiler Camper Iniesta | Cuenca y Albacete | Yabadabadoo Campers',
  en: 'Camper Van Rental Spain | Yabadabadoo Campers',
};

const descriptions = {
  es: 'Alquiler de furgonetas camperizadas en Iniesta, Cuenca y Albacete. Camper pet friendly para escapadas de fin de semana, viajar con perros, cerca de Requena y Utiel, la Manchuela, Motilla del Palancar y Quintanar del Rey.',
  en: 'Rent our fully equipped 2024 Fiat Ducato. Your next adventure starts here. Double bed, shower, full kitchen.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale as Locale] ?? titles.es;
  const description = descriptions[locale as Locale] ?? descriptions.es;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en', 'x-default': '/es' },
    },
    openGraph: { title, description },
  };
}

export default function Page() {
  return <HomeClient />;
}
