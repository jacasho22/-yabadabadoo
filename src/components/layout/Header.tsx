'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: `/${locale}/camper`, label: t('camper') },
    { href: `/${locale}/rutas`, label: t('routes') },
    { href: `/${locale}/faq`, label: t('faq') },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{
        backgroundColor: 'var(--color-paper)',
        boxShadow: scrolled ? '0 4px 16px -6px oklch(24% 0.02 50 / 0.18)' : 'none',
        transition: 'box-shadow 280ms var(--ease-out)',
      }}
    >
      <div className="container-main relative py-4 md:py-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute right-[var(--spacing-container)] top-4 p-2"
          style={{ color: 'var(--color-ink)' }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <p
          className="hidden md:block text-center text-[11px] font-semibold uppercase mb-2"
          style={{ color: 'var(--color-ink-2)', letterSpacing: '0.14em', fontFamily: 'var(--font-body)' }}
        >
          Alquiler de camper &middot; Iniesta, Cuenca
        </p>

        <Link href={`/${locale}`} className="block text-center">
          <span
            className="text-2xl md:text-3xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
          >
            Yabadabadoo Campers
          </span>
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-8 mt-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm transition-colors"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-2)' }}
            >
              {item.label}
            </Link>
          ))}
          <span aria-hidden className="h-3 w-px" style={{ backgroundColor: 'var(--color-rule)' }} />
          <LanguageSwitcher isScrolled={true} />
          <Link href={`/${locale}/reservar`} className="btn btn-primary text-sm py-2 px-5">
            <Calendar size={15} />
            {t('book')}
          </Link>
        </nav>

        <div aria-hidden className="hidden md:block absolute inset-x-0 bottom-0 h-px" style={{ backgroundColor: 'var(--color-rule)' }} />
      </div>
      <div aria-hidden className="h-px" style={{ backgroundColor: 'var(--color-rule)' }} />
      <div aria-hidden className="h-px mt-[3px]" style={{ backgroundColor: 'var(--color-rule)' }} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t"
            style={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-rule)' }}
          >
            <div className="flex flex-col p-6 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 border-b text-lg"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-ink)', borderColor: 'var(--color-rule)' }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--color-ink-2)' }}>Idioma</span>
                  <LanguageSwitcher isScrolled={true} />
                </div>
                <Link
                  href={`/${locale}/reservar`}
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary text-sm py-3 px-8 w-full justify-center"
                >
                  {t('book')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
