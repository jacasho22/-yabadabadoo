import React from 'react';
import type { Metadata } from 'next';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; segment?: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <DashboardSidebar locale={locale} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
