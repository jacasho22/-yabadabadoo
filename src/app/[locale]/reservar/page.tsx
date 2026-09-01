import type { Metadata } from 'next';
import ReservarClient from './ReservarClient';
import type { Locale } from '../../../i18n';

type Props = { params: Promise<{ locale: string }> };

const titles = {
  es: 'Reserva tu Camper Online | Yabadabadoo Campers',
  en: 'Book Your Camper Online | Yabadabadoo Campers',
};

const descriptions = {
  es: 'Elige fechas, consulta disponibilidad en tiempo real y reserva tu furgoneta camperizada en Iniesta, Cuenca. Confirmación inmediata.',
  en: 'Pick your dates, check real-time availability and book your camperized van in Iniesta, Cuenca. Immediate confirmation.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale as Locale] ?? titles.es;
  const description = descriptions[locale as Locale] ?? descriptions.es;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/reservar`,
      languages: { es: '/es/reservar', en: '/en/reservar', 'x-default': '/es/reservar' },
    },
    openGraph: { title, description },
  };
}

export default function Page() {
  return <ReservarClient />;
}
