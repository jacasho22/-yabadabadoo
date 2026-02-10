'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { href: `/${locale}/legal/aviso-legal`, label: t('legal') },
    { href: `/${locale}/legal/privacidad`, label: t('privacy') },
    { href: `/${locale}/legal/cookies`, label: t('cookies') },
    { href: `/${locale}/legal/condiciones`, label: t('terms') },
  ];

  return (
    <footer className="bg-dark text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-5">
            <div className="relative w-48 h-16 mb-6">
              <Image 
                src="/images/logo.jpeg" 
                alt="Yabadabadoo Campers" 
                fill 
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              {locale === 'es' 
                ? 'Alquiler de camper con alma para aventureros que buscan libertad real. Conecta con la naturaleza sin renunciar al confort.'
                : 'Camper rental with soul for adventurers seeking real freedom. Connect with nature without sacrificing comfort.'}
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-secondary hover:text-dark transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="mailto:hola@yabadabadookampers.com" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-secondary hover:text-dark transition-all duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explore</h4>
              <nav className="flex flex-col gap-4">
                <Link href={`/${locale}/camper`} className="text-gray-400 hover:text-secondary text-sm font-medium transition-colors">
                  {locale === 'es' ? 'La Camper' : 'The Camper'}
                </Link>
                <Link href={`/${locale}/rutas`} className="text-gray-400 hover:text-secondary text-sm font-medium transition-colors">
                  {locale === 'es' ? 'Rutas Recomendadas' : 'Recommended Routes'}
                </Link>
                <Link href={`/${locale}/faq`} className="text-gray-400 hover:text-secondary text-sm font-medium transition-colors">
                  {locale === 'es' ? 'Preguntas Frecuentes' : 'FAQ'}
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
              <nav className="flex flex-col gap-4">
                {legalLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-gray-400 hover:text-secondary text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="text-secondary" />
                  <span>Iniesta, Albacete</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone size={16} className="text-secondary" />
                  <span>+34 645 613 670</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm font-medium">
            © {currentYear} Yabadabadoo Campers. {t('rights')}.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Crafted for Adventure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
