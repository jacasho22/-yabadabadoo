import { calculateBookingPrice } from './booking-pricing';

export interface MockCamper {
  id: string;
  name: string;
  slug: string;
  descriptionEs: string;
  descriptionEn: string;
  features: any;
  images: string[];
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCustomer {
  id: string;
  email: string;
  name: string;
  phone: string;
  dni: string | null;
  license: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockBooking {
  id: string;
  camperId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
  paymentId: string | null;
  source: 'PUBLIC' | 'ADMIN';
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockTransaction {
  id: string;
  bookingId: string;
  customerId: string;
  type: 'CHARGE' | 'REFUND';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
  amount: number;
  reference: string | null;
  description: string | null;
  createdAt: Date;
}

// Persist across Next.js dev server hot-reloads
const globalForMockDb = globalThis as unknown as {
  mockDb: {
    campers: MockCamper[];
    customers: MockCustomer[];
    bookings: MockBooking[];
    transactions: MockTransaction[];
    blockedDates: { id: string; camperId: string; date: Date; reason: string | null }[];
  } | undefined;
};

// Initial Data
if (!globalForMockDb.mockDb) {
  const camperId = 'mock-camper-1';
  const customer1Id = 'mock-customer-1';
  const customer2Id = 'mock-customer-2';
  const booking1Id = 'mock-booking-1';
  const booking2Id = 'mock-booking-2';

  globalForMockDb.mockDb = {
    campers: [
      {
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
      },
    ],
    customers: [
      {
        id: customer1Id,
        email: 'juan.perez@example.com',
        name: 'Juan Pérez',
        phone: '+34 600 123 456',
        dni: '12345678A',
        license: 'B-88221',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: customer2Id,
        email: 'maria.gomez@example.com',
        name: 'María Gómez',
        phone: '+34 611 987 654',
        dni: '87654321B',
        license: 'B-99883',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    bookings: [
      {
        id: booking1Id,
        camperId: camperId,
        customerId: customer1Id,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Hace 5 días
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),   // Hace 2 días
        totalPrice: 42000, // 3 noches a 140€ = 420€
        status: 'COMPLETED',
        paymentMethod: 'CASH',
        paymentId: null,
        source: 'PUBLIC',
        notes: 'Todo perfecto, cliente muy simpático.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: booking2Id,
        camperId: camperId,
        customerId: customer2Id,
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
        endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),   // En 6 días
        totalPrice: 56000, // 4 noches a 140€ = 560€
        status: 'CONFIRMED',
        paymentMethod: 'STRIPE',
        paymentId: 'ch_stripe_mock_22',
        source: 'PUBLIC',
        notes: 'Recogida a las 10:00. Requiere mesa exterior.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    transactions: [
      {
        id: 'mock-tx-1',
        bookingId: booking1Id,
        customerId: customer1Id,
        type: 'CHARGE',
        status: 'SUCCEEDED',
        paymentMethod: 'CASH',
        amount: 42000,
        reference: 'EFECTIVO-ENTREGADO',
        description: 'Cobro completo de fianza y alquiler',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'mock-tx-2',
        bookingId: booking2Id,
        customerId: customer2Id,
        type: 'CHARGE',
        status: 'SUCCEEDED',
        paymentMethod: 'STRIPE',
        amount: 20000,
        reference: 'stripe_charge_881',
        description: 'Reserva online - Pago parcial inicial',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    blockedDates: [],
  };
}

export const mockDb = globalForMockDb.mockDb!;

// Helpers de operaciones
export function getMockCampers() {
  return mockDb.campers;
}

export function getMockBookingRecords() {
  return mockDb.bookings.map((booking) => {
    const camper = mockDb.campers.find((c) => c.id === booking.camperId)!;
    const customer = mockDb.customers.find((c) => c.id === booking.customerId)!;
    const transactions = mockDb.transactions.filter((t) => t.bookingId === booking.id);
    return {
      ...booking,
      camper,
      customer,
      transactions,
    };
  });
}

export function getMockTransactionRecords() {
  return mockDb.transactions.map((tx) => {
    const booking = mockDb.bookings.find((b) => b.id === tx.bookingId)!;
    const customer = mockDb.customers.find((c) => c.id === tx.customerId)!;
    return {
      ...tx,
      booking,
      customer,
    };
  });
}

export function getMockBookingAvailabilityMap(camperId: string, range?: { startDate: Date; endDate: Date }) {
  const activeBookings = mockDb.bookings.filter(
    (b) => b.camperId === camperId && (b.status === 'PENDING' || b.status === 'CONFIRMED')
  );

  const matchedBookings = range
    ? activeBookings.filter((b) => b.startDate <= range.endDate && b.endDate >= range.startDate)
    : activeBookings;

  return {
    blockedDates: mockDb.blockedDates.filter((bd) => bd.camperId === camperId),
    existingBookings: matchedBookings.map((b) => ({
      id: b.id,
      start: b.startDate,
      end: b.endDate,
    })),
  };
}

export function buildMockBookingDraft(startDate: Date, endDate: Date, camperId?: string) {
  const camper = mockDb.campers.find((c) => c.id === camperId) || mockDb.campers[0];
  const pricing = calculateBookingPrice(startDate, endDate, {
    pricePerDay: camper.pricePerDay,
    pricePerWeek: camper.pricePerWeek,
    pricePerMonth: camper.pricePerMonth,
  });
  return {
    camper,
    pricing,
  };
}

export function createMockBooking(data: {
  camperId: string;
  startDate: Date;
  endDate: Date;
  paymentMethod: MockBooking['paymentMethod'];
  status: MockBooking['status'];
  notes: string | null;
  customerData: {
    name: string;
    email: string;
    phone: string;
    dni?: string;
    license?: string;
  };
  source?: 'PUBLIC' | 'ADMIN';
}) {
  const now = new Date();
  
  // Upsert Customer
  let customer = mockDb.customers.find((c) => c.email.toLowerCase() === data.customerData.email.toLowerCase());
  if (!customer) {
    customer = {
      id: 'mock-customer-' + Date.now(),
      email: data.customerData.email.trim(),
      name: data.customerData.name.trim(),
      phone: data.customerData.phone.trim(),
      dni: data.customerData.dni ? data.customerData.dni.trim() : null,
      license: data.customerData.license ? data.customerData.license.trim() : null,
      createdAt: now,
      updatedAt: now,
    };
    mockDb.customers.push(customer);
  } else {
    customer.name = data.customerData.name.trim();
    customer.phone = data.customerData.phone.trim();
    if (data.customerData.dni) customer.dni = data.customerData.dni.trim();
    if (data.customerData.license) customer.license = data.customerData.license.trim();
    customer.updatedAt = now;
  }

  // Calculate Price
  const draft = buildMockBookingDraft(data.startDate, data.endDate, data.camperId);
  const totalPrice = draft.pricing.totalPrice;

  // Create Booking
  const booking: MockBooking = {
    id: 'mock-booking-' + Date.now(),
    camperId: data.camperId,
    customerId: customer.id,
    startDate: data.startDate,
    endDate: data.endDate,
    totalPrice: totalPrice,
    status: data.status,
    paymentMethod: data.paymentMethod,
    paymentId: null,
    source: data.source ?? 'ADMIN',
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };
  
  mockDb.bookings.unshift(booking);

  return {
    ...booking,
    camper: mockDb.campers.find((c) => c.id === booking.camperId)!,
    customer: customer,
    transactions: [],
  };
}

export function updateMockBooking(
  bookingId: string,
  data: {
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    notes?: string | null;
    paymentMethod?: MockBooking['paymentMethod'];
  }
) {
  const booking = mockDb.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  if (data.status) booking.status = data.status;
  if ('notes' in data) booking.notes = data.notes ?? null;
  if (data.paymentMethod) booking.paymentMethod = data.paymentMethod;
  
  booking.updatedAt = new Date();

  const camper = mockDb.campers.find((c) => c.id === booking.camperId)!;
  const customer = mockDb.customers.find((c) => c.id === booking.customerId)!;
  const transactions = mockDb.transactions.filter((t) => t.bookingId === booking.id);

  return {
    ...booking,
    camper,
    customer,
    transactions,
  };
}

export function createMockTransaction(data: {
  bookingId: string;
  type: 'CHARGE' | 'REFUND';
  paymentMethod: MockBooking['paymentMethod'];
  amount: number;
  description: string | null;
  reference: string | null;
}) {
  const booking = mockDb.bookings.find((b) => b.id === data.bookingId);
  if (!booking) {
    throw new Error('Reserva no encontrada');
  }

  const transaction: MockTransaction = {
    id: 'mock-tx-' + Date.now(),
    bookingId: booking.id,
    customerId: booking.customerId,
    type: data.type,
    status: 'SUCCEEDED',
    paymentMethod: data.paymentMethod,
    amount: data.amount,
    description: data.description,
    reference: data.reference,
    createdAt: new Date(),
  };

  mockDb.transactions.unshift(transaction);
  return transaction;
}

export function updateMockCamperPricing(data: {
  camperId: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
}) {
  const camper = mockDb.campers.find((item) => item.id === data.camperId);
  if (!camper) {
    throw new Error('Camper no encontrada');
  }

  camper.pricePerDay = Math.round(data.pricePerDay);
  camper.pricePerWeek = Math.round(data.pricePerWeek);
  camper.pricePerMonth = Math.round(data.pricePerMonth);
  camper.updatedAt = new Date();

  return camper;
}
