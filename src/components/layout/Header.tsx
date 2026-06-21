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
      className="fixed top-0 left-0 right-0 z-[100] py-3 bg-white/80 backdrop-blur-md border-b border-gray-100/50"
    >
      <div className="container-main">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="relative w-36 h-10">
              <Image 
                src="/images/logo.jpeg" 
                alt="Yabadabadoo Campers" 
                fill 
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[15px] font-normal text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSwitcher isScrolled={true} />
              <Link 
                href={`/${locale}/reservar`} 
                className="btn btn-primary text-sm py-2 px-5"
              >
                <Calendar size={15} />
                {t('book')}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button - Apple Style */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation - FULL SCREEN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="flex flex-col p-6 gap-5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-black py-3 border-b border-gray-100 last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Idioma</span>
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
      </div>
    </header>
  );
}
