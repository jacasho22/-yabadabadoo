'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, Info, ShieldCheck, Zap, Sun, Compass } from 'lucide-react';

export default function AppleNexusExperience() {
  const locale = useLocale();

  // State for active configurator values
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [passportId, setPassportId] = useState<string>('');
  const [calculatedSummary, setCalculatedSummary] = useState<{ nights: number; total: number } | null>(null);

  // Active showcase tab (Apple Design Tab System)
  const [activeFeatureTab, setActiveFeatureTab] = useState<'solar' | 'insulation' | 'walnut'>('solar');

  // Multi-lingual copy dictionaries
  const copy = {
    es: {
      badge: 'Edición Limitada Yaba Pro',
      heroTitle1: 'Yaba.',
      heroTitle2: 'Libertad off-grid. Diseñada al detalle.',
      linkReserve: 'Reservar ahora',
      linkSpecs: 'Ver ficha técnica',
      sectionDesignTitle: 'Diseño.',
      sectionDesignSub: 'Un hábitat puro que redefine la vida en movimiento.',
      designBody1: 'Cada centímetro de Yaba ha sido meticulosamente estructurado para maximizar el espacio, la comodidad y la pureza estética. Desde las encimeras de madera de nogal macizo hasta el aislamiento de alta fidelidad térmica, Yaba no es solo una furgoneta: es tu santuario móvil.',
      designBody2: 'Despierta con la inmensidad del océano enmarcada por los portones traseros. Duerme en un colchón viscoelástico de alta densidad queen-size y cocina sin restricciones gracias a nuestra placa de inducción y suministro de gas integrado.',
      tabSolar: 'Autonomía Solar',
      tabInsulation: 'Aislamiento Térmico',
      tabWalnut: 'Artesanía en Madera',
      solarDesc: 'Paneles monocristalinos de 400W y almacenamiento de litio inteligente para 100% de independencia eléctrica sin conexión a red.',
      insulationDesc: 'Aislamiento premium de elastómero Kaiflex de 20mm para mantener un confort térmico absoluto ante cualquier cota climática.',
      walnutDesc: 'Mobiliario artesanal construido en madera natural noble, ofreciendo durabilidad excepcional y un tacto sofisticado.',
      consoleTitle: 'Configura tu viaje.',
      consoleSub: 'Elige tus fechas de despegue y calcula tu inversión off-grid al instante.',
      labelStart: 'Fecha de recogida',
      labelEnd: 'Fecha de devolución',
      labelPassport: 'DNI o Pasaporte del conductor',
      calcBtn: 'Calcular presupuesto',
      nights: 'Noches totales',
      rate: 'Tarifa diaria',
      total: 'Inversión Total',
      reserveBtn: 'Proceder a la reserva',
      specsTitle: 'Especificaciones Premium',
      spec1: 'Placas Solares Monocristalinas 400W',
      spec2: 'Baterías de Litio 200Ah con Telemetría Smart',
      spec3: 'Calefacción Estacionaria Digital con sensor de altitud',
      spec4: 'Ducha de agua caliente de alta presión integrada'
    },
    en: {
      badge: 'Limited Edition Yaba Pro',
      heroTitle1: 'Yaba.',
      heroTitle2: 'Off-grid freedom. Meticulously designed.',
      linkReserve: 'Book now',
      linkSpecs: 'View technical specifications',
      sectionDesignTitle: 'Design.',
      sectionDesignSub: 'A pure habitat redefining life on the move.',
      designBody1: 'Every single inch of Yaba has been meticulously engineered to maximize space, comfort, and visual purity. From natural solid walnut worktops to advanced thermal high-density insulation, Yaba is not just a van: it is your private mobile sanctuary.',
      designBody2: 'Wake up with the infinite ocean framed beautifully by the double rear doors. Rest on a premium high-density queen-size viscoelastic mattress and cook without limits with our integrated stove and electric systems.',
      tabSolar: 'Solar Autonomy',
      tabInsulation: 'Thermal Shield',
      tabWalnut: 'Wood Craftsmanship',
      solarDesc: '400W high-efficiency monocrystalline solar grid and smart lithium storage for 100% grid-independent electric security.',
      insulationDesc: 'Premium 20mm Kaiflex elastomeric thermal barrier maintaining absolute warmth or coolness at any altitude.',
      walnutDesc: 'Handcrafted interior fittings constructed using noble natural wood, delivering robust lifetime durability and tactile elegance.',
      consoleTitle: 'Configure your stay.',
      consoleSub: 'Choose your launch dates and calculate your off-grid investment instantly.',
      labelStart: 'Departure date',
      labelEnd: 'Return date',
      labelPassport: 'Driver DNI or Passport',
      calcBtn: 'Calculate quote',
      nights: 'Total nights',
      rate: 'Daily rate',
      total: 'Total Investment',
      reserveBtn: 'Proceed with booking',
      specsTitle: 'Premium Specifications',
      spec1: '400W Monocrystalline High-efficiency Solar Grid',
      spec2: '200Ah Lithium Smart Cell Bank with Bluetooth diagnostics',
      spec3: 'Digital Stationary Heating with automated altitude adjustment',
      spec4: 'Integrated High-pressure Hot Water Shower Cabin'
    }
  }[locale === 'en' ? 'en' : 'es'];

  // Calculations logic
  const performCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (nights > 0) {
      setCalculatedSummary({
        nights,
        total: nights * 120 // Flat premium daily rate of 120€
      });
    }
  };

  return (
    <div className="bg-apple-dark min-h-screen text-white font-inter apple-scroll overflow-x-hidden relative">
      
      {/* Translucent Minimalist Apple Header Navbar */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 glass-navbar-apple h-12 flex items-center justify-center"
      >
        <div className="w-full max-w-[1024px] px-6 flex items-center justify-between text-xs tracking-wider text-white/80 font-medium">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-white" />
            <span className="font-bold tracking-widest text-[10px] text-white">
              YABA
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-8 text-[11px] text-apple-gray font-normal">
            <Link href={`/${locale}/camper`} className="hover:text-white transition-colors">La Camper</Link>
            <a href="#design" className="hover:text-white transition-colors">Diseño</a>
            <a href="#specs" className="hover:text-white transition-colors">Especificaciones</a>
            <a href="#configure" className="hover:text-white transition-colors">Reservar</a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link 
              href={locale === 'es' ? '/en/nexus' : '/es/nexus'} 
              className="text-apple-gray hover:text-white tracking-widest uppercase text-[10px] font-bold"
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </Link>
            <a 
              href="#configure" 
              className="px-3 py-1 bg-white/10 hover:bg-white/20 transition-all rounded-full text-white text-[10px] font-medium"
            >
              {locale === 'es' ? 'Comprar' : 'Buy'}
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Main Container */}
      <main className="w-full pt-20">

        {/* HERO SECTION - Pristine Apple Typography & Large product center stage */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 relative py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-xs text-apple-gray font-bold tracking-widest uppercase block mb-4">
              {copy.badge}
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-apple-tighter leading-none mb-6">
              <span className="block text-white mb-2">{copy.heroTitle1}</span>
              <span className="block text-apple-gray">{copy.heroTitle2}</span>
            </h1>
            
            <div className="flex items-center justify-center gap-6 mt-8 mb-12 text-sm">
              <a href="#configure" className="link-apple text-[15px] font-medium">
                {copy.linkReserve} <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#specs" className="link-apple text-[15px] font-medium">
                {copy.linkSpecs} <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Large Center Stage Product Representation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-[800px] aspect-16/10 relative mt-4 select-none filter drop-shadow-[0_30px_60px_rgba(255,255,255,0.03)]"
          >
            <Image
              src="/images/camper_3d_glass.png"
              alt="Yaba Camper Spatial Design"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </section>

        {/* PRODUCT DESIGN / STORYTELLING SECTION */}
        <section id="design" className="py-32 bg-apple-dark border-t border-apple-divider">
          <div className="max-w-[1024px] mx-auto px-6">
            
            {/* Header */}
            <div className="mb-20 text-left max-w-xl">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-apple-tight text-white mb-4">
                {copy.sectionDesignTitle}
              </h2>
              <p className="text-xl text-apple-gray font-normal">
                {copy.sectionDesignSub}
              </p>
            </div>

            {/* Alternating Columns Details (Classic Apple Panel Layout) */}
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6 text-left"
              >
                <p className="text-lg text-white font-normal leading-relaxed">
                  {copy.designBody1}
                </p>
                <p className="text-base text-apple-gray leading-relaxed">
                  {copy.designBody2}
                </p>
              </motion.div>
              
              <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-apple-surface border border-apple-divider">
                <Image
                  src="/images/camper-interior.jpeg"
                  alt="Yaba premium interior cabinetry"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Interactive Engineering Tabs System */}
            <div className="mt-32 pt-16 border-t border-apple-divider">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { id: 'solar', title: copy.tabSolar, desc: copy.solarDesc, icon: Sun },
                  { id: 'insulation', title: copy.tabInsulation, desc: copy.insulationDesc, icon: ShieldCheck },
                  { id: 'walnut', title: copy.tabWalnut, desc: copy.walnutDesc, icon: Zap }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setActiveFeatureTab(item.id as 'solar' | 'insulation' | 'walnut')
                    }
                    className={`text-left p-8 rounded-2xl border transition-all ${
                      activeFeatureTab === item.id 
                        ? 'border-white bg-apple-surface shadow-md' 
                        : 'border-apple-divider bg-transparent hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <item.icon className={`w-5 h-5 ${activeFeatureTab === item.id ? 'text-white' : 'text-apple-gray'}`} />
                      <span className={`text-base font-bold tracking-tight ${activeFeatureTab === item.id ? 'text-white' : 'text-apple-gray'}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-apple-gray leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* DETAILED PREMIUM TECHNICAL SPECIFICATIONS */}
        <section id="specs" className="py-32 bg-apple-surface border-t border-apple-divider">
          <div className="max-w-[1024px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-apple-tight text-white mb-6">
                  {copy.specsTitle}
                </h3>
                <p className="text-base text-apple-gray leading-relaxed max-w-sm">
                  {locale === 'es'
                    ? 'Todo el equipamiento off-grid ha sido seleccionado bajo estándares de ingeniería náutica y aeroespacial para certificar la fiabilidad del habitáculo en cualquier entorno.'
                    : 'Every single off-grid system has been sourced under aerospace and marine engineering standards to certify absolute cabin reliability in any environment.'}
                </p>
              </div>

              <div className="space-y-6">
                {[copy.spec1, copy.spec2, copy.spec3, copy.spec4].map((spec, idx) => (
                  <div key={idx} className="pb-6 border-b border-apple-divider flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{spec}</span>
                    <span className="text-xs font-bold text-apple-gray">100% STANDARD</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APPLE CONFIGURATOR / RESERVATION CONSOLE */}
        <section id="configure" className="py-32 bg-apple-dark border-t border-apple-divider">
          <div className="max-w-[1024px] mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-apple-tight text-white mb-4">
                {copy.consoleTitle}
              </h2>
              <p className="text-base text-apple-gray">
                {copy.consoleSub}
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start mt-8">
              
              {/* Form Input Side */}
              <div className="lg:col-span-7 glass-panel-apple rounded-3xl p-8 sm:p-10">
                <form onSubmit={performCalculation} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    
                    {/* Start Date input */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-semibold text-apple-gray uppercase tracking-widest mb-2">
                        {copy.labelStart}
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="bg-white/5 border border-apple-divider rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-apple-gray focus:bg-white/8 transition-all"
                      />
                    </div>

                    {/* End Date input */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-semibold text-apple-gray uppercase tracking-widest mb-2">
                        {copy.labelEnd}
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="bg-white/5 border border-apple-divider rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-apple-gray focus:bg-white/8 transition-all"
                      />
                    </div>

                  </div>

                  {/* Driver ID passport */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-semibold text-apple-gray uppercase tracking-widest mb-2">
                      {copy.labelPassport}
                    </label>
                    <input
                      type="text"
                      placeholder="DNI, NIE o Pasaporte"
                      value={passportId}
                      onChange={(e) => setPassportId(e.target.value)}
                      required
                      className="bg-white/5 border border-apple-divider rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-apple-gray focus:bg-white/8 transition-all"
                    />
                  </div>

                  {/* Calculation submit trigger */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black hover:bg-[#f5f5f7] transition-all rounded-xl font-medium text-sm tracking-wide"
                  >
                    {copy.calcBtn}
                  </button>
                </form>
              </div>

              {/* Configurations Summary Box (Apple Store checkout look) */}
              <div className="lg:col-span-5 w-full">
                <div className="border border-apple-divider rounded-3xl p-8 bg-apple-surface/50">
                  <span className="text-[10px] font-bold text-apple-gray uppercase tracking-widest block mb-4">
                    Resumen del trayecto
                  </span>

                  <AnimatePresence mode="wait">
                    {calculatedSummary ? (
                      <motion.div
                        key="calculated"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between items-center pb-4 border-b border-apple-divider">
                          <span className="text-sm text-apple-gray font-normal">{copy.nights}</span>
                          <span className="text-base font-bold text-white">{calculatedSummary.nights} noches</span>
                        </div>

                        <div className="flex justify-between items-center pb-4 border-b border-apple-divider">
                          <span className="text-sm text-apple-gray font-normal">{copy.rate}</span>
                          <span className="text-base font-bold text-white">120 € / día</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-base text-white font-bold">{copy.total}</span>
                          <span className="text-2xl font-bold text-white tracking-tight">{calculatedSummary.total} €</span>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-apple-divider text-xs text-apple-gray leading-relaxed flex gap-2">
                          <Info className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                          <span>{locale === 'es' ? 'Presupuesto oficial garantizado. Sin depósitos ocultos.' : 'Official quote guaranteed. Zero hidden fees or lockups.'}</span>
                        </div>

                        <Link
                          href={`/${locale}/reservar`}
                          className="w-full py-4 btn-apple-blue text-center block rounded-xl font-medium text-sm tracking-wide"
                        >
                          {copy.reserveBtn}
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center"
                      >
                        <Calendar className="w-8 h-8 text-apple-gray mx-auto mb-4" />
                        <p className="text-sm text-apple-gray font-normal leading-relaxed">
                          {locale === 'es' 
                            ? 'Introduce las fechas deseadas en el panel de configuración para ver el desglose detallado de precios.' 
                            : 'Enter your desired travel dates in the configurator panel to generate your custom pricing breakdown.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* APPLE MINIMALIST FOOTER */}
      <footer className="border-t border-apple-divider py-16 bg-apple-dark text-apple-gray text-[11px] relative z-10">
        <div className="max-w-[1024px] mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-apple-divider/40 pb-8">
            <div className="flex items-center gap-2 text-white">
              <Compass className="w-4 h-4" />
              <span className="font-bold tracking-widest text-[9px]">YABA CAMPERS</span>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-normal">
              <Link href={`/${locale}`} className="hover:underline hover:text-white transition-colors">{locale === 'es' ? 'Volver al Inicio' : 'Back to Home'}</Link>
              <Link href={`/${locale}/legal/aviso-legal`} className="hover:underline hover:text-white transition-colors">{locale === 'es' ? 'Aviso legal' : 'Legal Notice'}</Link>
              <Link href={`/${locale}/legal/privacidad`} className="hover:underline hover:text-white transition-colors">{locale === 'es' ? 'Privacidad' : 'Privacy'}</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-normal text-white/30 text-[10px]">
            <p>&copy; {new Date().getFullYear()} Yabadabadoo Campers. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
            <p>Diseñado con simplicidad y pureza en España.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
