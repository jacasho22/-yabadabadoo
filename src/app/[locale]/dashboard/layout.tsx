import React from 'react';
import {
  Calendar,
  Users,
  Settings,
  Bell,
  Search,
  Home,
  DollarSign,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  const menuItems = [
    { icon: Calendar, label: 'Calendario', href: `/${locale}/dashboard`, active: true },
    { icon: Users, label: 'Reservas', href: `/${locale}/dashboard/bookings` },
    { icon: DollarSign, label: 'Precios', href: `/${locale}/dashboard/pricing` },
    { icon: Settings, label: 'Configuración', href: `/${locale}/dashboard/settings` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Yaba Control</span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4">
          <div className="space-y-1">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? 'bg-black text-white shadow-lg shadow-black/10'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="font-semibold text-gray-700">JC</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Juan Carlos</p>
              <p className="text-xs text-gray-500">Propietario</p>
            </div>
          </div>
          <Link
            href={`/${locale}/dashboard/login`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-12 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
