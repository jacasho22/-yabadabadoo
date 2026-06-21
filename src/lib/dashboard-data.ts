import prisma from '@/lib/prisma';
import { calculateBookingPrice } from '@/lib/booking-pricing';
import * as mockDb from './mock-db';

let isDbOnline: boolean | null = null;
let lastCheckTime = 0;

export async function checkDbAvailability() {
  const now = Date.now();
  if (isDbOnline !== null && now - lastCheckTime < 10000) {
    return isDbOnline;
  }
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
    ]);
    isDbOnline = true;
  } catch (e) {
    isDbOnline = false;
  }
  lastCheckTime = now;
  return isDbOnline;
}

function sumAmounts(values: number[]) {
  return values.reduce((total, current) => total + current, 0);
}

function serializeDate(value: Date) {
  return value.toISOString();
}

function getPaymentState(totalPrice: number, charged: number, refunded: number) {
  const netPaid = charged - refunded;

  if (netPaid <= 0) {
    return 'sin_cobrar';
  }

  if (netPaid >= totalPrice) {
    return refunded > 0 ? 'cobrado_parcialmente_devuelto' : 'cobrado';
  }

  return 'cobro_parcial';
}

export async function getPrimaryCamper() {
  if (!(await checkDbAvailability())) {
    return mockDb.getMockCampers()[0] || null;
  }
  try {
    return await prisma.camper.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    return mockDb.getMockCampers()[0] || null;
  }
}

export async function getCampers() {
  if (!(await checkDbAvailability())) {
    return mockDb.getMockCampers();
  }
  try {
    return await prisma.camper.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    return mockDb.getMockCampers();
  }
}

async function getBookingRecords() {
  if (!(await checkDbAvailability())) {
    return mockDb.getMockBookingRecords() as any;
  }
  try {
    return await prisma.booking.findMany({
      include: {
        camper: {
          select: {
            id: true,
            name: true,
            slug: true,
            pricePerDay: true,
            pricePerWeek: true,
            pricePerMonth: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dni: true,
            license: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  } catch (error) {
    return mockDb.getMockBookingRecords() as any;
  }
}

async function getTransactionRecords() {
  if (!(await checkDbAvailability())) {
    return mockDb.getMockTransactionRecords() as any;
  }
  try {
    return await prisma.paymentTransaction.findMany({
      include: {
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            totalPrice: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    return mockDb.getMockTransactionRecords() as any;
  }
}

type BookingRecord = Awaited<ReturnType<typeof getBookingRecords>>[number];
type TransactionRecord = Awaited<ReturnType<typeof getTransactionRecords>>[number];

export function calculateBookingTotals(record: {
  totalPrice: number;
  transactions: Array<{
    type: string;
    status: string;
    amount: number;
  }>;
}) {
  const successfulTransactions = record.transactions.filter(
    (transaction) => transaction.status === 'SUCCEEDED'
  );
  const charged = sumAmounts(
    successfulTransactions
      .filter((transaction) => transaction.type === 'CHARGE')
      .map((transaction) => transaction.amount)
  );
  const refunded = sumAmounts(
    successfulTransactions
      .filter((transaction) => transaction.type === 'REFUND')
      .map((transaction) => transaction.amount)
  );
  const netPaid = charged - refunded;
  const balanceDue = Math.max(record.totalPrice - netPaid, 0);

  return {
    charged,
    refunded,
    netPaid,
    balanceDue,
    paymentState: getPaymentState(record.totalPrice, charged, refunded),
  };
}

function serializeBooking(record: BookingRecord) {
  const financials = calculateBookingTotals(record);

  return {
    id: record.id,
    status: record.status,
    source: record.source,
    paymentMethod: record.paymentMethod,
    paymentId: record.paymentId,
    totalPrice: record.totalPrice,
    notes: record.notes,
    startDate: serializeDate(record.startDate),
    endDate: serializeDate(record.endDate),
    createdAt: serializeDate(record.createdAt),
    updatedAt: serializeDate(record.updatedAt),
    customer: record.customer,
    camper: record.camper,
    financials,
    transactions: record.transactions.map((transaction: any) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      reference: transaction.reference,
      description: transaction.description,
      createdAt: serializeDate(transaction.createdAt),
    })),
  };
}

function serializeTransaction(record: TransactionRecord) {
  return {
    id: record.id,
    bookingId: record.bookingId,
    customerId: record.customerId,
    type: record.type,
    status: record.status,
    paymentMethod: record.paymentMethod,
    amount: record.amount,
    reference: record.reference,
    description: record.description,
    createdAt: serializeDate(record.createdAt),
    booking: {
      ...record.booking,
      startDate: serializeDate(record.booking.startDate),
      endDate: serializeDate(record.booking.endDate),
    },
    customer: record.customer,
  };
}

function buildAccounts(bookings: BookingRecord[]) {
  const accountsMap = new Map<
    string,
    {
      customerId: string;
      customerName: string;
      email: string;
      phone: string;
      bookedTotal: number;
      chargedTotal: number;
      refundedTotal: number;
      outstandingBalance: number;
      bookingsCount: number;
      lastBookingDate: string;
    }
  >();

  for (const booking of bookings) {
    const currentAccount = accountsMap.get(booking.customer.id) ?? {
      customerId: booking.customer.id,
      customerName: booking.customer.name,
      email: booking.customer.email,
      phone: booking.customer.phone,
      bookedTotal: 0,
      chargedTotal: 0,
      refundedTotal: 0,
      outstandingBalance: 0,
      bookingsCount: 0,
      lastBookingDate: serializeDate(booking.createdAt),
    };
    const financials = calculateBookingTotals(booking);

    currentAccount.bookedTotal += booking.totalPrice;
    currentAccount.chargedTotal += financials.charged;
    currentAccount.refundedTotal += financials.refunded;
    currentAccount.outstandingBalance += financials.balanceDue;
    currentAccount.bookingsCount += 1;
    currentAccount.lastBookingDate =
      currentAccount.lastBookingDate > serializeDate(booking.createdAt)
        ? currentAccount.lastBookingDate
        : serializeDate(booking.createdAt);

    accountsMap.set(booking.customer.id, currentAccount);
  }

  return Array.from(accountsMap.values()).sort(
    (left, right) => right.outstandingBalance - left.outstandingBalance
  );
}

function buildOverview(bookings: BookingRecord[], transactions: TransactionRecord[]) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyBookings = bookings.filter((booking) => {
    const startDate = booking.startDate;
    return (
      startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear
    );
  });

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === 'SUCCEEDED'
  );
  const totalCharged = sumAmounts(
    successfulTransactions
      .filter((transaction) => transaction.type === 'CHARGE')
      .map((transaction) => transaction.amount)
  );
  const totalRefunded = sumAmounts(
    successfulTransactions
      .filter((transaction) => transaction.type === 'REFUND')
      .map((transaction) => transaction.amount)
  );
  const totalBooked = sumAmounts(bookings.map((booking) => booking.totalPrice));
  const totalPending = sumAmounts(
    bookings.map((booking) => calculateBookingTotals(booking).balanceDue)
  );

  return {
    bookingsCount: bookings.length,
    bookingsThisMonth: monthlyBookings.length,
    totalBooked,
    totalCharged,
    totalRefunded,
    totalPending,
  };
}

export async function getDashboardSnapshot() {
  try {
    const [campers, bookings, transactions] = await Promise.all([
      getCampers(),
      getBookingRecords(),
      getTransactionRecords(),
    ]);

    return {
      campers,
      overview: buildOverview(bookings, transactions),
      bookings: bookings.map(serializeBooking),
      transactions: transactions.map(serializeTransaction),
      accounts: buildAccounts(bookings),
    };
  } catch (error) {
    const campers = mockDb.getMockCampers();
    const bookings = mockDb.getMockBookingRecords();
    const transactions = mockDb.getMockTransactionRecords();

    return {
      campers,
      overview: buildOverview(bookings as any, transactions as any),
      bookings: (bookings as any).map(serializeBooking),
      transactions: (transactions as any).map(serializeTransaction),
      accounts: buildAccounts(bookings as any),
    };
  }
}

export async function getBookingAvailabilityMap(
  camperId: string,
  range?: { startDate: Date; endDate: Date }
) {
  // Check if it's a mock camper (id starts with 'mock-')
  if (camperId.startsWith('mock-')) {
    // Return empty arrays (no blocked dates or existing bookings)
    return {
      blockedDates: [],
      existingBookings: [],
    };
  }

  const whereDate = range
    ? {
        gte: range.startDate,
        lte: range.endDate,
      }
    : {
        gte: new Date(),
      };

  try {
    const [blockedDates, existingBookings] = await Promise.all([
      prisma.blockedDate.findMany({
        where: {
          camperId,
          date: whereDate,
        },
        orderBy: { date: 'asc' },
      }),
      prisma.booking.findMany({
        where: {
          camperId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          ...(range
            ? {
                OR: [
                  {
                    startDate: { lte: range.endDate },
                    endDate: { gte: range.startDate },
                  },
                ],
              }
            : {
                endDate: { gte: new Date() },
              }),
        },
        orderBy: { startDate: 'asc' },
      }),
    ]);

    return {
      blockedDates,
      existingBookings,
    };
  } catch (error) {
    // If database fails, return empty arrays
    return {
      blockedDates: [],
      existingBookings: [],
    };
  }
}

export async function buildBookingDraft(
  startDate: Date,
  endDate: Date,
  camperId?: string
) {
  // Check if it's a mock camper (id starts with 'mock-')
  if (camperId && camperId.startsWith('mock-')) {
    // Create a mock camper object
    const mockCamper = {
      id: camperId,
      name: 'Camper Yaba Adventure',
      slug: 'camper-yaba-1',
      descriptionEs: 'Un camper completo para tus aventuras!',
      descriptionEn: 'A complete camper for your adventures!',
      features: {},
      images: ['/images/camper-side.jpeg'],
      pricePerDay: 14000,
      pricePerWeek: 98000,
      pricePerMonth: 420000,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pricing = calculateBookingPrice(startDate, endDate, {
      pricePerDay: mockCamper.pricePerDay,
      pricePerWeek: mockCamper.pricePerWeek,
      pricePerMonth: mockCamper.pricePerMonth,
    });

    return {
      camper: mockCamper,
      pricing,
    };
  }

  try {
    const camper =
      camperId == null
        ? await getPrimaryCamper()
        : await prisma.camper.findUnique({ where: { id: camperId } });

    if (!camper) {
      return null;
    }

    const pricing = calculateBookingPrice(startDate, endDate, {
      pricePerDay: camper.pricePerDay,
      pricePerWeek: camper.pricePerWeek,
      pricePerMonth: camper.pricePerMonth,
    });

    return {
      camper,
      pricing,
    };
  } catch (error) {
    // If database fails, use mock camper
    const mockCamper = {
      id: 'mock-camper-1',
      name: 'Camper Yaba Adventure',
      slug: 'camper-yaba-1',
      descriptionEs: 'Un camper completo para tus aventuras!',
      descriptionEn: 'A complete camper for your adventures!',
      features: {},
      images: ['/images/camper-side.jpeg'],
      pricePerDay: 14000,
      pricePerWeek: 98000,
      pricePerMonth: 420000,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pricing = calculateBookingPrice(startDate, endDate, {
      pricePerDay: mockCamper.pricePerDay,
      pricePerWeek: mockCamper.pricePerWeek,
      pricePerMonth: mockCamper.pricePerMonth,
    });

    return {
      camper: mockCamper,
      pricing,
    };
  }
}
