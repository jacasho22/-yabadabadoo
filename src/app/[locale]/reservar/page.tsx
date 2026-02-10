'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, CreditCard, Check, 
  ChevronRight, User, ShieldCheck,
  ArrowRight, MoveLeft
} from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

// Pricing (in cents)
const PRICING = {
  perDay: 8900,      // 89€
  perWeek: 54900,    // 549€ (7 days)
  perMonth: 189900,  // 1899€ (30 days)
};

// Mock blocked dates
const blockedDates = [
  new Date(2026, 1, 20),
  new Date(2026, 1, 21),
  new Date(2026, 1, 22),
];

export default function BookingPage() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const dateLocale = locale === 'es' ? es : enUS;
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dni: '',
    license: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { nights, totalPrice, priceBreakdown } = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return { nights: 0, totalPrice: 0, priceBreakdown: null };
    }
    const n = differenceInDays(dateRange.to, dateRange.from);
    if (n <= 0) return { nights: 0, totalPrice: 0, priceBreakdown: null };

    let total = 0;
    const breakdown = [];
    
    // Simple greedy algo (for demo)
    let remaining = n;
    if (remaining >= 30) {
      const months = Math.floor(remaining / 30);
      total += months * PRICING.perMonth;
      breakdown.push({ type: 'month', count: months, price: PRICING.perMonth });
      remaining %= 30;
    }
    if (remaining >= 7) {
      const weeks = Math.floor(remaining / 7);
      total += weeks * PRICING.perWeek;
      breakdown.push({ type: 'week', count: weeks, price: PRICING.perWeek });
      remaining %= 7;
    }
    if (remaining > 0) {
      total += remaining * PRICING.perDay;
      breakdown.push({ type: 'day', count: remaining, price: PRICING.perDay });
    }
    
    return { nights: n, totalPrice: total, priceBreakdown: breakdown };
  }, [dateRange]);

  const isDateBlocked = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return blockedDates.some(b => b.toDateString() === date.toDateString()) || date < today;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency', currency: 'EUR',
    }).format(cents / 100);
  };

  const steps = [
    { id: 1, label: locale === 'es' ? 'Fechas' : 'Dates', icon: CalendarIcon },
    { id: 2, label: locale === 'es' ? 'Datos' : 'Details', icon: User },
    { id: 3, label: locale === 'es' ? 'Pago' : 'Payment', icon: CreditCard },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-light">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-12 rounded-[2.5rem] shadow-premium text-center border-white/40"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">{t('success')}</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">{t('successMessage')}</p>
          <Link href={`/${locale}`} className="btn btn-primary rounded-2xl w-full">
            {t('backToHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pt-32 pb-20">
      <div className="container-main">
        {/* Header & Stepper */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{t('title')}</h1>
            <p className="text-gray-400 font-medium">{t('selectDates')}</p>
          </motion.div>

          <div className="flex items-center justify-between relative max-w-sm mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
            
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400'
                }`}>
                  <s.icon size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-gray-50"
            >
              {step === 1 && (
                <div className="flex flex-col items-center">
                  <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={dateLocale}
                    disabled={isDateBlocked}
                    numberOfMonths={2}
                    className="m-0!"
                    modifiersStyles={{
                      selected: { backgroundColor: 'var(--color-primary)', borderRadius: '12px' },
                      range_middle: { backgroundColor: 'rgba(45, 90, 39, 0.1)', color: 'var(--color-primary)' },
                    }}
                  />
                  
                  {nights > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 w-full flex justify-end">
                      <button onClick={() => setStep(2)} className="btn btn-primary rounded-2xl px-12 group">
                        {t('next')}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {[
                      { name: 'name', label: t('name'), type: 'text' },
                      { name: 'email', label: t('email'), type: 'email' },
                      { name: 'phone', label: t('phone'), type: 'tel' },
                      { name: 'dni', label: t('dni'), type: 'text' },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{f.label}</label>
                        <input
                          name={f.name}
                          type={f.type}
                          value={formData[f.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                       <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{t('license')}</label>
                       <input
                          name="license"
                          type="text"
                          value={formData.license}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-dark transition-colors">
                      <MoveLeft size={20} />
                      {t('back')}
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="btn btn-primary rounded-2xl px-12 shadow-xl shadow-primary/20 group"
                    >
                      {isSubmitting ? t('processing') : (
                        <>
                          {t('bookNow')}
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* Checkout Info Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-50"
            >
              <h3 className="text-xl font-bold mb-8 tracking-tight">{t('yourTrip')}</h3>
              
              {nights > 0 ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('startDate')}</span>
                      <span className="font-bold text-dark">{format(dateRange!.from!, 'dd MMM yyyy', { locale: dateLocale })}</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('endDate')}</span>
                      <span className="font-bold text-dark">{format(dateRange!.to!, 'dd MMM yyyy', { locale: dateLocale })}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {priceBreakdown?.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-500">{p.count}x {p.type === 'day' ? t('day') : p.type === 'week' ? t('week') : t('month')}</span>
                        <span className="text-dark">{formatPrice(p.count * p.price)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 border-t-2 border-dashed border-gray-100">
                      <span className="text-lg font-black text-dark">{t('total')}</span>
                      <span className="text-3xl font-black text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-3xl flex items-start gap-4">
                    <ShieldCheck size={24} className="text-primary shrink-0" />
                    <p className="text-[11px] font-semibold text-primary/80 leading-relaxed uppercase tracking-widest">
                      {t('securePaymentInfo')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200">
                  <CalendarIcon size={48} className="text-gray-200 mx-auto mb-6" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    {t('selectDatesPrompt')}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
