'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Category, MenuItem, ChangeLog } from '@/lib/types';
import { Store } from '@/lib/db';

export default function AdminDashboardOverview() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [logs, setLogs] = useState<ChangeLog[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const [cats, its] = await Promise.all([
        Store.fetchCategoriesFromSupabase(true),
        Store.fetchMenuItemsFromSupabase(true),
      ]);
      setCategories(cats);
      setItems(its);
      setLogs(Store.getChangeLogs());
    }
    loadDashboard();
  }, []);

  const totalCategories = categories.length;
  const activeItemsCount = items.filter((i) => i.active).length;
  const soldOutCount = items.filter((i) => i.sold_out).length;
  const missingAllergensCount = items.filter(
    (i) => !i.allergens || i.allergens.length === 0
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
            Panoramica Menu — Bar Franca
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 sm:mt-1">
            Gestisci in tempo reale le categorie, i piatti e le informazioni sugli allergeni per Aosta.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/items"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Piatto</span>
          </Link>
          <a
            href="/"
            target="_blank"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs rounded-xl transition-colors shadow-2xs"
          >
            <span>Menu Pubblico</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Summary KPI Cards (2 Columns on Mobile, 4 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Categorie</span>
            <div className="p-1.5 sm:p-2 bg-stone-100 rounded-lg text-stone-700">
              <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">{totalCategories}</div>
          <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
            Sezioni attive
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Piatti Attivi</span>
            <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">{activeItemsCount}</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-600 font-medium flex items-center gap-1 truncate">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            <span>Visibili online</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Esauriti</span>
            <div className="p-1.5 sm:p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700">{soldOutCount}</div>
          <div className="text-[10px] sm:text-[11px] text-amber-700 font-medium truncate">
            Non disponibili
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Allergeni</span>
            <div
              className={`p-1.5 sm:p-2 rounded-lg ${
                missingAllergensCount > 0
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-extrabold ${
              missingAllergensCount > 0 ? 'text-rose-600' : 'text-stone-900'
            }`}
          >
            {missingAllergensCount}
          </div>
          <div
            className={`text-[10px] sm:text-[11px] font-medium truncate ${
              missingAllergensCount > 0 ? 'text-rose-600' : 'text-stone-500'
            }`}
          >
            {missingAllergensCount > 0
              ? 'Da verificare'
              : 'Verificati'}
          </div>
        </div>
      </div>

      {/* Compliance Banner */}
      <div className="bg-aperitivo-softGlow border border-aperitivo-border rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 shadow-2xs">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-aperitivo-spritz flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-stone-900">
            Conformità Regolamento UE 1169/2011 & Trilinguismo (IT / EN / FR)
          </h3>
          <p className="text-stone-700 leading-relaxed text-[11px] sm:text-xs">
            Il menu di Bar Franca Aosta soddisfa tutti i requisiti di informativa sugli allergeni. I 14 allergeni principali sono forniti di icona grafica e legenda trilingue accessibile in tempo reale.
          </p>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Attività Recenti
          </h3>
          <Link
            href="/admin/changelog"
            className="text-xs font-bold text-aperitivo-spritz hover:underline"
          >
            Vedi tutto
          </Link>
        </div>
        <div className="divide-y divide-stone-100 text-xs">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-stone-800 truncate block">
                  {log.action} — {log.entity_type} ({log.entity_id})
                </span>
                <p className="text-stone-500 text-[11px] truncate">
                  Effettuato da {log.admin_user_email}
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-400 font-mono">
                {new Date(log.created_at).toLocaleString('it-IT')}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-6 text-center text-stone-400">
              Nessuna modifica recente registrata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
