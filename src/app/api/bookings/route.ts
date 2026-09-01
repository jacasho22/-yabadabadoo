import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildBookingDraft, checkDbAvailability, getBookingAvailabilityMap } from '@/lib/dashboard-data';
import { createMockBooking } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, endDate, customerData } = body;
    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);
    const requestedCamperId =
      typeof body.camperId === 'string' && body.camperId.trim().length > 0
        ? body.camperId.trim()
        : undefined;

    // Validate required fields
    if (
      !startDate ||
      !endDate ||
      !customerData ||
      !customerData.name ||
      !customerData.email ||
      !customerData.phone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookingDraft = await buildBookingDraft(
      bookingStartDate,
      bookingEndDate,
      requestedCamperId
    );

    if (!bookingDraft || bookingDraft.pricing.nights <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking dates' },
        { status: 400 }
      );
    }

    const { blockedDates, existingBookings } = await getBookingAvailabilityMap(
      bookingDraft.camper.id,
      {
        startDate: bookingStartDate,
        endDate: bookingEndDate,
      }
    );

    if (blockedDates.length > 0 || existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Dates are no longer available' },
        { status: 409 }
      );
    }

    const useMockWrite =
      bookingDraft.camper.id.startsWith('mock-') || !(await checkDbAvailability());

    if (useMockWrite) {
      const booking = createMockBooking({
        camperId: bookingDraft.camper.id,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        paymentMethod: 'MANUAL',
        status: 'PENDING',
        notes: null,
        customerData: {
          name: String(customerData.name).trim(),
          email: String(customerData.email).trim(),
          phone: String(customerData.phone).trim(),
          dni: customerData.dni ? String(customerData.dni).trim() : undefined,
          license: customerData.license ? String(customerData.license).trim() : undefined,
        },
        source: 'PUBLIC',
      });

      return NextResponse.json({
        success: true,
        booking: {
          id: booking.id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          status: booking.status,
          camper: {
            id: booking.camper.id,
            name: booking.camper.name,
          },
        },
      });
    }

    const normalizedEmail = String(customerData.email).trim();
    const customer = await prisma.customer.upsert({
      where: { email: normalizedEmail },
      update: {
        name: String(customerData.name).trim(),
        phone: String(customerData.phone).trim(),
        dni: customerData.dni ? String(customerData.dni).trim() : null,
        license: customerData.license ? String(customerData.license).trim() : null,
      },
      create: {
        email: normalizedEmail,
        name: String(customerData.name).trim(),
        phone: String(customerData.phone).trim(),
        dni: customerData.dni ? String(customerData.dni).trim() : null,
        license: customerData.license ? String(customerData.license).trim() : null,
      },
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        camperId: bookingDraft.camper.id,
        customerId: customer.id,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        totalPrice: bookingDraft.pricing.totalPrice,
        paymentMethod: 'MANUAL',
        status: 'PENDING',
        source: 'PUBLIC',
      },
      include: {
        camper: true,
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        camper: {
          id: booking.camper.id,
          name: booking.camper.name,
        },
      },
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'No se pudo crear la reserva.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const camperId = searchParams.get('camperId');

  try {
    const bookings = await prisma.booking.findMany({
      where: camperId ? { camperId } : {},
      include: {
        camper: { select: { name: true, slug: true } },
        customer: { select: { name: true, email: true } },
        transactions: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
