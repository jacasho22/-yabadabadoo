'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Map, ShieldCheck, 
  Sparkles, Coffee, Heart, Camera
} from 'lucide-react';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/camper-rear.jpeg"
            alt="Camper with view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 mix-blend-multiply" />
        </div>
        
        {/* Floating Accents */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" 
        />

        <div className="container-main relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-[0.3em] text-secondary bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                {locale === 'es' ? 'Vive la Van Life' : 'Live the Van Life'}
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-2xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href={`/${locale}/reservar`} className="btn btn-secondary text-lg px-10 py-4 rounded-full group">
                  {t('hero.cta')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={`/${locale}/camper`} className="text-white font-bold text-lg hover:text-secondary transition-colors underline decoration-secondary underline-offset-8 decoration-2">
                  {locale === 'es' ? 'Explorar la camper' : 'Explore the camper'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-1" />
          </div>
        </motion.div>
      </section>

      {/* Intro Section - The Story */}
      <section className="section-padding overflow-hidden relative z-10 bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {t('home.intro.title')}
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed mb-10">
                {t('home.intro.description')}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-black text-primary mb-2">2024</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{locale === 'es' ? 'Modelo Nuevo' : 'Latest Model'}</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-2">100%</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{locale === 'es' ? 'Equipada' : 'Equipped'}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              className="relative aspect-square md:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl group"
            >
              {/* Actual Image */}
              <Image 
                src="/images/camper-side.jpeg" 
                alt="Fiat Ducato Camper"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                    <Camera size={20} />
                  </div>
                  <span className="font-bold text-lg">{locale === 'es' ? 'Vistas infinitas' : 'Infinite views'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-light relative z-10">
        <div className="container-main">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home.features.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              {locale === 'es' 
                ? 'Hemos cuidado cada detalle para que tu única preocupación sea disfrutar del camino.'
                : 'We have taken care of every detail so your only worry is to enjoy the road.'}
            </p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featureItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="bg-white p-10 rounded-3xl shadow-premium hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  <item.icon size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial / Mood Section */}
      <section className="section-padding relative z-10 bg-white">
        <div className="container-main text-center">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto">
            <Heart size={40} className="text-secondary mx-auto mb-10 animate-pulse" />
            <h2 className="text-3xl md:text-4xl italic font-display leading-tight mb-12">
              &quot;{locale === 'es' 
                ? 'No es solo una furgoneta, es un cambio de perspectiva. Despertar viendo el mar por la puerta trasera no tiene precio.'
                : 'It is not just a van, it is a change of perspective. Waking up seeing the sea through the back door is priceless.'}&quot;
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=200&auto=format&fit=crop" 
                  alt="Ana & Marc"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-bold">Ana & Marc</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{locale === 'es' ? 'Aventureros' : 'Adventurers'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding">
        <div className="container-main">
          <motion.div 
            {...fadeIn}
            className="bg-dark rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                {locale === 'es' ? '¿Listo para arrancar?' : 'Ready to start?'}
              </h2>
              <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto">
                {locale === 'es' 
                  ? 'Reserva ahora y asegura tus fechas para la aventura de tu vida.'
                  : 'Book now and secure your dates for the adventure of a lifetime.'}
              </p>
              <Link href={`/${locale}/reservar`} className="btn btn-secondary px-12 py-5 text-xl rounded-full shadow-2xl">
                {t('hero.cta')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
