'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const locale = useLocale();
  
  const content = {
    es: {
      title: 'Política de Privacidad',
      sections: [
        {
          title: 'Responsable del tratamiento',
          content: `• Responsable: Yabadabadoo Campers
• NIF: [PENDIENTE]
• Dirección: [PENDIENTE]
• Email: info@yabadabadoocampers.com`
        },
        {
          title: 'Datos que recopilamos',
          content: `Recopilamos los siguientes datos personales:
• Nombre completo
• Correo electrónico
• Número de teléfono
• DNI/Pasaporte
• Número de carné de conducir
• Datos de pago (procesados por pasarela segura)`
        },
        {
          title: 'Finalidad del tratamiento',
          content: `Los datos personales se utilizan para:
• Gestionar las reservas de alquiler
• Comunicaciones relacionadas con el servicio
• Cumplimiento de obligaciones legales
• Envío de información comercial (con consentimiento)`
        },
        {
          title: 'Base legal',
          content: 'El tratamiento de datos se basa en la ejecución del contrato de alquiler, el cumplimiento de obligaciones legales y el consentimiento del usuario para comunicaciones comerciales.'
        },
        {
          title: 'Conservación de datos',
          content: 'Los datos se conservarán durante la relación contractual y posteriormente durante los plazos legales aplicables (mínimo 5 años para obligaciones fiscales).'
        },
        {
          title: 'Derechos del usuario',
          content: `Puede ejercer los siguientes derechos:
• Acceso a sus datos personales
• Rectificación de datos inexactos
• Supresión de datos
• Limitación del tratamiento
• Portabilidad de datos
• Oposición al tratamiento

Para ejercer estos derechos, contacte a: info@yabadabadoocampers.com`
        },
        {
          title: 'Seguridad',
          content: 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra acceso, alteración, divulgación o destrucción no autorizados.'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: 'Data Controller',
          content: `• Controller: Yabadabadoo Campers
• Tax ID: [PENDING]
• Address: [PENDING]
• Email: info@yabadabadoocampers.com`
        },
        {
          title: 'Data We Collect',
          content: `We collect the following personal data:
• Full name
• Email address
• Phone number
• ID/Passport number
• Driver's license number
• Payment data (processed through secure gateway)`
        },
        {
          title: 'Purpose of Processing',
          content: `Personal data is used to:
• Manage rental bookings
• Service-related communications
• Legal compliance
• Marketing communications (with consent)`
        },
        {
          title: 'Legal Basis',
          content: 'Data processing is based on contract execution for rental services, legal compliance, and user consent for marketing communications.'
        },
        {
          title: 'Data Retention',
          content: 'Data will be retained during the contractual relationship and subsequently for the applicable legal periods (minimum 5 years for tax obligations).'
        },
        {
          title: 'Your Rights',
          content: `You can exercise the following rights:
• Access to your personal data
• Rectification of inaccurate data
• Erasure of data
• Restriction of processing
• Data portability
• Objection to processing

To exercise these rights, contact: info@yabadabadoocampers.com`
        },
        {
          title: 'Security',
          content: 'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.'
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
