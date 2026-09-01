/* Hallmark · macrostructure: Photographic · H6 knobs: image=framed/deckle-edge, caption=below
 * theme: Terracota mediterráneo (rev. 2) · design-system: design.md · designed-as-app
 * signature: paper-grain + framed/deckle-edge hero photo
 * nav: N6 Newspaper masthead · footer: Ft1 Mast-headed
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Sparkles, ShieldCheck, Map } from 'lucide-react';
import CountUp from '@/components/ui/CountUp';

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  const featureItems = [
    { icon: Coffee, title: t('home.features.equipment'), desc: locale === 'es' ? 'Todo listo para tu café al amanecer.' : 'Everything ready for your sunrise coffee.' },
    { icon: Sparkles, title: t('home.features.bed'), desc: locale === 'es' ? 'Descansa como en casa, despierta en el paraíso.' : 'Rest like home, wake up in paradise.' },
    { icon: ShieldCheck, title: locale === 'es' ? 'Seguro Total' : 'Full Insurance', desc: locale === 'es' ? 'Viaja tranquilo con nuestra cobertura completa.' : 'Travel worry-free with our full coverage.' },
    { icon: Map, title: locale === 'es' ? 'Sin Límites' : 'No Limits', desc: locale === 'es' ? 'Tú marcas el camino, nosotros ponemos las ruedas.' : 'You set the path, we provide the wheels.' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-paper)' }}>
      {/* Hero — framed / deckle-edge photo, papel de viaje signature */}
      <section className="relative pt-40 pb-16 md:pb-20">
        <div className="container-main flex flex-wrap items-center gap-14">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            className="flex-1"
            style={{ minWidth: '320px' }}
          >
            <motion.p variants={heroItem} className="eyebrow">
              {locale === 'es' ? 'Iniesta · Cuenca' : 'Iniesta · Cuenca, Spain'}
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="mb-5"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-display)', color: 'var(--color-ink)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="text-lg mb-8 max-w-xl"
              style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-body)' }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div variants={heroItem} className="flex flex-wrap items-center gap-6">
              <Link href={`/${locale}/reservar`} className="btn btn-primary group">
                {t('hero.cta')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`/${locale}/camper`} className="link-underline text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                {locale === 'es' ? 'Conocer la camper' : 'Explore the camper'}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="photo-frame"
            style={{ flex: '1 1 420px', maxWidth: '520px', margin: '0 auto' }}
          >
            <div
              role="img"
              aria-label="Camper Yabadabadoo al atardecer junto al mar"
              className="photo-deckle bg-cover bg-center"
              style={{ width: '100%', height: '380px', backgroundImage: "url('/images/van-atardecer-lateral.jpg')" }}
            />
            <p className="photo-caption">Atardecer en ruta</p>
          </motion.div>
        </div>
      </section>

      {/* Intro — story + specs */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div {...fadeIn}>
              <p className="eyebrow">{locale === 'es' ? 'Tu opción ideal' : 'Our story'}</p>
              <h2
                className="mb-6"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 2.6vw + 1rem, 2.75rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)' }}
              >
                {t('home.intro.title')}
              </h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--color-ink-2)' }}>
                {t('home.intro.description')}
              </p>
              {locale === 'es' && (
                <div className="space-y-4 text-lg leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Ubicación estratégica.</strong> Estamos en Iniesta, punto de partida perfecto hacia Cuenca, Albacete, Requena y Utiel.</p>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Pet-friendly.</strong> Perfecta para viajar con perros, hacer una escapada de fin de semana o descubrir pueblos como Motilla del Palancar y Quintanar del Rey.</p>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Precios competitivos.</strong> Kilometraje ilimitado y todo incluido, sin sorpresas de última hora.</p>
                </div>
              )}
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div className="grid grid-cols-2" style={{ borderTop: '1px solid var(--color-rule)' }}>
                <div className="py-5 pr-4" style={{ borderRight: '1px solid var(--color-rule)' }}>
                  <CountUp value={2024} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2.5rem', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }} />
                  <p className="text-xs uppercase mt-1" style={{ letterSpacing: '0.1em', color: 'var(--color-ink-2)' }}>{locale === 'es' ? 'Modelo' : 'Model'}</p>
                </div>
                <div className="py-5 pl-4">
                  <CountUp value={2} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2.5rem', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }} />
                  <p className="text-xs uppercase mt-1" style={{ letterSpacing: '0.1em', color: 'var(--color-ink-2)' }}>{locale === 'es' ? 'Personas' : 'People'}</p>
                </div>
              </div>

              <div className="photo-zoom relative aspect-[3/4]" style={{ borderRadius: 'var(--radius-md)' }}>
                <Image src="/images/interior-cama-mar.jpg" alt="Vistas al mar desde la cama de la camper" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipment — hairline list, not cards */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-paper-2)' }}>
        <div className="container-main">
          <motion.div {...fadeIn} className="mb-12 max-w-xl">
            <p className="eyebrow">{locale === 'es' ? 'Equipamiento' : 'Equipment'}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 2.6vw + 1rem, 2.75rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)' }}>
              {t('home.features.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2" style={{ borderTop: '1px solid var(--color-rule)' }}>
            {featureItems.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                className="row-interactive flex items-start gap-4 py-7 px-1 md:px-6"
                style={{ borderBottom: '1px solid var(--color-rule)', borderRight: idx % 2 === 0 ? '1px solid var(--color-rule)' : undefined }}
              >
                <motion.div whileHover={{ scale: 1.15, rotate: -4 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                  <item.icon size={20} style={{ color: 'var(--color-accent)', marginTop: '0.2rem', flexShrink: 0 }} />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-ink)' }}>
        <div className="container-main">
          <motion.div {...fadeIn} className="max-w-3xl">
            <p className="eyebrow" style={{ color: 'oklch(80% 0.1 40)' }}>{locale === 'es' ? 'Testimonios' : 'Testimonials'}</p>
            <blockquote
              className="mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.5rem, 2.2vw + 1rem, 2.35rem)', lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--color-paper)' }}
            >
              &quot;{locale === 'es'
                ? 'No es solo una furgoneta, es un cambio de perspectiva. Despertar viendo el mar por la puerta trasera no tiene precio.'
                : 'It is not just a van, it is a change of perspective. Waking up seeing the sea through the back door is priceless.'}&quot;
            </blockquote>
            <p className="text-sm" style={{ color: 'oklch(75% 0.01 100)', fontFamily: 'var(--font-body)' }}>
              Ana &amp; Marc &middot; {locale === 'es' ? 'Aventureros' : 'Adventurers'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-main">
          <motion.div {...fadeIn} className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 2.6vw + 1rem, 2.75rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)' }}>
              {locale === 'es' ? '¿Listo para arrancar?' : 'Ready to start?'}
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-ink-2)' }}>
              {locale === 'es' ? 'Reserva ahora y asegura tus fechas para la aventura de tu vida.' : 'Book now and secure your dates for the adventure of a lifetime.'}
            </p>
            <Link href={`/${locale}/reservar`} className="btn btn-primary px-10 py-4 text-base inline-block">
              {t('hero.cta')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
