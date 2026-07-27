'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden bg-stone-900 text-white px-4 py-3 border-b border-stone-800 flex items-center justify-between sticky top-0 z-40 font-sans shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
            aria-label="Apri Menu Navigazione"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide font-serif leading-none">
              Bar Franca — Aosta
            </h2>
            <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider">
              Pannello Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 text-[11px] font-semibold transition-colors"
          >
            <span>Menu</span>
            <ExternalLink className="w-3 h-3 text-aperitivo-spritz" />
          </a>
        </div>
      </header>

      {/* Mobile Slide-over Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-stone-900 text-stone-300 flex flex-col h-full z-10 shadow-2xl animate-slideRight font-sans border-r border-stone-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide font-serif">
                  Bar Franca — Aosta
                </h2>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                  Pannello Admin
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion text-white shadow-md'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-stone-600'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer Logout */}
            <div className="p-4 border-t border-stone-800 space-y-3">
              <a
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-aperitivo-spritz" />
                <span>Vedi Menu Pubblico</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/50 rounded-xl text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnetti</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile, fixed w-64 on desktop) */}
      <aside className="hidden md:flex w-64 bg-stone-900 text-stone-300 flex-col min-h-screen border-r border-stone-800 flex-shrink-0 font-sans">
        {/* Brand Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide font-serif">
              Bar Franca — Aosta
            </h2>
            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
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
    </>
  );
}
