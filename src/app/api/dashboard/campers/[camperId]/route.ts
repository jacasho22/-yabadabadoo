import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureAdminAccess } from '@/lib/admin-auth';
import { checkDbAvailability } from '@/lib/dashboard-data';
import { updateMockCamperPricing } from '@/lib/mock-db';

type RouteContext = {
  params: Promise<{
    camperId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const unauthorizedResponse = await ensureAdminAccess();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { camperId } = await context.params;
    const body = await request.json();
    const pricePerDay = Number(body.pricePerDay);
    const pricePerWeek = Number(body.pricePerWeek);
    const pricePerMonth = Number(body.pricePerMonth);

    if (
      !Number.isFinite(pricePerDay) ||
      !Number.isFinite(pricePerWeek) ||
      !Number.isFinite(pricePerMonth) ||
      pricePerDay <= 0 ||
      pricePerWeek <= 0 ||
      pricePerMonth <= 0
    ) {
      return NextResponse.json(
        { error: 'Los precios indicados no son válidos.' },
        { status: 400 }
      );
    }

    const useMockWrite = camperId.startsWith('mock-') || !(await checkDbAvailability());

    if (useMockWrite) {
      const camper = updateMockCamperPricing({
        camperId,
        pricePerDay,
        pricePerWeek,
        pricePerMonth,
      });

      return NextResponse.json({ success: true, camper });
    }

    const camper = await prisma.camper.update({
      where: { id: camperId },
      data: {
        pricePerDay: Math.round(pricePerDay),
        pricePerWeek: Math.round(pricePerWeek),
        pricePerMonth: Math.round(pricePerMonth),
      },
    });

    return NextResponse.json({ success: true, camper });
  } catch (error) {
    console.error('Camper pricing update error:', error);
    return NextResponse.json(
      { error: 'No se pudo actualizar la tarifa de la camper.' },
      { status: 500 }
    );
  }
}
