import { NextRequest, NextResponse } from 'next/server';
import { getBookingAvailabilityMap } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const camperId = searchParams.get('camperId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!camperId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Check if it's a mock camper (id starts with 'mock-')
  if (camperId.startsWith('mock-')) {
    // Return available (true) with no blocked dates
    const range =
      startDate && endDate
        ? {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          }
        : undefined;
    return NextResponse.json({
      available: range ? true : undefined,
      blockedDates: [],
      existingBookings: [],
    });
  }

  try {
    const range =
      startDate && endDate
        ? {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          }
        : undefined;
    const { blockedDates, existingBookings } = await getBookingAvailabilityMap(
      camperId,
      range
    );

    const isAvailable = blockedDates.length === 0 && existingBookings.length === 0;

    return NextResponse.json({
      available: range ? isAvailable : undefined,
      blockedDates: blockedDates.map((blockedDate) => blockedDate.date.toISOString()),
      existingBookings: existingBookings.map((booking) => ({
        id: booking.id,
        start: booking.startDate.toISOString(),
        end: booking.endDate.toISOString(),
        status: booking.status,
      })),
    });
  } catch (error) {
    console.error('Availability check error:', error);
    // Return empty data if database is not available
    return NextResponse.json({
      available: true,
      blockedDates: [],
      existingBookings: [],
    });
  }
}
