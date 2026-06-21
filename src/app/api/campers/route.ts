import { NextResponse } from 'next/server';
import { getCampers, getPrimaryCamper } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [campers, primaryCamper] = await Promise.all([getCampers(), getPrimaryCamper()]);
    return NextResponse.json({
      campers,
      primaryCamperId: primaryCamper?.id ?? null,
    });
  } catch (error) {
    console.error('Campers fetch error:', error);
    // Return empty array if database is not available
    return NextResponse.json({
      campers: [],
      primaryCamperId: null,
    });
  }
}
