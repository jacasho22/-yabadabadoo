import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const camperId = searchParams.get('camperId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!camperId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Get blocked dates
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        camperId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    // Get existing bookings
    const existingBookings = await prisma.booking.findMany({
      where: {
        camperId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    const isAvailable = blockedDates.length === 0 && existingBookings.length === 0;

    return NextResponse.json({
      available: isAvailable,
      blockedDates: blockedDates.map((d: { date: Date }) => d.date.toISOString()),
      existingBookings: existingBookings.map((b: { startDate: Date; endDate: Date }) => ({
        start: b.startDate.toISOString(),
        end: b.endDate.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
