'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CookiesPage() {
  const locale = useLocale();
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  
  const content = {
    es: {
      title: 'Política de Cookies',
      intro: 'Este sitio web utiliza cookies para mejorar su experiencia de navegación. A continuación explicamos qué son las cookies, qué tipos utilizamos y cómo puede gestionarlas.',
      what: {
        title: '¿Qué son las cookies?',
        content: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo.'
      },
      types: {
        title: 'Tipos de cookies que utilizamos',
        items: [
          {
            name: 'Cookies necesarias',
            description: 'Esenciales para el funcionamiento del sitio web. Permiten funciones básicas como la navegación y el acceso a áreas seguras.',
            required: true
          },
          {
            name: 'Cookies analíticas',
            description: 'Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información de forma anónima.',
            required: false
          },
          {
            name: 'Cookies de marketing',
            description: 'Se utilizan para rastrear a los visitantes en los sitios web con el fin de mostrar anuncios relevantes.',
            required: false
          }
        ]
      },
      manage: {
        title: 'Gestionar preferencias',
        save: 'Guardar preferencias'
      }
    },
    en: {
      title: 'Cookie Policy',
      intro: 'This website uses cookies to improve your browsing experience. Below we explain what cookies are, what types we use, and how you can manage them.',
      what: {
        title: 'What are cookies?',
        content: 'Cookies are small text files that are stored on your device when you visit a website. They allow the site to remember your actions and preferences over a period of time.'
      },
      types: {
        title: 'Types of cookies we use',
        items: [
          {
            name: 'Necessary cookies',
            description: 'Essential for the website to function. They enable basic features like navigation and access to secure areas.',
            required: true
          },
          {
            name: 'Analytics cookies',
            description: 'Help us understand how visitors interact with the website by collecting information anonymously.',
            required: false
          },
          {
            name: 'Marketing cookies',
            description: 'Used to track visitors across websites in order to display relevant advertisements.',
            required: false
          }
        ]
      },
      manage: {
        title: 'Manage preferences',
        save: 'Save preferences'
      }
    }
  };

  const c = content[locale as 'es' | 'en'] || content.es;

  const handleSave = () => {
    // Save to localStorage and set cookies
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert(locale === 'es' ? 'Preferencias guardadas' : 'Preferences saved');
  };

  return (
    <div className="bg-light min-h-screen pt-48 pb-32">
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black mb-6 tracking-tighter text-dark">{c.title}</h1>
          <p className="text-gray-500 mb-12 text-lg leading-relaxed font-medium">{c.intro}</p>
          
          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-premium border border-gray-50 space-y-16">
            <section>
              <h2 className="font-bold mb-4 text-primary uppercase tracking-widest text-xs">{c.what.title}</h2>
              <p className="text-gray-500 leading-relaxed font-medium">{c.what.content}</p>
            </section>

            <section>
              <h2 className="font-bold mb-8 text-primary uppercase tracking-widest text-xs">{c.types.title}</h2>
              <div className="space-y-6">
                {c.types.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-2 tracking-tight">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={idx === 0 ? true : idx === 1 ? preferences.analytics : preferences.marketing}
                          onChange={(e) => {
                            if (idx === 1) setPreferences({...preferences, analytics: e.target.checked});
                            if (idx === 2) setPreferences({...preferences, marketing: e.target.checked});
                          }}
                          disabled={item.required}
                          className="sr-only peer"
                        />
                        <div className={`w-14 h-8 rounded-full transition-all peer-focus:ring-4 peer-focus:ring-primary/10 
                          ${item.required ? 'bg-primary' : 'bg-gray-200 peer-checked:bg-primary'}
                          after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white 
                          after:rounded-lg after:h-6 after:w-6 after:transition-all
                          peer-checked:after:translate-x-6`}>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-bold mb-6 text-primary uppercase tracking-widest text-xs">{c.manage.title}</h2>
              <button onClick={handleSave} className="btn btn-primary rounded-2xl px-10 shadow-lg shadow-primary/20">
                {c.manage.save}
              </button>
            </section>
          </div>
          
          <p className="text-xs font-bold text-gray-400 mt-12 uppercase tracking-[0.2em] text-center">
            {locale === 'es' ? 'Última actualización: Febrero 2026' : 'Last updated: February 2026'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
