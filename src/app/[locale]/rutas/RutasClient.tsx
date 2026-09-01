/* Hallmark · macrostructure: Long Document (travel-journal voice)
 * theme: Rumbos-A (custom) · design-system: design.md · designed-as-app
 */
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Compass, Clock, ArrowRight } from 'lucide-react';

const routes = [
  {
    id: 'costa-blanca',
    days: 5,
    highlights: ['Benidorm', 'Altea', 'Calpe', 'Dénia'],
    title: { es: 'Ruta Costa Blanca', en: 'Costa Blanca Route' },
    description: {
      es: 'Recorre las mejores playas y calas del Mediterráneo. Desde Alicante hasta Dénia.',
      en: 'Discover the best beaches and coves of the Mediterranean. From Alicante to Dénia.'
    }
  },
  {
    id: 'pirineos',
    days: 7,
    highlights: ['Jaca', 'Ordesa', 'Ainsa', 'Benasque'],
    title: { es: 'Pirineos Aragoneses', en: 'Aragonese Pyrenees' },
    description: {
      es: 'Montaña, naturaleza y pueblos de postal. Parques nacionales y lagos glaciares.',
      en: 'Mountains, nature and postcard villages. National parks and glacial lakes.'
    }
  },
  {
    id: 'galicia',
    days: 6,
    highlights: ['Santiago', 'Rías Baixas', 'Costa da Morte'],
    title: { es: 'Galicia Mágica', en: 'Magical Galicia' },
    description: {
      es: 'Verde, mar y gastronomía. Descubre los secretos del noroeste salvaje.',
      en: 'Green landscapes, sea and gastronomy. Discover the secrets of the wild northwest.'
    }
  },
  {
    id: 'andalucia',
    days: 10,
    highlights: ['Sevilla', 'Granada', 'Ronda'],
    title: { es: 'Andalucía Esencial', en: 'Essential Andalusia' },
    description: {
      es: 'Flamenco, historia y sol. La ruta perfecta para descubrir la esencia del sur.',
      en: 'Flamenco, history and sun. The perfect route to discover the essence of the south.'
    }
  }
];

export default function RoutesPage() {
  const locale = useLocale();

  const fadeIn = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  return (
    <div style={{ backgroundColor: 'var(--color-paper)' }}>
      <section className="pt-40 pb-16">
        <div className="container-main max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="eyebrow">{locale === 'es' ? 'Cuaderno de rutas' : 'Route journal'}</p>
            <h1 className="mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(2.25rem, 3vw + 1rem, 3.25rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)', lineHeight: 1.1 }}>
              {locale === 'es' ? 'Rutas de autor' : 'Signature routes'}
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
              {locale === 'es'
                ? 'Cuatro itinerarios que hemos recorrido y recomendamos sin dudar — pensados para vivir la experiencia camper con calma, no a contrarreloj.'
                : 'Four itineraries we have driven ourselves and recommend without hesitation — designed to live the camper experience unhurried.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="photo-frame"
            style={{ maxWidth: '460px', margin: '2.5rem auto 0' }}
          >
            <div
              role="img"
              aria-label="Vista de carretera desde la camper, entre campos de amapolas"
              className="photo-deckle bg-cover bg-center"
              style={{ width: '100%', height: '300px', backgroundImage: "url('/images/interior-conduccion.jpg')" }}
            />
            <p className="photo-caption">Camino a ninguna parte en concreto</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-main max-w-3xl">
          <div style={{ borderTop: '1px solid var(--color-rule)' }}>
            {routes.map((route) => (
              <motion.article
                key={route.id}
                {...fadeIn}
                className="row-interactive py-10"
                style={{ borderBottom: '1px solid var(--color-rule)' }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <motion.div whileHover={{ rotate: 25 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    <Compass size={22} style={{ color: 'var(--color-accent)', marginTop: '0.2rem', flexShrink: 0 }} />
                  </motion.div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.005em', color: 'var(--color-ink)' }}>
                      {route.title[locale as 'es' | 'en']}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--color-ink-2)' }}>
                      <Clock size={13} />
                      {route.days} {locale === 'es' ? 'días' : 'days'}
                    </span>
                  </div>
                </div>

                <p className="text-base leading-relaxed mb-4 ml-9" style={{ color: 'var(--color-ink-2)', maxWidth: '60ch' }}>
                  {route.description[locale as 'es' | 'en']}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 ml-9 mb-4 text-xs uppercase" style={{ color: 'var(--color-ink-2)', letterSpacing: '0.05em' }}>
                  {route.highlights.map((place, i) => (
                    <span key={place}>
                      {place}
                      {i < route.highlights.length - 1 && <span aria-hidden className="ml-3" style={{ color: 'var(--color-rule)' }}>&middot;</span>}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/${locale}/reservar`}
                  className="link-underline ml-9 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'var(--color-ink)', textDecorationColor: 'var(--color-accent)' }}
                >
                  {locale === 'es' ? 'Prepara esta aventura' : 'Plan this adventure'}
                  <ArrowRight size={14} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-3xl text-center">
          <motion.div {...fadeIn}>
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 2.6vw + 1rem, 2.5rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)' }}>
              {locale === 'es' ? 'O crea tu propia ruta' : 'Or create your own path'}
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-ink-2)' }}>
              {locale === 'es' ? 'Donde sea, cuando sea. Tú decides el horizonte.' : 'Wherever, whenever. You decide the horizon.'}
            </p>
            <Link href={`/${locale}/reservar`} className="btn btn-primary px-10 py-4 text-base inline-block">
              {locale === 'es' ? 'Reservar' : 'Book now'}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
