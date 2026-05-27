'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Users,
  DollarSign,
  Settings,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<'booking' | 'price' | null>(null);
  const [view, setView] = useState<'calendar' | 'bookings' | 'pricing' | 'settings'>('calendar');

  const sampleBookings = [
    { id: 1, name: 'María García', start: new Date(2026, 4, 28), end: new Date(2026, 5, 2), status: 'confirmed', price: 850, email: 'maria@email.com', phone: '+34 612 345 678' },
    { id: 2, name: 'Carlos Ruiz', start: new Date(2026, 5, 5), end: new Date(2026, 5, 10), status: 'pending', price: 980, email: 'carlos@email.com', phone: '+34 623 456 789' },
    { id: 3, name: 'Laura Martín', start: new Date(2026, 5, 15), end: new Date(2026, 5, 20), status: 'confirmed', price: 1100, email: 'laura@email.com', phone: '+34 634 567 890' },
  ];

  const priceRules = [
    { id: 1, name: 'Temporada alta', startMonth: 6, endMonth: 8, price: 180, color: 'bg-orange-100 text-orange-800' },
    { id: 2, name: 'Temporada baja', startMonth: 1, endMonth: 5, price: 130, color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'Temporada media', startMonth: 9, endMonth: 12, price: 150, color: 'bg-green-100 text-green-800' },
  ];

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const booking = sampleBookings.find(b => 
        date >= new Date(b.start.getFullYear(), b.start.getMonth(), b.start.getDate()) && 
        date <= new Date(b.end.getFullYear(), b.end.getMonth(), b.end.getDate())
      );
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          onClick={() => setSelectedDate(date)}
          className={`aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all ${
            isSelected ? 'bg-black text-white' :
            booking ? 'bg-gray-100 hover:bg-gray-200' :
            'hover:bg-gray-50'
          } ${isToday ? 'ring-2 ring-black ring-offset-2' : ''}`}
        >
          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{day}</span>
          {booking && (
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
              booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
          )}
        </motion.div>
      );
    }

    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const getBookingForSelectedDate = () => {
    if (!selectedDate) return null;
    return sampleBookings.find(b => 
      selectedDate >= new Date(b.start.getFullYear(), b.start.getMonth(), b.start.getDate()) && 
      selectedDate <= new Date(b.end.getFullYear(), b.end.getMonth(), b.end.getDate())
    );
  };

  const selectedBooking = getBookingForSelectedDate();

  return (
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-1">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="px-4 font-semibold min-w-[160px] text-center text-sm sm:text-base">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowModal('booking')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} />
            Nueva Reserva
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {renderCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs sm:text-sm text-gray-600">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs sm:text-sm text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-xs sm:text-sm text-gray-600">Reservado</span>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 sm:gap-6">
        {/* Selected Date Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4">
            {selectedDate 
              ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              : 'Selecciona una fecha'}
          </h2>

          {selectedBooking ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm sm:text-base">{selectedBooking.name}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedBooking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedBooking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 {selectedBooking.email}</p>
                  <p>📱 {selectedBooking.phone}</p>
                  <p className="text-base sm:text-lg font-bold text-black">€ {selectedBooking.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Edit2 size={16} />
                  Editar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                  Cancelar
                </button>
              </div>
            </div>
          ) : selectedDate ? (
            <div className="text-center py-8">
              <CalendarIcon size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-4">Fecha disponible</p>
              <button
                onClick={() => setShowModal('booking')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
                Añadir Reserva
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Haz clic en una fecha para ver detalles</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Este mes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Reservas</span>
              <span className="font-bold text-lg sm:text-xl">{sampleBookings.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Ingresos</span>
              <span className="font-bold text-lg sm:text-xl text-green-600">€ 2,930</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Ocupación</span>
              <span className="font-bold text-lg sm:text-xl">68%</span>
            </div>
          </div>
        </div>

        {/* Price Rules */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Precios</h2>
            <button
              onClick={() => setShowModal('price')}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Editar
            </button>
          </div>
          <div className="space-y-2.5">
            {priceRules.map(rule => (
              <div key={rule.id} className="p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{rule.name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${rule.color}`}>
                    €{rule.price}/noche
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {monthNames[rule.startMonth - 1]} - {monthNames[rule.endMonth - 1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(null)}
                className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
                {showModal === 'booking' ? 'Nueva Reserva' : 'Gestionar Precios'}
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">
                  {showModal === 'booking' 
                    ? 'Formulario de reserva en construcción' 
                    : 'Gestión de precios en construcción'}
                </p>
                <button
                  onClick={() => setShowModal(null)}
                  className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
