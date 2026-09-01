import type { Metadata } from 'next';
import RutasClient from './RutasClient';
import type { Locale } from '../../../i18n';

type Props = { params: Promise<{ locale: string }> };

const titles = {
  es: 'Rutas de Autor en Camper | Yabadabadoo Campers',
  en: 'Signature Camper Routes | Yabadabadoo Campers',
};

const descriptions = {
  es: 'Cuatro rutas recomendadas en camper: Costa Blanca, Pirineos Aragoneses, Galicia y Andalucía. Itinerarios que hemos recorrido nosotros mismos.',
  en: 'Four recommended camper routes: Costa Blanca, Aragonese Pyrenees, Galicia and Andalusia. Itineraries we have driven ourselves.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale as Locale] ?? titles.es;
  const description = descriptions[locale as Locale] ?? descriptions.es;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/rutas`,
      languages: { es: '/es/rutas', en: '/en/rutas', 'x-default': '/es/rutas' },
    },
    openGraph: { title, description },
  };
}

export default function Page() {
  return <RutasClient />;
}
