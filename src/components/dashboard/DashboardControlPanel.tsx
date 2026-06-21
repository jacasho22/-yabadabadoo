'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Euro,
  RefreshCcw,
  Save,
  Users,
} from 'lucide-react';
import FinancePOS from './FinancePOS';

export type DashboardSection = 'overview' | 'bookings' | 'finance' | 'settings';

export type Camper = {
  id: string;
  name: string;
  slug: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
};

export type Booking = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  source: 'PUBLIC' | 'ADMIN';
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
  paymentId: string | null;
  totalPrice: number;
  notes: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    dni: string | null;
    license: string | null;
  };
  camper: Camper;
  financials: {
    charged: number;
    refunded: number;
    netPaid: number;
    balanceDue: number;
    paymentState: string;
  };
  transactions: Array<{
    id: string;
    type: 'CHARGE' | 'REFUND';
    status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
    paymentMethod: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
    amount: number;
    reference: string | null;
    description: string | null;
    createdAt: string;
  }>;
};

export type Transaction = {
  id: string;
  bookingId: string;
  customerId: string;
  type: 'CHARGE' | 'REFUND';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | 'MANUAL';
  amount: number;
  reference: string | null;
  description: string | null;
  createdAt: string;
  booking: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
};

export type Account = {
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
};

export type DashboardSnapshot = {
  campers: Camper[];
  overview: {
    bookingsCount: number;
    bookingsThisMonth: number;
    totalBooked: number;
    totalCharged: number;
    totalRefunded: number;
    totalPending: number;
  };
  bookings: Booking[];
  transactions: Transaction[];
  accounts: Account[];
};

export type DashboardControlPanelProps = {
  initialData: DashboardSnapshot;
  initialSection: DashboardSection;
};

type BookingEditState = Record<
  string,
  {
    status: Booking['status'];
    paymentMethod: Booking['paymentMethod'];
    notes: string;
  }
>;

type TransactionDraftState = Record<
  string,
  {
    amount: string;
    paymentMethod: Booking['paymentMethod'];
    reference: string;
    description: string;
  }
>;

const paymentMethodOptions: Array<{
  value: Booking['paymentMethod'];
  label: string;
}> = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'BANK_TRANSFER', label: 'Transferencia' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'STRIPE', label: 'Stripe' },
  { value: 'PAYPAL', label: 'PayPal' },
];

const bookingStatusOptions: Array<{
  value: Booking['status'];
  label: string;
}> = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmada' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'COMPLETED', label: 'Completada' },
];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  }).format(new Date(date));
}

function toInputDate(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

function createBookingEdits(bookings: Booking[]): BookingEditState {
  return Object.fromEntries(
    bookings.map((booking) => [
      booking.id,
      {
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        notes: booking.notes ?? '',
      },
    ])
  );
}

function createTransactionDrafts(bookings: Booking[]): TransactionDraftState {
  return Object.fromEntries(
    bookings.map((booking) => [
      booking.id,
      {
        amount: '',
        paymentMethod: booking.paymentMethod,
        reference: '',
        description: '',
      },
    ])
  );
}

export default function DashboardControlPanel({
  initialData,
  initialSection,
}: DashboardControlPanelProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [bookingEdits, setBookingEdits] = useState<BookingEditState>(
    createBookingEdits(initialData.bookings)
  );
  const [transactionDrafts, setTransactionDrafts] = useState<TransactionDraftState>(
    createTransactionDrafts(initialData.bookings)
  );
  const [createBookingForm, setCreateBookingForm] = useState({
    camperId: initialData.campers[0]?.id ?? '',
    startDate: '',
    endDate: '',
    name: '',
    email: '',
    phone: '',
    dni: '',
    license: '',
    paymentMethod: 'BANK_TRANSFER' as Booking['paymentMethod'],
    status: 'CONFIRMED' as Booking['status'],
    notes: '',
  });
  const [financeForm, setFinanceForm] = useState({
    bookingId: initialData.bookings[0]?.id ?? '',
    type: 'CHARGE' as 'CHARGE' | 'REFUND',
    amount: '',
    paymentMethod: 'MANUAL' as Booking['paymentMethod'],
    reference: '',
    description: '',
  });
  const [pricingForm, setPricingForm] = useState({
    camperId: initialData.campers[0]?.id ?? '',
    pricePerDay: initialData.campers[0]?.pricePerDay.toString() ?? '',
    pricePerWeek: initialData.campers[0]?.pricePerWeek.toString() ?? '',
    pricePerMonth: initialData.campers[0]?.pricePerMonth.toString() ?? '',
  });

  const selectedCamper = useMemo(
    () => data.campers.find((camper) => camper.id === pricingForm.camperId) ?? data.campers[0] ?? null,
    [data.campers, pricingForm.camperId]
  );

  const upcomingBookings = useMemo(
    () =>
      [...data.bookings]
        .sort(
          (left, right) =>
            new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
        )
        .slice(0, 6),
    [data.bookings]
  );

  const recentTransactions = useMemo(() => data.transactions.slice(0, 8), [data.transactions]);

  const applySnapshot = (snapshot: DashboardSnapshot) => {
    setData(snapshot);
    setBookingEdits(createBookingEdits(snapshot.bookings));
    setTransactionDrafts(createTransactionDrafts(snapshot.bookings));
    setCreateBookingForm((current) => ({
      ...current,
      camperId: current.camperId || snapshot.campers[0]?.id || '',
    }));
    setFinanceForm((current) => ({
      ...current,
      bookingId: current.bookingId || snapshot.bookings[0]?.id || '',
    }));
    setPricingForm((current) => ({
      camperId: current.camperId || snapshot.campers[0]?.id || '',
      pricePerDay:
        snapshot.campers.find((camper) => camper.id === (current.camperId || snapshot.campers[0]?.id))
          ?.pricePerDay.toString() ?? '',
      pricePerWeek:
        snapshot.campers.find((camper) => camper.id === (current.camperId || snapshot.campers[0]?.id))
          ?.pricePerWeek.toString() ?? '',
      pricePerMonth:
        snapshot.campers.find((camper) => camper.id === (current.camperId || snapshot.campers[0]?.id))
          ?.pricePerMonth.toString() ?? '',
    }));
  };

  const refreshData = async (showMessage = false) => {
    setIsRefreshing(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo refrescar el panel.');
      }

      applySnapshot(payload as DashboardSnapshot);

      if (showMessage) {
        setFeedback({
          type: 'success',
          message: 'Panel actualizado correctamente.',
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo actualizar el panel.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      const response = await fetch('/api/dashboard/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camperId: createBookingForm.camperId,
          startDate: createBookingForm.startDate,
          endDate: createBookingForm.endDate,
          paymentMethod: createBookingForm.paymentMethod,
          status: createBookingForm.status,
          notes: createBookingForm.notes,
          customerData: {
            name: createBookingForm.name,
            email: createBookingForm.email,
            phone: createBookingForm.phone,
            dni: createBookingForm.dni,
            license: createBookingForm.license,
          },
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo crear la reserva.');
      }

      setCreateBookingForm((current) => ({
        ...current,
        startDate: '',
        endDate: '',
        name: '',
        email: '',
        phone: '',
        dni: '',
        license: '',
        notes: '',
      }));
      setFeedback({ type: 'success', message: 'Reserva creada correctamente.' });
      await refreshData(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo crear la reserva.',
      });
    }
  };

  const handleSaveBooking = async (bookingId: string) => {
    const bookingEdit = bookingEdits[bookingId];
    if (!bookingEdit) {
      return;
    }

    setFeedback(null);

    try {
      const response = await fetch(`/api/dashboard/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingEdit),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo actualizar la reserva.');
      }

      setFeedback({ type: 'success', message: 'Reserva actualizada.' });
      await refreshData(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo actualizar la reserva.',
      });
    }
  };

  const handleBookingTransaction = async (bookingId: string, type: 'CHARGE' | 'REFUND') => {
    const draft = transactionDrafts[bookingId];
    if (!draft) {
      return;
    }

    setFeedback(null);

    try {
      const response = await fetch(`/api/dashboard/bookings/${bookingId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: Math.round(Number(draft.amount) * 100),
          paymentMethod: draft.paymentMethod,
          reference: draft.reference,
          description: draft.description,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo registrar el movimiento.');
      }

      setTransactionDrafts((current) => ({
        ...current,
        [bookingId]: {
          ...current[bookingId],
          amount: '',
          reference: '',
          description: '',
        },
      }));
      setFeedback({
        type: 'success',
        message: type === 'CHARGE' ? 'Cobro registrado.' : 'Devolución registrada.',
      });
      await refreshData(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo registrar el movimiento.',
      });
    }
  };

  const handleFinanceMovement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      const response = await fetch(
        `/api/dashboard/bookings/${financeForm.bookingId}/transactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: financeForm.type,
            amount: Math.round(Number(financeForm.amount) * 100),
            paymentMethod: financeForm.paymentMethod,
            reference: financeForm.reference,
            description: financeForm.description,
          }),
        }
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo registrar el movimiento.');
      }

      setFinanceForm((current) => ({
        ...current,
        amount: '',
        reference: '',
        description: '',
      }));
      setFeedback({ type: 'success', message: 'Movimiento financiero registrado.' });
      await refreshData(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo registrar el movimiento.',
      });
    }
  };

  const handlePricingSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      const response = await fetch(`/api/dashboard/campers/${pricingForm.camperId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricePerDay: Number(pricingForm.pricePerDay),
          pricePerWeek: Number(pricingForm.pricePerWeek),
          pricePerMonth: Number(pricingForm.pricePerMonth),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudieron guardar las tarifas.');
      }

      setFeedback({ type: 'success', message: 'Tarifas actualizadas.' });
      await refreshData(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudieron guardar las tarifas.',
      });
    }
  };

  const headingMap: Record<DashboardSection, { title: string; description: string }> = {
    overview: {
      title: 'Resumen del panel',
      description: 'Vista global de reservas, cobros, devoluciones y saldo pendiente.',
    },
    bookings: {
      title: 'Gestión de reservas',
      description: 'Alta manual, edición de estado, notas y cobros rápidos por reserva.',
    },
    finance: {
      title: 'Finanzas y cuentas',
      description: 'Libro de movimientos, cuentas por cliente y control de devoluciones.',
    },
    settings: {
      title: 'Tarifas y ajustes',
      description: 'Configuración de precios activos para la camper publicada.',
    },
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Camper Yaba</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {headingMap[initialSection].title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-500">
              {headingMap[initialSection].description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refreshData(true)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refrescar datos
          </button>
        </div>

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        ) : null}
      </section>

      {(initialSection === 'overview' || initialSection === 'bookings') && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Reservas totales',
              value: data.overview.bookingsCount.toString(),
              icon: CalendarDays,
            },
            {
              label: 'Reservas este mes',
              value: data.overview.bookingsThisMonth.toString(),
              icon: Users,
            },
            {
              label: 'Cobrado',
              value: formatCurrency(data.overview.totalCharged),
              icon: CircleDollarSign,
            },
            {
              label: 'Pendiente',
              value: formatCurrency(data.overview.totalPending),
              icon: Euro,
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{item.label}</p>
                <item.icon size={18} className="text-gray-400" />
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight">{item.value}</p>
            </article>
          ))}
        </section>
      )}

      {initialSection === 'overview' && (
        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Próximas reservas</h2>
              <span className="text-sm text-gray-500">{upcomingBookings.length} visibles</span>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-base font-semibold">{booking.customer.name}</p>
                      <p className="text-sm text-gray-500">{booking.customer.email}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      <p className="mt-1 text-gray-500">
                        Cobrado: {formatCurrency(booking.financials.charged)}
                      </p>
                      <p className="text-gray-500">
                        Pendiente: {formatCurrency(booking.financials.balanceDue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Últimos movimientos</h2>
              <CreditCard size={18} className="text-gray-400" />
            </div>
            <div className="mt-6 space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{transaction.customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.type === 'CHARGE' ? 'Cobro' : 'Devolución'} por{' '}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === 'CHARGE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {transaction.type === 'CHARGE' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {initialSection === 'bookings' && (
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Nueva reserva manual</h2>
            <form
              onSubmit={handleCreateBooking}
              className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            >
              <select
                value={createBookingForm.camperId}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    camperId: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              >
                {data.campers.map((camper) => (
                  <option key={camper.id} value={camper.id}>
                    {camper.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={createBookingForm.startDate}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
              <input
                type="date"
                value={createBookingForm.endDate}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
              <select
                value={createBookingForm.status}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    status: event.target.value as Booking['status'],
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              >
                {bookingStatusOptions.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={createBookingForm.name}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={createBookingForm.email}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={createBookingForm.phone}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                required
              />
              <select
                value={createBookingForm.paymentMethod}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    paymentMethod: event.target.value as Booking['paymentMethod'],
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              >
                {paymentMethodOptions.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="DNI"
                value={createBookingForm.dni}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    dni: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
              <input
                type="text"
                placeholder="Carnet"
                value={createBookingForm.license}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    license: event.target.value,
                  }))
                }
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
              <textarea
                placeholder="Notas internas"
                value={createBookingForm.notes}
                onChange={(event) =>
                  setCreateBookingForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="md:col-span-2 xl:col-span-2 min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                <CalendarDays size={16} />
                Crear reserva
              </button>
            </form>
          </section>

          <section className="space-y-4">
            {data.bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className="text-lg font-bold">{booking.customer.name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.customer.email} · {booking.customer.phone}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Reserva {booking.source === 'ADMIN' ? 'creada en panel' : 'desde web'} ·{' '}
                      {booking.camper.name}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm md:grid-cols-3">
                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-gray-500">Total</p>
                      <p className="mt-1 font-semibold">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-gray-500">Cobrado</p>
                      <p className="mt-1 font-semibold">
                        {formatCurrency(booking.financials.charged)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-gray-500">Pendiente</p>
                      <p className="mt-1 font-semibold">
                        {formatCurrency(booking.financials.balanceDue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr,1fr]">
                  <div className="grid gap-4 md:grid-cols-3">
                    <select
                      value={bookingEdits[booking.id]?.status ?? booking.status}
                      onChange={(event) =>
                        setBookingEdits((current) => ({
                          ...current,
                          [booking.id]: {
                            ...current[booking.id],
                            status: event.target.value as Booking['status'],
                          },
                        }))
                      }
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                    >
                      {bookingStatusOptions.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={bookingEdits[booking.id]?.paymentMethod ?? booking.paymentMethod}
                      onChange={(event) =>
                        setBookingEdits((current) => ({
                          ...current,
                          [booking.id]: {
                            ...current[booking.id],
                            paymentMethod: event.target.value as Booking['paymentMethod'],
                          },
                        }))
                      }
                      className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                    >
                      {paymentMethodOptions.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleSaveBooking(booking.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Save size={16} />
                      Guardar cambios
                    </button>
                    <textarea
                      value={bookingEdits[booking.id]?.notes ?? booking.notes ?? ''}
                      onChange={(event) =>
                        setBookingEdits((current) => ({
                          ...current,
                          [booking.id]: {
                            ...current[booking.id],
                            notes: event.target.value,
                          },
                        }))
                      }
                      className="md:col-span-3 min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      placeholder="Notas internas de la reserva"
                    />
                  </div>

                  <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-800">Cobrar o devolver</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Importe en euros"
                        value={transactionDrafts[booking.id]?.amount ?? ''}
                        onChange={(event) =>
                          setTransactionDrafts((current) => ({
                            ...current,
                            [booking.id]: {
                              ...current[booking.id],
                              amount: event.target.value,
                            },
                          }))
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      />
                      <select
                        value={transactionDrafts[booking.id]?.paymentMethod ?? booking.paymentMethod}
                        onChange={(event) =>
                          setTransactionDrafts((current) => ({
                            ...current,
                            [booking.id]: {
                              ...current[booking.id],
                              paymentMethod: event.target.value as Booking['paymentMethod'],
                            },
                          }))
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      >
                        {paymentMethodOptions.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Referencia"
                        value={transactionDrafts[booking.id]?.reference ?? ''}
                        onChange={(event) =>
                          setTransactionDrafts((current) => ({
                            ...current,
                            [booking.id]: {
                              ...current[booking.id],
                              reference: event.target.value,
                            },
                          }))
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Concepto"
                        value={transactionDrafts[booking.id]?.description ?? ''}
                        onChange={(event) =>
                          setTransactionDrafts((current) => ({
                            ...current,
                            [booking.id]: {
                              ...current[booking.id],
                              description: event.target.value,
                            },
                          }))
                        }
                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => void handleBookingTransaction(booking.id, 'CHARGE')}
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Registrar cobro
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleBookingTransaction(booking.id, 'REFUND')}
                        className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600"
                      >
                        Registrar devolución
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {initialSection === 'finance' && (
        <FinancePOS data={data} refreshData={refreshData} />
      )}

      {initialSection === 'settings' && (
        <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Tarifas activas</h2>
            {data.campers.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No hay campers activas en la base de datos.
              </p>
            ) : (
              <form onSubmit={handlePricingSave} className="mt-6 space-y-4">
                <select
                  value={pricingForm.camperId}
                  onChange={(event) => {
                    const camper = data.campers.find(
                      (candidate) => candidate.id === event.target.value
                    );
                    setPricingForm({
                      camperId: event.target.value,
                      pricePerDay: camper?.pricePerDay.toString() ?? '',
                      pricePerWeek: camper?.pricePerWeek.toString() ?? '',
                      pricePerMonth: camper?.pricePerMonth.toString() ?? '',
                    });
                  }}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                >
                  {data.campers.map((camper) => (
                    <option key={camper.id} value={camper.id}>
                      {camper.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pricingForm.pricePerDay}
                  onChange={(event) =>
                    setPricingForm((current) => ({
                      ...current,
                      pricePerDay: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pricingForm.pricePerWeek}
                  onChange={(event) =>
                    setPricingForm((current) => ({
                      ...current,
                      pricePerWeek: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pricingForm.pricePerMonth}
                  onChange={(event) =>
                    setPricingForm((current) => ({
                      ...current,
                      pricePerMonth: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Guardar tarifas
                </button>
              </form>
            )}
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Estado del catálogo</h2>
            {selectedCamper ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Camper activa</p>
                  <p className="mt-1 text-lg font-semibold">{selectedCamper.name}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Precio por día</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(selectedCamper.pricePerDay)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Precio por semana</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(selectedCamper.pricePerWeek)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Precio por mes</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(selectedCamper.pricePerMonth)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Crea al menos una camper en la base de datos para poder usar el panel.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
