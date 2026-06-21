'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';

type DashboardSidebarProps = {
  locale: string;
};

export default function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      href: `/${locale}/dashboard`,
      label: 'Resumen',
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/dashboard/bookings`,
      label: 'Reservas',
      icon: CalendarDays,
    },
    {
      href: `/${locale}/dashboard/finance`,
      label: 'Finanzas',
      icon: CreditCard,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: 'Ajustes',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push(`/${locale}/dashboard/login`);
    router.refresh();
  };

  return (
    <aside className="w-full border-b border-gray-100 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-6 py-5 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <Home size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">Yaba Control</p>
            <p className="text-xs text-gray-500">Panel operativo</p>
          </div>
        </Link>
      </div>

      <nav className="grid gap-2 px-4 pb-6 lg:px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-6 py-5 text-sm text-gray-500">
        <p className="font-semibold text-gray-800">Administrador</p>
        <p className="mt-1">Gestión de reservas, cobros y cuentas.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
