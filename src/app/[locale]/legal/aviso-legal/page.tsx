'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function LegalPage() {
  const locale = useLocale();
  
  const content = {
    es: {
      title: 'Aviso Legal',
      sections: [
        {
          title: 'Datos identificativos',
          content: `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, se informa:

• Titular: Yabadabadoo Campers
• NIF: [PENDIENTE]
• Domicilio: [PENDIENTE]
• Email: info@yabadabadoocampers.com
• Actividad: Alquiler de vehículos camper`
        },
        {
          title: 'Objeto',
          content: 'El presente sitio web tiene como objeto facilitar información sobre los servicios de alquiler de camper ofrecidos por Yabadabadoo Campers, así como permitir la reserva online de los mismos.'
        },
        {
          title: 'Propiedad intelectual',
          content: 'Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, logotipos, iconos, tecnología, software, así como el diseño gráfico y códigos fuente, son propiedad de Yabadabadoo Campers o de terceros que han autorizado su uso, quedando protegidos por los derechos de propiedad intelectual e industrial.'
        },
        {
          title: 'Responsabilidad',
          content: 'Yabadabadoo Campers no se hace responsable de los daños y perjuicios que puedan derivarse de interferencias, omisiones, interrupciones, virus informáticos, averías y/o desconexiones en el funcionamiento operativo del sistema electrónico.'
        },
        {
          title: 'Legislación aplicable',
          content: 'Las presentes condiciones se rigen por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a la jurisdicción de los Juzgados y Tribunales de la ciudad del domicilio del titular.'
        }
      ]
    },
    en: {
      title: 'Legal Notice',
      sections: [
        {
          title: 'Identification',
          content: `In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce:

• Owner: Yabadabadoo Campers
• Tax ID: [PENDING]
• Address: [PENDING]
• Email: info@yabadabadoocampers.com
• Activity: Camper van rental`
        },
        {
          title: 'Purpose',
          content: 'This website aims to provide information about the camper rental services offered by Yabadabadoo Campers, as well as to enable online booking of these services.'
        },
        {
          title: 'Intellectual Property',
          content: 'All content on the website, including texts, photographs, graphics, images, logos, icons, technology, software, as well as graphic design and source codes, are the property of Yabadabadoo Campers or third parties who have authorized their use, and are protected by intellectual and industrial property rights.'
        },
        {
          title: 'Liability',
          content: 'Yabadabadoo Campers is not responsible for damages that may arise from interference, omissions, interruptions, computer viruses, breakdowns and/or disconnections in the operational functioning of the electronic system.'
        },
        {
          title: 'Applicable Law',
          content: 'These conditions are governed by Spanish law. For any dispute that may arise from access to or use of this website, the parties submit to the jurisdiction of the Courts and Tribunals of the city of the owner\'s domicile.'
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
