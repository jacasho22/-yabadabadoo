'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Compass, Clock } from 'lucide-react';

const routes = [
  {
    id: 'costa-blanca',
    days: 5,
    highlights: ['Benidorm', 'Altea', 'Calpe', 'Dénia'],
    title: { es: 'Ruta Costa Blanca', en: 'Costa Blanca Route' },
    gradient: 'from-[#4facfe] to-[#00f2fe]',
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
    gradient: 'from-[#667eea] to-[#764ba2]',
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
    gradient: 'from-[#134e5e] to-[#71b280]',
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
    gradient: 'from-[#f093fb] to-[#f5576c]',
    description: {
      es: 'Flamenco, historia y sol. La ruta perfecta para descubrir la esencia del sur.',
      en: 'Flamenco, history and sun. The perfect route to discover the essence of the south.'
    }
  }
];

export default function RoutesPage() {
  const locale = useLocale();

  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-primary bg-linear-to-br from-primary/30 via-dark to-dark opacity-90" />
        <div className="container-main relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center max-w-3xl mx-auto"
          >
             <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-[0.3em] text-secondary bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                Inspiration Hub
              </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              {locale === 'es' ? 'Rutas de Autor' : 'Signature Routes'}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-medium">
              {locale === 'es' ? 'Diseños exclusivos para vivir la experiencia camper al máximo.' : 'Exclusive journeys designed to live the camper experience to the fullest.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12">
            {routes.map((route, idx) => (
              <motion.article
                key={route.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className={`aspect-16/10 rounded-4xl bg-linear-to-br ${route.gradient} relative overflow-hidden mb-8 shadow-2xl`}>
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
                   <div className="absolute top-10 right-10 flex flex-col gap-4">
                      <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 text-white border-white/40">
                        <Clock size={16} />
                        <span className="text-sm font-bold">{route.days} {locale === 'es' ? 'Días' : 'Days'}</span>
                      </div>
                   </div>
                   <Compass size={120} className="absolute bottom-10 right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="px-6">
                  <h2 className="text-3xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {route.title[locale as 'es' | 'en']}
                  </h2>
                  <p className="text-lg text-gray-500 leading-relaxed mb-8">
                    {route.description[locale as 'es' | 'en']}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {route.highlights.map((place) => (
                      <span key={place} className="px-4 py-2 bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-100 italic">
                        {place}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/${locale}/reservar`}
                    className="inline-flex items-center gap-3 text-dark font-black tracking-widest uppercase text-xs hover:text-primary transition-all group/link"
                  >
                    {locale === 'es' ? 'Prepara esta aventura' : 'Join this adventure'}
                    <div className="w-10 h-0.5 bg-secondary group-hover/link:w-16 transition-all" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-dark">
        <div className="container-main">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                {locale === 'es' ? 'Crea tu propia ruta' : 'Create your own path'}
              </h2>
              <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto font-medium">
                {locale === 'es' ? 'Donde sea, cuando sea. Tú decides el horizonte.' : 'Wherever, whenever. You decide the horizon.'}
              </p>
              <Link href={`/${locale}/reservar`} className="btn btn-secondary px-12 py-5 rounded-2xl shadow-xl shadow-black/20 text-lg">
                {locale === 'es' ? 'Empezar ahora' : 'Start now'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
