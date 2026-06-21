import { NextResponse } from 'next/server';
import { ensureAdminAccess } from '@/lib/admin-auth';
import { getDashboardSnapshot } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorizedResponse = await ensureAdminAccess();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const snapshot = await getDashboardSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json(
      { error: 'No se pudieron cargar los datos del panel.' },
      { status: 500 }
    );
  }
}
