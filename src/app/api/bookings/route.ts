import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { camperId, startDate, endDate, customerData, paymentMethod } = body;

    // Validate required fields
    if (!camperId || !startDate || !endDate || !customerData || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check availability again
    const existingBooking = await prisma.booking.findFirst({
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

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Dates are no longer available' },
        { status: 409 }
      );
    }

    // Create or get customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerData.email }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          dni: customerData.dni,
          license: customerData.license,
        }
      });
    }

    // Calculate price (simplified - should match frontend logic)
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const pricePerDay = 8900; // cents
    const totalPrice = days * pricePerDay;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        camperId,
        customerId: customer.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        paymentMethod,
        status: 'PENDING',
      },
      include: {
        camper: true,
        customer: true,
      }
    });

    // TODO: Create Stripe/PayPal payment intent and return client secret
    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
      // paymentClientSecret: 'stripe_client_secret_here'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
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
