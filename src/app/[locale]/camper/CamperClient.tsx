/* Hallmark · macrostructure: Photographic + Split Studio (spec sheet)
 * theme: Terracota mediterráneo (rev. 2) · design-system: design.md · designed-as-app
 * signature: paper-grain + framed/deckle-edge photo (primary gallery tile)
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Bed, ShowerHead, ChefHat, Package, Calendar,
  Fuel, Users, ThermometerSun, ChevronDown,
  Wind, Zap, MoveRight, Ruler, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import CountUp from '@/components/ui/CountUp';

export default function CamperPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeAccordion, setActiveAccordion] = useState<string | null>('equipment');

  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  const specs = [
    { icon: Calendar, label: t('camper.specs.year'), value: '2024' },
    { icon: Package, label: t('camper.specs.brand'), value: 'Fiat Ducato' },
    { icon: Users, label: t('camper.specs.capacity'), value: t('camper.specs.people') },
    { icon: Fuel, label: locale === 'es' ? 'Motor' : 'Engine', value: '140 CV' },
  ];

  const features = [
    {
      id: 'equipment',
      title: locale === 'es' ? 'Equipamiento' : 'Equipment',
      items: [
        { icon: Bed, label: locale === 'es' ? 'Cama doble viscoelástica (140x200)' : 'Memory foam double bed (140x200)' },
        { icon: ShowerHead, label: locale === 'es' ? 'Baño completo con agua caliente' : 'Full bathroom with hot water' },
        { icon: ChefHat, label: locale === 'es' ? 'Cocina de diseño con 2 fuegos' : 'Designer kitchen with 2 burners' },
        { icon: Wind, label: locale === 'es' ? 'Climatizador estacionario' : 'Stationary climate control' },
      ]
    },
    {
      id: 'extras',
      title: locale === 'es' ? 'Pack de aventura incluido' : 'Adventure pack included',
      items: [
        { icon: Ruler, label: locale === 'es' ? 'Toldos, mesa y sillas de exterior' : 'Awnings, table and outdoor chairs' },
        { icon: Zap, label: locale === 'es' ? 'Placa solar y batería litio' : 'Solar panel and lithium battery' },
        { icon: Package, label: locale === 'es' ? 'Menaje de cocina premium' : 'Premium kitchenware' },
        { icon: ThermometerSun, label: locale === 'es' ? 'Aislamiento térmico superior' : 'Superior thermal insulation' },
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-paper)' }}>
      {/* Hero — typographic; the framed/deckle signature photo lives in the gallery below */}
      <section className="relative pt-40 pb-12">
        <div className="container-main w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-2xl">
            <p className="eyebrow">{locale === 'es' ? 'Edición 2024' : '2024 Edition'}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-display)', color: 'var(--color-ink)', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              {t('camper.title')}
            </h1>
            <p className="text-lg mt-5 max-w-xl" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-body)' }}>
              {t('camper.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-main">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              {...fadeIn}
              className="photo-frame"
              style={{ flex: '1 1 480px', maxWidth: '560px', width: '100%' }}
            >
              <div
                role="img"
                aria-label="Camper Yabadabadoo, vista frontal al atardecer"
                className="photo-deckle bg-cover bg-center"
                style={{ width: '100%', height: '380px', backgroundImage: "url('/images/van-atardecer-frontal.jpg')" }}
              />
              <p className="photo-caption">Iniesta, verano 2026</p>
            </motion.div>
            <div className="grid grid-rows-3 gap-4 w-full" style={{ flex: '1 1 320px', minHeight: '380px' }}>
              <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="photo-zoom relative" style={{ borderRadius: 'var(--radius-md)' }}>
                <Image src="/images/interior-cocina.jpg" alt="Cocina equipada de la camper" fill className="object-cover" />
              </motion.div>
              <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.15 }} className="photo-zoom relative" style={{ borderRadius: 'var(--radius-md)' }}>
                <Image src="/images/interior-bano.jpg" alt="Baño completo de la camper" fill className="object-cover" />
              </motion.div>
              <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="photo-zoom relative" style={{ borderRadius: 'var(--radius-md)' }}>
                <Image src="/images/interior-cama-dia.jpg" alt="Cama doble de la camper" fill className="object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Spec sheet — tabular, not cards */}
      <section className="pb-8 md:pb-12">
        <div className="container-main">
          <div style={{ borderTop: '1px solid var(--color-rule)' }}>
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className="row-interactive flex items-center justify-between py-4"
                style={{ borderBottom: '1px solid var(--color-rule)' }}
              >
                <span className="inline-flex items-center gap-3 text-sm" style={{ color: 'var(--color-ink-2)' }}>
                  <spec.icon size={16} style={{ color: 'var(--color-accent)' }} />
                  {spec.label}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split: story + accordion / sticky price */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <motion.div {...fadeIn}>
              <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 2.6vw + 1rem, 2.5rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)' }}>
                {locale === 'es' ? 'La vida secreta de Yaba' : 'The secret life of Yaba'}
              </h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--color-ink-2)' }}>
                {locale === 'es'
                  ? 'Hemos diseñado el espacio pensando en la funcionalidad extrema sin perder el toque de hogar. Cada centímetro cuenta para tu confort.'
                  : 'We have designed the space with extreme functionality in mind without losing the home feel. Every inch counts for your comfort.'}
              </p>
              {locale === 'es' && (
                <div className="mb-10 space-y-4 text-lg leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Pet-friendly.</strong> Viaja con tu mascota sin preocupaciones — la furgoneta está preparada para que todos disfrutéis.</p>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Ideal para escapadas de fin de semana.</strong> Perfecta para desconectar cerca de casa, en Albacete y Cuenca.</p>
                  <p><strong style={{ color: 'var(--color-ink)' }}>La Manchuela a tu alcance.</strong> Iniesta, Motilla del Palancar, Quintanar del Rey y alrededores, a un paso.</p>
                  <p><strong style={{ color: 'var(--color-ink)' }}>Precios transparentes.</strong> 140€/día con kilometraje ilimitado, seguro a todo riesgo y kit de bienvenida incluido.</p>
                </div>
              )}

              <div className="space-y-3">
                {features.map((section) => (
                  <div key={section.id} style={{ borderTop: '1px solid var(--color-rule)', borderBottom: activeAccordion === section.id ? undefined : '1px solid var(--color-rule)' }}>
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)}
                      className="row-interactive w-full py-5 flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{section.title}</h3>
                      <ChevronDown
                        size={20}
                        style={{ color: 'var(--color-accent)', transition: 'transform 220ms var(--ease-out)', transform: activeAccordion === section.id ? 'rotate(180deg)' : 'none' }}
                      />
                    </button>

                    {activeAccordion === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="pb-6"
                        style={{ borderBottom: '1px solid var(--color-rule)' }}
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <item.icon size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                              <span className="text-sm" style={{ color: 'var(--color-ink-2)' }}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="lg:sticky lg:top-32 p-8"
              style={{ backgroundColor: 'var(--color-paper-2)', borderRadius: 'var(--radius-md)' }}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="eyebrow mb-1">{locale === 'es' ? 'Precio' : 'Price'}</div>
                  <div className="flex items-baseline gap-2">
                    <CountUp
                      value={140}
                      format={(v) => `${Math.round(v)}€`}
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '2.5rem', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}
                    />
                    <span style={{ color: 'var(--color-ink-2)' }}>/ {locale === 'es' ? 'día' : 'day'}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)', letterSpacing: '0.06em' }}>
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
                  {locale === 'es' ? 'Disponible' : 'Available'}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  locale === 'es' ? 'Kilometraje ilimitado' : 'Unlimited mileage',
                  locale === 'es' ? 'Seguro a todo riesgo' : 'Comprehensive insurance',
                  locale === 'es' ? 'Kit de bienvenida incluido' : 'Welcome kit included',
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-ink-2)' }}>
                    <CheckCircle2 size={17} style={{ color: 'var(--color-accent)' }} />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <Link href={`/${locale}/reservar`} className="btn btn-primary w-full py-4 text-base group">
                {t('camper.cta')}
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
