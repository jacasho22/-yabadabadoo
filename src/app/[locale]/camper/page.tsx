'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Bed, ShowerHead, ChefHat, Package, Calendar, 
  Fuel, Users, Ruler, ThermometerSun, ChevronDown,
  Wind, Zap, MoveRight, Star, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

export default function CamperPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeAccordion, setActiveAccordion] = useState<string | null>('equipment');

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const specs = [
    { icon: Calendar, label: t('camper.specs.year'), value: '2024' },
    { icon: Star, label: t('camper.specs.brand'), value: 'Fiat Ducato' },
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
      title: 'Pack de Aventura Incluido',
      items: [
        { icon: Ruler, label: locale === 'es' ? 'Toldos, mesa y sillas de exterior' : 'Awnings, table and outdoor chairs' },
        { icon: Zap, label: locale === 'es' ? 'Placa solar y batería litio' : 'Solar panel and lithium battery' },
        { icon: Package, label: locale === 'es' ? 'Menaje de cocina premium' : 'Premium kitchenware' },
        { icon: ThermometerSun, label: locale === 'es' ? 'Aislamiento térmico superior' : 'Superior thermal insulation' },
      ]
    }
  ];

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-dark">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/camper-awning.jpeg" 
            alt="Camper Background" 
            fill 
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent opacity-90 z-0" />
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-0.5 bg-secondary rounded-full" />
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">
                Premium Edition
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter">
              {t('camper.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mb-12">
              {t('camper.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Carousel (Simplified for now, but aesthetic) */}
      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-12 gap-6 h-[400px] md:h-[600px]">
            <motion.div 
              {...fadeIn}
              className="col-span-12 md:col-span-8 rounded-4xl overflow-hidden relative group"
            >
              <Image 
                src="/images/camper-side.jpeg" 
                alt="Camper Side View" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-60" />
            </motion.div>
            <div className="hidden md:grid col-span-4 grid-rows-2 gap-6">
              <motion.div 
                 {...fadeIn}
                 transition={{ delay: 0.2 }}
                 className="rounded-4xl overflow-hidden relative group"
              >
                <Image 
                  src="/images/camper-interior.jpeg" 
                  alt="Camper Interior" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-all" />
              </motion.div>
              <motion.div 
                 {...fadeIn}
                 transition={{ delay: 0.3 }}
                 className="rounded-4xl overflow-hidden relative group"
              >
                <Image 
                  src="/images/camper-rear.jpeg" 
                  alt="Camper Rear View" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-all" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Grid */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-main">
          <div className="grid md:grid-cols-4 gap-8">
            {specs.map((spec, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-light border border-gray-100 flex flex-col items-center text-center group hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-500">
                  <spec.icon size={24} className="text-primary group-hover:text-white transition-all" />
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{spec.label}</div>
                <div className="text-2xl font-black text-dark">{spec.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Features & Details */}
      <section className="section-padding overflow-hidden">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">
                {locale === 'es' ? 'La vida secreta de Yaba' : 'The secret life of Yaba'}
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed mb-12">
                {locale === 'es' 
                  ? 'Hemos diseñado el espacio pensando en la funcionalidad extrema sin perder el toque de hogar. Cada centímetro cuenta para tu confort.'
                  : 'We have designed the space with extreme functionality in mind without losing the home feel. Every inch counts for your comfort.'}
              </p>
              
              <div className="space-y-6">
                {features.map((section) => (
                  <div key={section.id} className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)}
                      className="w-full p-8 flex items-center justify-between text-left bg-white"
                    >
                      <h3 className="text-xl font-bold text-dark">{section.title}</h3>
                      <ChevronDown 
                        size={24} 
                        className={`text-primary transition-transform duration-500 ${activeAccordion === section.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {activeAccordion === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="p-8 pt-0 bg-white"
                      >
                        <div className="grid sm:grid-cols-2 gap-6">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                                <item.icon size={18} className="text-primary" />
                              </div>
                              <span className="text-gray-600 font-medium">{item.label}</span>
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
              className="lg:sticky lg:top-32 bg-white rounded-[3rem] p-10 shadow-premium border border-gray-50"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Precio</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary">89€</span>
                    <span className="text-gray-400 text-lg font-medium">/ día</span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-secondary/10 rounded-full text-secondary font-bold text-sm">
                  {locale === 'es' ? 'En stock' : 'Available'}
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-gray-600">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span>{locale === 'es' ? 'Kilometraje ilimitado' : 'Unlimited mileage'}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span>{locale === 'es' ? 'Seguro a todo riesgo' : 'Comprehensive insurance'}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span>{locale === 'es' ? 'Kit de bienvenida incluido' : 'Welcome kit included'}</span>
                </div>
              </div>

              <Link 
                href={`/${locale}/reservar`}
                className="btn btn-primary w-full py-5 rounded-2xl text-xl shadow-2xl group"
              >
                {t('camper.cta')}
                <MoveRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
