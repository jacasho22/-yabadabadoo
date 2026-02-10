'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const darkHeroRoutes = [
    `/${locale}`,
    `/${locale}/`,
    `/${locale}/camper`,
    `/camper`,
    `/${locale}/rutas`,
    `/rutas`,
    `/${locale}/faq`,
    `/faq`,
    `/`
  ];
  const isDarkHeroPage = darkHeroRoutes.includes(pathname);
  const forceSolid = !isDarkHeroPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}/camper`, label: t('camper') },
    { href: `/${locale}/rutas`, label: t('routes') },
    { href: `/${locale}/faq`, label: t('faq') },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || forceSolid ? 'py-3 glass shadow-premium' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container-main">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-2">
            <div className="relative w-40 h-12">
              <Image 
                src="/images/logo.jpeg" 
                alt="Yabadabadoo Campers" 
                fill 
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold tracking-wide hover:text-secondary transition-colors duration-300 ${
                    scrolled || forceSolid ? 'text-dark' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-white/20" />
            
            <div className="flex items-center gap-6">
              <LanguageSwitcher isScrolled={scrolled || forceSolid} />
              <Link 
                href={`/${locale}/reservar`} 
                className={`btn btn-primary text-sm py-2.5 px-6 rounded-full group`}
              >
                <Calendar size={16} className="group-hover:scale-110 transition-transform" />
                {t('book')}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || forceSolid ? 'text-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl mt-4 rounded-2xl shadow-2xl border border-white/20"
            >
              <div className="flex flex-col p-6 gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-dark hover:text-primary py-2 border-b border-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4">
                  <LanguageSwitcher isScrolled={true} />
                  <Link 
                    href={`/${locale}/reservar`} 
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary text-sm py-3 px-8 rounded-full"
                  >
                    {t('book')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
