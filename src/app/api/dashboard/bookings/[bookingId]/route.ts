import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureAdminAccess } from '@/lib/admin-auth';

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const unauthorizedResponse = await ensureAdminAccess();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { bookingId } = await context.params;
    const body = await request.json();

    const data: {
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
      notes?: string | null;
      paymentMethod?: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
    } = {};

    if (body.status) {
      const status = String(body.status);
      if (
        status === 'PENDING' ||
        status === 'CONFIRMED' ||
        status === 'CANCELLED' ||
        status === 'COMPLETED'
      ) {
        data.status = status;
      }
    }

    if ('notes' in body) {
      data.notes = body.notes ? String(body.notes) : null;
    }

    if (body.paymentMethod) {
      const paymentMethod = String(body.paymentMethod);
      if (
        paymentMethod === 'STRIPE' ||
        paymentMethod === 'PAYPAL' ||
        paymentMethod === 'BANK_TRANSFER' ||
        paymentMethod === 'CASH' ||
        paymentMethod === 'MANUAL'
      ) {
        data.paymentMethod = paymentMethod;
      }
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
      include: {
        camper: true,
        customer: true,
        transactions: true,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Dashboard booking update error:', error);
    return NextResponse.json(
      { error: 'No se pudo actualizar la reserva.' },
      { status: 500 }
    );
  }
}
