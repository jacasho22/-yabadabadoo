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
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="relative w-36 h-10 mb-6">
              <Image 
                src="/images/logo.jpeg" 
                alt="Yabadabadoo Campers" 
                fill 
                className="object-contain object-left invert"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              {locale === 'es' 
                ? 'Alquiler de camper con alma para aventureros que buscan libertad real.'
                : 'Camper rental with soul for adventurers seeking real freedom.'}
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener" className="text-gray-500 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="mailto:hola@yabadabadookampers.com" className="text-gray-500 hover:text-white transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-[0.15em] text-xs">Explore</h4>
              <nav className="flex flex-col gap-3">
                <Link href={`/${locale}/camper`} className="text-gray-500 hover:text-white text-sm transition-colors">
                  {locale === 'es' ? 'La Camper' : 'The Camper'}
                </Link>
                <Link href={`/${locale}/rutas`} className="text-gray-500 hover:text-white text-sm transition-colors">
                  {locale === 'es' ? 'Rutas Recomendadas' : 'Recommended Routes'}
                </Link>
                <Link href={`/${locale}/faq`} className="text-gray-500 hover:text-white text-sm transition-colors">
                  {locale === 'es' ? 'Preguntas Frecuentes' : 'FAQ'}
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-[0.15em] text-xs">Legal</h4>
              <nav className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-medium mb-4 uppercase tracking-[0.15em] text-xs">Contact</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>Iniesta, Albacete</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Phone size={14} />
                  <span>+34 645 613 670</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {currentYear} Yabadabadoo Campers. {t('rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
