'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const locale = useLocale();
  
  const content = {
    es: {
      title: 'Condiciones de Alquiler',
      sections: [
        {
          title: '1. Requisitos del conductor',
          content: `• Edad mínima: 25 años
• Carné de conducir B en vigor (mínimo 2 años de antigüedad)
• DNI/Pasaporte válido
• Tarjeta de crédito a nombre del conductor principal`
        },
        {
          title: '2. Reserva y pago',
          content: `• La reserva se confirma con el pago del 30% del importe total
• El resto se abona 7 días antes de la recogida
• Fianza de 500€ (se retiene en tarjeta y libera tras devolución)`
        },
        {
          title: '3. Recogida y devolución',
          content: `• Horario: 10:00 - 18:00 de lunes a sábado
• Se entrega con depósito de combustible lleno
• Debe devolverse con el mismo nivel de combustible
• Revisión conjunta del vehículo antes y después`
        },
        {
          title: '4. Uso del vehículo',
          content: `• Prohibido fumar en el interior
• No se admiten mascotas (excepto consulta previa)
• Velocidad máxima recomendada: 110 km/h
• Está prohibido su uso fuera de España sin autorización
• El arrendatario es responsable de las multas de tráfico`
        },
        {
          title: '5. Seguro incluido',
          content: `El alquiler incluye:
• Seguro a todo riesgo con franquicia de 1.500€
• Asistencia en carretera 24h
• La franquicia puede reducirse a 300€ por 15€/día adicional`
        },
        {
          title: '6. Cancelaciones y reembolsos',
          content: `• Más de 14 días antes: 100% de reembolso
• Entre 7 y 14 días: 50% de reembolso
• Menos de 7 días: sin reembolso
• No-show: sin reembolso`
        },
        {
          title: '7. Daños y responsabilidad',
          content: `• Cualquier daño debe comunicarse inmediatamente
• Los daños por negligencia no están cubiertos por el seguro
• El arrendatario es responsable del equipamiento interior`
        }
      ]
    },
    en: {
      title: 'Rental Terms & Conditions',
      sections: [
        {
          title: '1. Driver Requirements',
          content: `• Minimum age: 25 years
• Valid B driving license (minimum 2 years)
• Valid ID/Passport
• Credit card in the main driver's name`
        },
        {
          title: '2. Booking and Payment',
          content: `• Booking is confirmed with 30% payment
• Remaining balance due 7 days before pickup
• €500 security deposit (held on card, released after return)`
        },
        {
          title: '3. Pickup and Return',
          content: `• Hours: 10:00 - 18:00 Monday to Saturday
• Delivered with full fuel tank
• Must be returned with same fuel level
• Joint vehicle inspection before and after`
        },
        {
          title: '4. Vehicle Use',
          content: `• No smoking inside
• No pets allowed (unless previously agreed)
• Recommended maximum speed: 110 km/h
• Use outside Spain requires authorization
• Renter is responsible for traffic fines`
        },
        {
          title: '5. Insurance Included',
          content: `Rental includes:
• Comprehensive insurance with €1,500 excess
• 24h roadside assistance
• Excess can be reduced to €300 for €15/day extra`
        },
        {
          title: '6. Cancellations and Refunds',
          content: `• More than 14 days before: 100% refund
• Between 7 and 14 days: 50% refund
• Less than 7 days: no refund
• No-show: no refund`
        },
        {
          title: '7. Damages and Liability',
          content: `• Any damage must be reported immediately
• Damage due to negligence is not covered by insurance
• Renter is responsible for interior equipment`
        }
      ]
    }
  };

  const c = content[locale as 'es' | 'en'] || content.es;

  return (
    <div className="bg-light min-h-screen pt-48 pb-32">
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black mb-12 tracking-tighter text-dark">{c.title}</h1>
          
          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-premium border border-gray-50">
            {c.sections.map((section, idx) => (
              <section key={idx} className="mb-12 last:mb-0">
                <h2 className="font-bold mb-4 text-primary uppercase tracking-widest text-xs">{section.title}</h2>
                <div className="text-gray-500 whitespace-pre-line leading-relaxed font-medium">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
          
          <p className="text-xs font-bold text-gray-400 mt-12 uppercase tracking-[0.2em] text-center">
            {locale === 'es' ? 'Última actualización: Febrero 2026' : 'Last updated: February 2026'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
