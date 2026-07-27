'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw } from 'lucide-react';
import { ChangeLog } from '@/lib/types';
import { Store } from '@/lib/db';

export default function ChangeLogViewerPage() {
  const [logs, setLogs] = useState<ChangeLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(Store.getChangeLogs());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Registro Modifiche (Audit Log)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Storico immutabile di tutte le modifiche apportate al menu digitale.
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Aggiorna</span>
        </button>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Data & Ora</th>
                <th className="p-4">Utente Admin</th>
                <th className="p-4">Azione</th>
                <th className="p-4">Entità</th>
                <th className="p-4">ID Oggetto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-stone-600">
                    {new Date(log.created_at).toLocaleString('it-IT')}
                  </td>
                  <td className="p-4 font-medium text-stone-900">
                    {log.admin_user_email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'UPDATE'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'DELETE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-stone-700">
                    {log.entity_type}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-stone-500">
                    {log.entity_id}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    Nessuna modifica registrata finora.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
