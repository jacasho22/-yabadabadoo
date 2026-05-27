'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Sparkles, ShieldCheck, Map } from 'lucide-react';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true }
  };

  const featureItems = [
    { icon: Coffee, title: t('home.features.equipment'), desc: locale === 'es' ? 'Todo listo para tu café al amanecer.' : 'Everything ready for your sunrise coffee.' },
    { icon: Sparkles, title: t('home.features.bed'), desc: locale === 'es' ? 'Descansa como en casa, despierta en el paraíso.' : 'Rest like home, wake up in paradise.' },
    { icon: ShieldCheck, title: locale === 'es' ? 'Seguro Total' : 'Full Insurance', desc: locale === 'es' ? 'Viaja tranquilo con nuestra cobertura completa.' : 'Travel worry-free with our full coverage.' },
    { icon: Map, title: locale === 'es' ? 'Sin Límites' : 'No Limits', desc: locale === 'es' ? 'Tú marcas el camino, nosotros ponemos las ruedas.' : 'You set the path, we provide the wheels.' },
  ];

  return (
    <div className="bg-light min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/camper-rear.jpeg"
            alt="Camper with view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        <div className="container-main relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <p className="text-white/70 text-sm font-medium tracking-[0.2em] uppercase mb-6">
              {locale === 'es' ? 'Camper en Albacete' : 'Camper in Albacete'}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto lg:mx-0 font-light">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={`/${locale}/reservar`} className="btn btn-primary px-8 py-4 group">
                {t('hero.cta')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`/${locale}/camper`} className="btn btn-secondary px-8 py-4">
                {locale === 'es' ? 'Conocer la camper' : 'Explore the camper'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-white">
        <div className="container-main w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <motion.div {...fadeIn} className="w-full">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500 mb-4">
                {locale === 'es' ? 'Nuestra historia' : 'Our story'}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                {t('home.intro.title')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {t('home.intro.description')}
              </p>
            </motion.div>
            
            <motion.div {...fadeIn} className="space-y-10 lg:space-y-12 w-full">
              <div className="grid grid-cols-2 gap-6 lg:gap-8 w-full">
                <div className="w-full">
                  <p className="text-5xl lg:text-6xl font-bold">2024</p>
                  <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">{locale === 'es' ? 'Modelo' : 'Model'}</p>
                </div>
                <div className="w-full">
                  <p className="text-5xl lg:text-6xl font-bold">2</p>
                  <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">{locale === 'es' ? 'Personas' : 'People'}</p>
                </div>
              </div>
              
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden w-full">
                <Image 
                  src="/images/camper-side.jpeg" 
                  alt="Fiat Ducato Camper"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-light">
        <div className="container-main w-full">
          <motion.div {...fadeIn} className="mb-12 lg:mb-16 w-full text-center lg:text-left">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500 mb-4">
              {locale === 'es' ? 'Equipamiento' : 'Equipment'}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {t('home.features.title')}
            </h2>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full"
          >
            {featureItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors w-full"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black flex items-center justify-center mb-5 sm:mb-6">
                  <item.icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="section-padding bg-black text-white">
        <div className="container-main w-full">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto lg:mx-0 w-full">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500 mb-4">
              {locale === 'es' ? 'Testimonios' : 'Testimonials'}
            </p>
            <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-10 lg:mb-12">
              &quot;{locale === 'es' 
                ? 'No es solo una furgoneta, es un cambio de perspectiva. Despertar viendo el mar por la puerta trasera no tiene precio.'
                : 'It is not just a van, it is a change of perspective. Waking up seeing the sea through the back door is priceless.'}&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="font-semibold">Ana & Marc</p>
                <p className="text-sm text-gray-500">{locale === 'es' ? 'Aventureros' : 'Adventurers'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-main w-full">
          <motion.div 
            {...fadeIn}
            className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 border border-gray-100 w-full"
          >
            <div className="max-w-3xl mx-auto text-center w-full">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6">
                {locale === 'es' ? '¿Listo para arrancar?' : 'Ready to start?'}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12">
                {locale === 'es' 
                  ? 'Reserva ahora y asegura tus fechas para la aventura de tu vida.'
                  : 'Book now and secure your dates for the adventure of a lifetime.'}
              </p>
              <Link href={`/${locale}/reservar`} className="btn btn-primary px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg w-full sm:w-auto inline-block">
                {t('hero.cta')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
