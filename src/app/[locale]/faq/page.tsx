'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircle, Calendar, CreditCard, Truck, AlertCircle, X, HelpCircle } from 'lucide-react';

type FAQItem = { question: string; answer: string; };
type FAQCategory = { id: string; title: string; icon: any; items: FAQItem[]; };

export default function FAQPage() {
  const t = useTranslations('faq');
  const locale = useLocale();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: FAQCategory[] = [
    {
      id: 'booking',
      title: t('categories.booking'),
      icon: Calendar,
      items: [
        { question: t('items.howToBook.question'), answer: t('items.howToBook.answer') },
        { question: t('items.pickup.question'), answer: t('items.pickup.answer') },
      ],
    },
    {
      id: 'payment',
      title: t('categories.payment'),
      icon: CreditCard,
      items: [
        { question: t('items.paymentMethods.question'), answer: t('items.paymentMethods.answer') },
        { question: t('items.deposit.question'), answer: t('items.deposit.answer') },
      ],
    },
    {
      id: 'usage',
      title: t('categories.usage'),
      icon: Truck,
      items: [
        { question: t('items.included.question'), answer: t('items.included.answer') },
      ],
    },
    {
      id: 'cancellation',
      title: t('categories.cancellation'),
      icon: AlertCircle,
      items: [
        { question: t('items.cancellation.question'), answer: t('items.cancellation.answer') },
      ],
    },
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesCategory = selectedCategory ? category.id === selectedCategory : true;
      return matchesCategory;
    })
  })).filter(category => category.items.length > 0);

  const toggleItem = (id: string) => setActiveItem(activeItem === id ? null : id);

  return (
    <div className="bg-light min-h-screen relative overflow-hidden">
      {/* Brand Floating Accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Subtle Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

      {/* Centered Branded Header (Dark Version) */}
      <section className="pt-48 pb-32 relative bg-dark">
        {/* Deep Gradient Background (Same as Rutas/Camper) */}
        <div className="absolute inset-0 bg-primary bg-linear-to-br from-primary/30 via-dark to-dark opacity-95" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />

        {/* Floating Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container-main max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-secondary bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              {locale === 'es' ? 'Soporte y Ayuda' : 'Support & Help'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
              {locale === 'es' 
                ? 'Resolvemos tus dudas para que tú solo pienses en el horizonte.' 
                : 'We solve your doubts so you only think about the horizon.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Branded Search & Filters (Adjusted for overlap) */}
      <section className="pb-32 relative z-20 -mt-12">
        <div className="container-main max-w-3xl">
          {/* Branded Category Chips */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                selectedCategory === null 
                  ? 'bg-secondary text-white shadow-xl shadow-secondary/20 scale-105' 
                  : 'bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary hover:bg-white'
              }`}
            >
              {locale === 'es' ? 'Todos' : 'All'}
            </button>
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = selectedCategory === c.id;
              return (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary hover:bg-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-current'} />
                  {c.title}
                </button>
              );
            })}
          </div>

          {/* Single Column FAQ List */}
          <div className="space-y-16">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="space-y-6">
                  <div className="flex items-center gap-6 mb-10 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <category.icon size={24} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">{category.title}</h2>
                    <div className="flex-1 h-px bg-linear-to-r from-primary/10 to-transparent" />
                  </div>
                  
                  <div className="space-y-4">
                    {category.items.map((item, idx) => {
                      const id = `${category.id}-${idx}`;
                      const isOpen = activeItem === id;
                      return (
                        <div 
                          key={id} 
                          className={`group rounded-[2rem] border transition-all duration-700 ${isOpen ? 'bg-white shadow-xl border-primary/5 ring-1 ring-primary/5' : 'bg-white/40 border-gray-50 hover:bg-white hover:shadow-lg'}`}
                        >
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full p-8 md:p-10 flex items-center justify-between text-left"
                          >
                            <span className={`font-bold text-xl md:text-2xl tracking-tighter transition-colors duration-500 ${isOpen ? 'text-primary' : 'text-dark/80 group-hover:text-dark'}`}>
                              {item.question}
                            </span>
                            <div className={`shrink-0 ml-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/5 text-primary group-hover:bg-primary/10'}`}>
                              <ChevronDown size={24} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                              >
                                <div className="px-8 md:px-10 pb-10 text-xl text-gray-500 leading-relaxed font-medium border-t border-gray-50/50 pt-8 max-w-2xl">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle size={48} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">
                  {locale === 'es' ? 'No encontramos nada' : 'No results found'}
                </h3>
                <p className="text-gray-400">
                  {locale === 'es' 
                    ? 'Intenta seleccionar otra categoría.' 
                    : 'Try selecting another category.'}
                </p>
                <button 
                  onClick={() => { setSelectedCategory(null); }}
                  className="mt-8 text-primary font-bold hover:underline"
                >
                  {locale === 'es' ? 'Ver todas las preguntas' : 'View all questions'}
                </button>
              </div>
            )}
          </div>

          {/* Branded Footer CTA */}
          <div className="mt-40 pt-24 border-t border-gray-100 text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageCircle size={36} className="text-secondary" />
              </div>
              <h3 className="text-3xl font-black text-dark mb-4 tracking-tighter">{locale === 'es' ? '¿Sigues con dudas?' : 'Still have questions?'}</h3>
              <p className="text-xl text-gray-400 mb-10 max-w-sm mx-auto font-medium">{locale === 'es' ? 'Nuestro equipo está listo para ayudarte personalmente.' : 'Our team is ready to help you personally.'}</p>
              <a 
                href="https://wa.me/34600000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary px-10 py-5 rounded-2xl text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform inline-flex"
              >
                Contactar por WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
