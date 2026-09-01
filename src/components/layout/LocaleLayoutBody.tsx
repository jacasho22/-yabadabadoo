'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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
      <div className="paper-grain" aria-hidden />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
