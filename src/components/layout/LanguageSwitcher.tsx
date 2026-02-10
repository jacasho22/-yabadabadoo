'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    // Simply replace /[locale] with /[nextLocale]
    const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPathname || `/${nextLocale}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border ${
        isScrolled 
          ? 'bg-gray-50 border-gray-200 text-dark hover:border-primary hover:text-primary' 
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <Globe size={16} />
      <span className="text-xs font-bold uppercase tracking-widest">
        {locale === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
