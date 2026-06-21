'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

interface Props {
  children: React.ReactNode;
}

export default function LocaleLayoutBody({ children }: Props) {
  const pathname = usePathname();

  // Dashboard routes (including login) manage their own layout.
  const isDashboard = pathname.includes('/dashboard');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
