import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureAdminAccess } from '@/lib/admin-auth';
import { calculateBookingTotals } from '@/lib/dashboard-data';

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const unauthorizedResponse = await ensureAdminAccess();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { bookingId } = await context.params;
    const body = await request.json();
    const type = String(body.type ?? '');
    const paymentMethod = String(body.paymentMethod ?? 'MANUAL');
    const amount = Number(body.amount ?? 0);
    const description = body.description ? String(body.description) : null;
    const reference = body.reference ? String(body.reference) : null;

    if ((type !== 'CHARGE' && type !== 'REFUND') || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'El movimiento financiero no es válido.' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        transactions: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada.' },
        { status: 404 }
      );
    }

    const totals = calculateBookingTotals(booking);

    if (type === 'REFUND' && amount > totals.netPaid) {
      return NextResponse.json(
        { error: 'No puedes devolver más de lo cobrado neto.' },
        { status: 400 }
      );
    }

    const transaction = await prisma.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        customerId: booking.customerId,
        type,
        paymentMethod:
          paymentMethod === 'STRIPE' ||
          paymentMethod === 'PAYPAL' ||
          paymentMethod === 'BANK_TRANSFER' ||
          paymentMethod === 'CASH' ||
          paymentMethod === 'MANUAL'
            ? paymentMethod
            : 'MANUAL',
        amount: Math.round(amount),
        description,
        reference,
        status: 'SUCCEEDED',
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Dashboard transaction creation error:', error);
    return NextResponse.json(
      { error: 'No se pudo registrar el movimiento.' },
      { status: 500 }
    );
  }
}
