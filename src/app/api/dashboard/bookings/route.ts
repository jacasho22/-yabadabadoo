import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureAdminAccess } from '@/lib/admin-auth';
import { buildBookingDraft, getBookingAvailabilityMap } from '@/lib/dashboard-data';

export async function POST(request: NextRequest) {
  const unauthorizedResponse = await ensureAdminAccess();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const body = await request.json();
    const camperId = String(body.camperId ?? '').trim();
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const paymentMethod = String(body.paymentMethod ?? 'BANK_TRANSFER');
    const status = String(body.status ?? 'CONFIRMED');
    const notes = body.notes ? String(body.notes) : null;
    const customerData = body.customerData ?? {};

    if (
      !camperId ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      !customerData.name ||
      !customerData.email ||
      !customerData.phone
    ) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios para crear la reserva.' },
        { status: 400 }
      );
    }

    const draft = await buildBookingDraft(startDate, endDate, camperId);
    if (!draft || draft.pricing.nights <= 0) {
      return NextResponse.json(
        { error: 'Las fechas seleccionadas no son válidas.' },
        { status: 400 }
      );
    }

    const { blockedDates, existingBookings } = await getBookingAvailabilityMap(camperId, {
      startDate,
      endDate,
    });

    if (blockedDates.length > 0 || existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Las fechas ya no están disponibles.' },
        { status: 409 }
      );
    }

    const customer = await prisma.customer.upsert({
      where: { email: String(customerData.email).trim() },
      update: {
        name: String(customerData.name).trim(),
        phone: String(customerData.phone).trim(),
        dni: customerData.dni ? String(customerData.dni).trim() : null,
        license: customerData.license ? String(customerData.license).trim() : null,
      },
      create: {
        email: String(customerData.email).trim(),
        name: String(customerData.name).trim(),
        phone: String(customerData.phone).trim(),
        dni: customerData.dni ? String(customerData.dni).trim() : null,
        license: customerData.license ? String(customerData.license).trim() : null,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        camperId,
        customerId: customer.id,
        startDate,
        endDate,
        totalPrice: draft.pricing.totalPrice,
        paymentMethod:
          paymentMethod === 'STRIPE' ||
          paymentMethod === 'PAYPAL' ||
          paymentMethod === 'BANK_TRANSFER' ||
          paymentMethod === 'CASH' ||
          paymentMethod === 'MANUAL'
            ? paymentMethod
            : 'BANK_TRANSFER',
        status:
          status === 'PENDING' ||
          status === 'CONFIRMED' ||
          status === 'CANCELLED' ||
          status === 'COMPLETED'
            ? status
            : 'CONFIRMED',
        source: 'ADMIN',
        notes,
      },
      include: {
        camper: true,
        customer: true,
        transactions: true,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Dashboard booking creation error:', error);
    return NextResponse.json(
      { error: 'No se pudo crear la reserva.' },
      { status: 500 }
    );
  }
}
