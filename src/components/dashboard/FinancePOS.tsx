'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  Calendar,
  CreditCard,
  Coins,
  Receipt,
  Check,
  AlertCircle,
  Users,
  Smartphone,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Tag,
  CircleAlert,
  CircleCheck,
} from 'lucide-react';
import { Booking, Transaction, Account, DashboardSnapshot } from './DashboardControlPanel';

interface FinancePOSProps {
  data: DashboardSnapshot;
  refreshData: (showMessage?: boolean) => Promise<void>;
}

// Billetes típicos de Euros para simular POS
const QUICK_CASH_BILLS = [
  { value: 5, bg: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' },
  { value: 10, bg: 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200' },
  { value: 20, bg: 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200' },
  { value: 50, bg: 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200' },
  { value: 100, bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 200, bg: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' },
  { value: 500, bg: 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200' },
];

const paymentMethods = [
  { value: 'CASH', label: 'Efectivo', icon: Coins, color: 'border-emerald-200 text-emerald-600 bg-emerald-50/30' },
  { value: 'STRIPE', label: 'Tarjeta (Stripe)', icon: CreditCard, color: 'border-indigo-200 text-indigo-600 bg-indigo-50/30' },
  { value: 'BANK_TRANSFER', label: 'Transferencia', icon: Smartphone, color: 'border-sky-200 text-sky-600 bg-sky-50/30' },
  { value: 'PAYPAL', label: 'PayPal', icon: CreditCard, color: 'border-amber-200 text-amber-600 bg-amber-50/30' },
  { value: 'MANUAL', label: 'Manual/Otros', icon: Receipt, color: 'border-zinc-200 text-zinc-600 bg-zinc-50/30' },
] as const;

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  }).format(new Date(dateStr));
}

export default function FinancePOS({ data, refreshData }: FinancePOSProps) {
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');
  const [bottomTab, setBottomTab] = useState<'TICKETS' | 'ACCOUNTS'>('TICKETS');

  // Transacción Draft
  const [amountStr, setAmountStr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Booking['paymentMethod']>('CASH');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtrar reservas
  const filteredBookings = useMemo(() => {
    return data.bookings.filter((booking) => {
      const matchesSearch =
        booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer.phone.includes(searchQuery) ||
        booking.camper.name.toLowerCase().includes(searchQuery.toLowerCase());

      const balanceDue = booking.financials.balanceDue;
      const matchesFilter =
        balanceFilter === 'ALL' ||
        (balanceFilter === 'PENDING' && balanceDue > 0) ||
        (balanceFilter === 'PAID' && balanceDue <= 0);

      return matchesSearch && matchesFilter;
    });
  }, [data.bookings, searchQuery, balanceFilter]);

  // Reserva seleccionada
  const selectedBooking = useMemo(() => {
    return data.bookings.find((b) => b.id === activeBookingId) || null;
  }, [data.bookings, activeBookingId]);

  // Manejar click de reserva
  const handleSelectBooking = (booking: Booking) => {
    setActiveBookingId(booking.id);
    // Auto-rellenar valores por defecto
    setErrorMsg(null);
    setSuccessMsg(null);
    setAmountStr('');
    setPaymentMethod(booking.paymentMethod || 'CASH');
    setReference('');
    setDescription('');
  };

  // Botón rápido: Rellenar saldo restante exacto
  const handleFillOutstanding = () => {
    if (!selectedBooking) return;
    const balanceEur = Math.max(0, selectedBooking.financials.balanceDue / 100);
    setAmountStr(balanceEur.toFixed(2));
  };

  // Sumar billete al importe actual
  const handleAddBill = (billValue: number) => {
    const currentVal = parseFloat(amountStr) || 0;
    setAmountStr((currentVal + billValue).toString());
  };

  // Teclado numérico táctil (NumPad)
  const handleNumPadPress = (val: string) => {
    setErrorMsg(null);
    if (val === 'C') {
      setAmountStr('');
    } else if (val === '⌫') {
      setAmountStr((prev) => prev.slice(0, -1));
    } else if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => (prev === '' ? '0.' : prev + '.'));
      }
    } else {
      // Evitar meter más de dos decimales
      if (amountStr.includes('.')) {
        const [, decimals] = amountStr.split('.');
        if (decimals && decimals.length >= 2) return;
      }
      setAmountStr((prev) => prev + val);
    }
  };

  // Enviar Transacción (Cobro / Devolución)
  const submitTransaction = async (type: 'CHARGE' | 'REFUND') => {
    if (!selectedBooking) return;
    const amountNum = parseFloat(amountStr);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Por favor introduce un importe válido mayor que 0.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const amountCents = Math.round(amountNum * 100);
      const response = await fetch(`/api/dashboard/bookings/${selectedBooking.id}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: amountCents,
          paymentMethod,
          reference: reference || null,
          description: description || (type === 'CHARGE' ? 'Cobro manual TPV' : 'Devolución manual TPV'),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo procesar la transacción.');
      }

      setSuccessMsg(type === 'CHARGE' ? '¡Cobro registrado con éxito!' : '¡Devolución registrada con éxito!');
      setAmountStr('');
      setReference('');
      setDescription('');
      
      // Refrescar panel principal
      await refreshData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Indicadores rápidos con micro-animaciones */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Reservado',
            value: formatCurrency(data.overview.totalBooked),
            desc: 'Volumen total de negocio',
            color: 'border-zinc-100 bg-white text-zinc-900',
            icon: TrendingUp,
            iconColor: 'text-zinc-500',
          },
          {
            label: 'Total Cobrado',
            value: formatCurrency(data.overview.totalCharged),
            desc: 'Ingresos confirmados',
            color: 'border-emerald-100 bg-white text-emerald-950',
            icon: CircleCheck,
            iconColor: 'text-emerald-500',
          },
          {
            label: 'Pendiente de Cobro',
            value: formatCurrency(data.overview.totalPending),
            desc: 'Saldo adeudado por clientes',
            color: 'border-amber-100 bg-white text-amber-950',
            icon: CircleAlert,
            iconColor: 'text-amber-500',
          },
          {
            label: 'Total Devuelto',
            value: formatCurrency(data.overview.totalRefunded),
            desc: 'Reembolsos a clientes',
            color: 'border-red-100 bg-white text-red-950',
            icon: TrendingDown,
            iconColor: 'text-red-500',
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-3xl border p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300 ${item.color}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-500 transition-colors">
                  {item.label}
                </p>
                <h3 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                  {item.value}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
              </div>
              <div className={`p-2.5 rounded-2xl bg-gray-50 ${item.iconColor}`}>
                <item.icon size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </motion.div>
        ))}
      </section>

      {/* Grid Principal TPV */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start">
        
        {/* COLUMNA IZQUIERDA: Selector de Clientes / Reservas */}
        <section className="lg:col-span-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col h-[760px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={20} className="text-gray-500" />
              Reservas del TPV
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {filteredBookings.length} de {data.bookings.length}
            </span>
          </div>

          {/* Input de búsqueda grande con lupa táctil */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente, email, teléfono o camper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-black font-semibold text-xs rounded-full bg-gray-100 w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros rápidos estilo chip */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'ALL', label: 'Todas' },
              { id: 'PENDING', label: 'Con saldo pendiente' },
              { id: 'PAID', label: 'Pagadas completamente' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setBalanceFilter(chip.id as typeof balanceFilter)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                  balanceFilter === chip.id
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Lista scrollable de tarjetas grandes */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-200 rounded-3xl text-gray-400 p-6 text-center">
                <AlertCircle size={28} className="mb-2" />
                <p className="text-sm">No se encontraron reservas con los filtros activos.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const isSelected = booking.id === activeBookingId;
                const balanceDue = booking.financials.balanceDue;

                // Definir colores y textos del estado del balance
                let balanceBadge = (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Pagada
                  </span>
                );

                if (balanceDue > 0) {
                  balanceBadge = (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                      Deben: {formatCurrency(balanceDue)}
                    </span>
                  );
                } else if (balanceDue < 0) {
                  balanceBadge = (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Surplus: {formatCurrency(Math.abs(balanceDue))}
                    </span>
                  );
                }

                return (
                  <button
                    key={booking.id}
                    onClick={() => handleSelectBooking(booking)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative group cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-lg translate-x-1'
                        : 'bg-gray-50 hover:bg-gray-100/70 border-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-sm tracking-tight group-hover:underline decoration-1">
                          {booking.customer.name}
                        </h4>
                        <p className={`text-xs ${isSelected ? 'text-zinc-400' : 'text-gray-500'} mt-0.5`}>
                          {booking.camper.name}
                        </p>
                      </div>
                      <div className="shrink-0">{balanceBadge}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className={isSelected ? 'text-zinc-400' : 'text-gray-400'} />
                        <span>
                          {formatDate(booking.startDate)} a {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className="font-extrabold">
                        Total: {formatCurrency(booking.totalPrice)}
                      </div>
                    </div>

                    {/* Flechita táctil decorativa */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pr-2 hidden lg:block">
                      <ChevronRight size={16} className={isSelected ? 'text-zinc-400' : 'text-zinc-600'} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: Terminal TPV Tactil */}
        <section className="lg:col-span-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm h-[760px] flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedBooking ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400 border border-dashed border-gray-100 rounded-2xl h-full"
              >
                <div className="p-5 rounded-full bg-zinc-50 text-zinc-400 mb-4 animate-bounce duration-1000">
                  <Coins size={36} />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Terminal de Caja Registradora</h3>
                <p className="text-sm mt-2 max-w-sm">
                  Selecciona una reserva en el listado de la izquierda para realizar cobros, registrar pagos o emitir reembolsos de forma táctil.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="pos-terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col justify-between h-full space-y-4 overflow-y-auto"
              >
                {/* Cabecera del cliente seleccionado en el POS */}
                <div className="p-4 bg-zinc-900 text-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-zinc-400" />
                      <span className="font-extrabold text-sm tracking-tight">{selectedBooking.customer.name}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedBooking.customer.phone} · {selectedBooking.customer.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-400">Saldo pendiente de cobro</p>
                    <p className="text-lg font-black text-amber-400">
                      {formatCurrency(selectedBooking.financials.balanceDue)}
                    </p>
                  </div>
                </div>

                {/* Grid interactivo del Importe + Teclado Táctil */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
                  
                  {/* Visor de importe y NumPad (Col Span: 7) */}
                  <div className="md:col-span-7 space-y-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Importe de la Operación</span>
                    
                    {/* Pantalla del importe */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0.00"
                        readOnly
                        value={amountStr ? `${amountStr} €` : '0.00 €'}
                        className="w-full text-3xl text-right font-mono font-black tracking-wider bg-gray-50 hover:bg-gray-100 border-2 border-gray-100 rounded-2xl p-4 focus:outline-none transition-colors"
                      />
                      {amountStr && (
                        <button
                          onClick={() => setAmountStr('')}
                          className="absolute left-4 top-5 font-bold text-xs px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-full cursor-pointer"
                        >
                          BORRAR TODO
                        </button>
                      )}
                    </div>

                    {/* Teclado numérico físico táctil */}
                    <div className="grid grid-cols-3 gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleNumPadPress(key)}
                          className={`py-3.5 text-lg font-black rounded-2xl border transition-all cursor-pointer select-none active:scale-95 ${
                            key === '⌫'
                              ? 'bg-red-50 hover:bg-red-100 border-red-100 text-red-600'
                              : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100 text-zinc-800'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Acciones Rápidas (Billetes + Completar) (Col Span: 5) */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                    <div className="flex-1 flex flex-col space-y-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Billetes Rápidos</span>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_CASH_BILLS.map((bill) => (
                          <button
                            key={bill.value}
                            type="button"
                            onClick={() => handleAddBill(bill.value)}
                            className={`py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all text-center cursor-pointer ${bill.bg}`}
                          >
                            +{bill.value} €
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleFillOutstanding}
                          className="col-span-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black active:scale-95 transition-all text-center border-none cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Tag size={12} className="text-amber-400" />
                          COMPLETAR SALDO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selector de Método de Pago con Iconos Gigantes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Método de Pago</span>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {paymentMethods.map((method) => {
                      const isSel = paymentMethod === method.value;
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setPaymentMethod(method.value)}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 text-center ${
                            isSel
                              ? 'border-black bg-zinc-950 text-white scale-102 shadow-md'
                              : `border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-gray-50 hover:border-gray-200`
                          }`}
                        >
                          <Icon size={20} className={isSel ? 'text-white' : ''} />
                          <span className="text-[10px] font-bold tracking-tight">{method.label}</span>
                          {isSel && (
                            <div className="absolute top-1.5 right-1.5 bg-white text-zinc-950 p-0.5 rounded-full">
                              <Check size={8} strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Campos compactos de referencia e info */}
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Referencia (ej: transf. 8831)"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Concepto/Descripción adicional"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Mensajes de error o éxito */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-100">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-100">
                    <Check size={14} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Botones de acción principales de TPV */}
                <div className="grid gap-3 grid-cols-2 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting || !amountStr}
                    onClick={() => submitTransaction('CHARGE')}
                    className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm border-none"
                  >
                    <span>COBRAR{amountStr ? ` ${parseFloat(amountStr).toFixed(2)} €` : ''}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || !amountStr}
                    onClick={() => submitTransaction('REFUND')}
                    className="py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm border-none"
                  >
                    <span>DEVOLVER{amountStr ? ` ${parseFloat(amountStr).toFixed(2)} €` : ''}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* SECCIÓN INFERIOR: Libro de Movimientos (Tickets de caja) / Cuentas por Cliente */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        
        {/* Selector de pestañas */}
        <div className="flex border-b border-gray-100 pb-3 mb-6 gap-6">
          <button
            onClick={() => setBottomTab('TICKETS')}
            className={`pb-2.5 text-base font-extrabold relative transition-colors cursor-pointer ${
              bottomTab === 'TICKETS' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Historial de Movimientos
            {bottomTab === 'TICKETS' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
            )}
          </button>
          <button
            onClick={() => setBottomTab('ACCOUNTS')}
            className={`pb-2.5 text-base font-extrabold relative transition-colors cursor-pointer ${
              bottomTab === 'ACCOUNTS' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Cuentas por Cliente
            {bottomTab === 'ACCOUNTS' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
            )}
          </button>
        </div>

        {/* Contenido de la pestaña */}
        <AnimatePresence mode="wait">
          {bottomTab === 'TICKETS' ? (
            <motion.div
              key="tab-tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            >
              {data.transactions.slice(0, 16).map((transaction) => {
                const isCharge = transaction.type === 'CHARGE';
                return (
                  <div
                    key={transaction.id}
                    className="relative border border-dashed border-zinc-200 bg-zinc-50/50 p-5 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between min-h-[160px] group hover:bg-zinc-50 transition-colors"
                  >
                    {/* Estilo mini-ticket de supermercado con línea troquelada en la parte superior */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-repeat-x bg-[radial-gradient(circle_at_bottom,_#e4e4e7_2px,_transparent_3px)] bg-[size:8px_4px]" />
                    
                    <div className="pt-2">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-extrabold text-xs text-gray-500 uppercase tracking-wide">
                          TICKET #{transaction.id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                            isCharge
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          {isCharge ? 'COBRO' : 'DEVOLUCIÓN'}
                        </span>
                      </div>

                      <h4 className="mt-3 font-extrabold text-sm text-gray-900 truncate">
                        {transaction.customer.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {transaction.description || 'Sin concepto registrado'}
                      </p>
                    </div>

                    <div className="border-t border-dashed border-zinc-200 mt-4 pt-3 flex justify-between items-end">
                      <div className="text-[10px] text-gray-400">
                        <p>{formatDate(transaction.createdAt)}</p>
                        <p className="uppercase mt-0.5 font-bold tracking-tight">{transaction.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-gray-400">Importe total</p>
                        <p className={`font-black text-base tracking-tight ${isCharge ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isCharge ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="tab-accounts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto"
            >
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-bold uppercase text-xs tracking-wider">
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3 text-right">Reservado</th>
                    <th className="px-4 py-3 text-right">Cobrado</th>
                    <th className="px-4 py-3 text-right">Devuelto</th>
                    <th className="px-4 py-3 text-right">Saldo Pendiente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.accounts.map((account) => {
                    const balance = account.outstandingBalance;
                    return (
                      <tr key={account.customerId} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-extrabold text-gray-900">{account.customerName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{account.email} · {account.phone}</div>
                        </td>
                        <td className="px-4 py-4 text-right font-medium">{formatCurrency(account.bookedTotal)}</td>
                        <td className="px-4 py-4 text-right text-emerald-600 font-medium">{formatCurrency(account.chargedTotal)}</td>
                        <td className="px-4 py-4 text-right text-red-500 font-medium">{formatCurrency(account.refundedTotal)}</td>
                        <td className={`px-4 py-4 text-right font-black ${balance > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {formatCurrency(balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
