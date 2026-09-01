'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { href: `/${locale}/camper`, label: locale === 'es' ? 'La Camper' : 'The Camper' },
    { href: `/${locale}/rutas`, label: locale === 'es' ? 'Rutas' : 'Routes' },
    { href: `/${locale}/faq`, label: 'FAQ' },
  ];

  const legalLinks = [
    { href: `/${locale}/legal/aviso-legal`, label: t('legal') },
    { href: `/${locale}/legal/privacidad`, label: t('privacy') },
    { href: `/${locale}/legal/cookies`, label: t('cookies') },
    { href: `/${locale}/legal/condiciones`, label: t('terms') },
  ];

  return (
    <footer style={{ backgroundColor: 'var(--color-paper-2)', color: 'var(--color-ink)' }}>
      <div className="container-main pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr] lg:items-start">
          <div>
            <p
              className="text-3xl md:text-4xl mb-3"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              Yabadabadoo Campers
            </p>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-body)' }}>
              {locale === 'es'
                ? 'Alquiler de camper con alma para aventureros que buscan libertad real.'
                : 'Camper rental with soul for adventurers seeking real freedom.'}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: 'var(--color-ink)' }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid var(--color-rule)', color: 'var(--color-ink-2)', fontFamily: 'var(--font-body)' }}
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> Iniesta, Cuenca</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={13} /> +34 645 613 670</span>
            <a href="mailto:hola@yabadabadoocampers.com" className="inline-flex items-center gap-1.5">
              <Mail size={13} /> hola@yabadabadoocampers.com
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5">
              <Instagram size={13} /> Instagram
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-4">
                <Link href={link.href}>{link.label}</Link>
                {i < legalLinks.length - 1 && <span aria-hidden>&middot;</span>}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-body)' }}>
          &copy; {currentYear} Yabadabadoo Campers. {t('rights')}.
        </p>
      </div>
    </footer>
  );
}
