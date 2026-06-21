import { redirect } from 'next/navigation';
import DashboardControlPanel from '@/components/dashboard/DashboardControlPanel';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getDashboardSnapshot } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardBookingsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!(await isAdminAuthenticated())) {
    redirect(`/${locale}/dashboard/login`);
  }

  const snapshot = await getDashboardSnapshot();

  return <DashboardControlPanel initialData={snapshot} initialSection="bookings" />;
}
