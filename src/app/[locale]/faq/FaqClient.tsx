/* Hallmark · macrostructure: Conversational FAQ
 * theme: Rumbos-A (custom) · design-system: design.md · designed-as-app
 */
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  MessageCircle,
  Calendar,
  CreditCard,
  Truck,
  AlertCircle,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

type FAQItem = { question: string; answer: string; };
type FAQCategory = { id: string; title: string; icon: LucideIcon; items: FAQItem[]; };

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

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: selectedCategory && category.id !== selectedCategory ? [] : category.items,
    }))
    .filter((category) => category.items.length > 0);

  const toggleItem = (id: string) => setActiveItem(activeItem === id ? null : id);

  return (
    <div style={{ backgroundColor: 'var(--color-paper)' }}>
      <section className="pt-40 pb-12">
        <div className="container-main max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="eyebrow">{locale === 'es' ? 'Soporte y ayuda' : 'Support & help'}</p>
            <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(2.25rem, 3vw + 1rem, 3.25rem)', letterSpacing: '-0.01em', color: 'var(--color-ink)', lineHeight: 1.1 }}>
              {t('title')}
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
              {locale === 'es' ? 'Resolvemos tus dudas para que tú solo pienses en el horizonte.' : 'We solve your doubts so you only think about the horizon.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-main max-w-3xl">
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10 text-sm" style={{ borderBottom: '1px solid var(--color-rule)', paddingBottom: '1rem' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="font-medium pb-1"
              style={{
                color: selectedCategory === null ? 'var(--color-ink)' : 'var(--color-ink-2)',
                borderBottom: selectedCategory === null ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
            >
              {locale === 'es' ? 'Todas' : 'All'}
            </button>
            {categories.map((c) => {
              const isActive = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className="inline-flex items-center gap-1.5 font-medium pb-1"
                  style={{
                    color: isActive ? 'var(--color-ink)' : 'var(--color-ink-2)',
                    borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  }}
                >
                  <c.icon size={14} />
                  {c.title}
                </button>
              );
            })}
          </div>

          <div className="space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id}>
                  <h2 className="eyebrow mb-1">{category.title}</h2>
                  <div style={{ borderTop: '1px solid var(--color-rule)' }}>
                    {category.items.map((item, idx) => {
                      const id = `${category.id}-${idx}`;
                      const isOpen = activeItem === id;
                      return (
                        <div key={id} style={{ borderBottom: '1px solid var(--color-rule)' }}>
                          <button onClick={() => toggleItem(id)} className="row-interactive w-full py-6 flex items-center justify-between text-left gap-6">
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.005em', color: 'var(--color-ink)' }}>
                              {item.question}
                            </span>
                            <ChevronDown
                              size={20}
                              style={{ color: 'var(--color-accent)', flexShrink: 0, transition: 'transform 220ms var(--ease-out)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <p className="pb-6 text-base leading-relaxed" style={{ color: 'var(--color-ink-2)', maxWidth: '60ch' }}>
                                  {item.answer}
                                </p>
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
              <div className="text-center py-16">
                <HelpCircle size={40} style={{ color: 'var(--color-rule)', margin: '0 auto 1rem' }} />
                <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
                  {locale === 'es' ? 'No encontramos nada' : 'No results found'}
                </h3>
                <p className="mb-6" style={{ color: 'var(--color-ink-2)' }}>
                  {locale === 'es' ? 'Intenta seleccionar otra categoría.' : 'Try selecting another category.'}
                </p>
                <button onClick={() => setSelectedCategory(null)} className="link-underline text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {locale === 'es' ? 'Ver todas las preguntas' : 'View all questions'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-20 pt-12 text-center" style={{ borderTop: '1px solid var(--color-rule)' }}>
            <MessageCircle size={28} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem' }} />
            <h3 className="mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--color-ink)' }}>
              {locale === 'es' ? '¿Sigues con dudas?' : 'Still have questions?'}
            </h3>
            <p className="mb-8" style={{ color: 'var(--color-ink-2)' }}>
              {locale === 'es' ? 'Nuestro equipo está listo para ayudarte personalmente.' : 'Our team is ready to help you personally.'}
            </p>
            <a href="https://wa.me/34645613670" target="_blank" rel="noopener noreferrer" className="btn btn-primary px-8 py-3 inline-flex">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
