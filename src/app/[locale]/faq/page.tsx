import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import FaqClient from './FaqClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildFaqSchema } from '@/lib/schema';
import type { Locale } from '../../../i18n';

type Props = { params: Promise<{ locale: string }> };

const titles = {
  es: 'Preguntas Frecuentes | Yabadabadoo Campers',
  en: 'Frequently Asked Questions | Yabadabadoo Campers',
};

const descriptions = {
  es: 'Resuelve tus dudas sobre reservas, pagos, uso de la camper y cancelaciones antes de alquilar en Iniesta, Cuenca.',
  en: 'Get your questions answered about bookings, payments, camper usage and cancellations before renting in Iniesta, Cuenca.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale as Locale] ?? titles.es;
  const description = descriptions[locale as Locale] ?? descriptions.es;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { es: '/es/faq', en: '/en/faq', 'x-default': '/es/faq' },
    },
    openGraph: { title, description },
  };
}

export default async function Page() {
  const t = await getTranslations('faq');

  const faqItems = [
    { question: t('items.howToBook.question'), answer: t('items.howToBook.answer') },
    { question: t('items.pickup.question'), answer: t('items.pickup.answer') },
    { question: t('items.paymentMethods.question'), answer: t('items.paymentMethods.answer') },
    { question: t('items.deposit.question'), answer: t('items.deposit.answer') },
    { question: t('items.included.question'), answer: t('items.included.answer') },
    { question: t('items.cancellation.question'), answer: t('items.cancellation.answer') },
  ];

  return (
    <>
      <JsonLd data={buildFaqSchema(faqItems)} />
      <FaqClient />
    </>
  );
}
