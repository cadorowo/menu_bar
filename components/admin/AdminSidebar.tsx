'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Utensils,
  History,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Categorie',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      label: 'Piatti & Prodotti',
      href: '/admin/items',
      icon: Utensils,
    },
    {
      label: 'Registro Modifiche',
      href: '/admin/changelog',
      icon: History,
    },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aperitivo_admin_session');
    }
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col min-h-screen border-r border-stone-800 flex-shrink-0 font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide font-serif">
            Bar Franca — Aosta
          </h2>
          <span className="text-[10px] text-amber-soft font-mono uppercase tracking-wider">
            Pannello Admin
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-md text-stone-400 hover:text-white transition-colors"
          title="Vedi menu pubblico"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-aperitivo-spritz text-white shadow-sm'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-white' : 'text-stone-600'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-3 border-t border-stone-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnetti</span>
        </button>
      </div>
    </aside>
  );
}
