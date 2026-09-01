import type { Metadata } from 'next';
import CamperClient from './CamperClient';
import type { Locale } from '../../../i18n';

type Props = { params: Promise<{ locale: string }> };

const titles = {
  es: 'La Camper: Fiat Ducato 2024 | Yabadabadoo Campers',
  en: 'The Camper: 2024 Fiat Ducato | Yabadabadoo Campers',
};

const descriptions = {
  es: 'Furgoneta camperizada Fiat Ducato 2024, pet friendly. Cama doble viscoelástica, baño completo, cocina equipada. 140€/día, kilometraje ilimitado y seguro a todo riesgo.',
  en: 'Camperized Fiat Ducato 2024, pet friendly. Memory foam double bed, full bathroom, equipped kitchen. €140/day, unlimited mileage and comprehensive insurance.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale as Locale] ?? titles.es;
  const description = descriptions[locale as Locale] ?? descriptions.es;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/camper`,
      languages: { es: '/es/camper', en: '/en/camper', 'x-default': '/es/camper' },
    },
    openGraph: { title, description },
  };
}

export default function Page() {
  return <CamperClient />;
}
