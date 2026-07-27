'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Save,
  RefreshCw,
  Loader2,
  Check,
  WifiOff,
} from 'lucide-react';
import { Category, MenuItem } from '@/lib/types';
import { Store } from '@/lib/db';

// ─── Inline toast notification ────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-white transition-all ${
        type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
      }`}
    >
      {type === 'success' ? <Check className="w-4 h-4 stroke-[3]" /> : <WifiOff className="w-4 h-4" />}
      <span>{message}</span>
    </div>
  );
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [nameIt, setNameIt] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // ── Load: always pull fresh data from Supabase ──────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [cats, its] = await Promise.all([
      Store.fetchCategoriesFromSupabase(true), // adminMode = true → ALL including inactive
      Store.fetchMenuItemsFromSupabase(true),
    ]);
    setCategories(cats.sort((a, b) => a.sort_order - b.sort_order));
    setItems(its);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setNameIt('');
    setNameEn('');
    setNameFr('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNameIt(cat.name.it || '');
    setNameEn(cat.name.en || '');
    setNameFr(cat.name.fr || '');
    setIsModalOpen(true);
  };

  // ── Save (add or edit) ─────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameIt.trim()) return;

    let targetCategory: Category;

    if (editingCategory) {
      targetCategory = {
        ...editingCategory,
        name: {
          it: nameIt.trim(),
          en: nameEn.trim() || nameIt.trim(),
          fr: nameFr.trim() || nameIt.trim(),
        },
      };
    } else {
      targetCategory = {
        id: crypto.randomUUID(),
        name: {
          it: nameIt.trim(),
          en: nameEn.trim() || nameIt.trim(),
          fr: nameFr.trim() || nameIt.trim(),
        },
        sort_order: categories.length + 1,
        active: true,
      };
    }

    // Optimistic UI update
    const updatedCategories = editingCategory
      ? categories.map((c) => (c.id === editingCategory.id ? targetCategory : c))
      : [...categories, targetCategory];
    setCategories(updatedCategories);

    setModalSaving(true);
    const err = await Store.upsertCategory(targetCategory);
    setModalSaving(false);
    setIsModalOpen(false);

    if (err) {
      showToast(`Errore Supabase: ${err}`, 'error');
    } else {
      showToast(editingCategory ? 'Categoria aggiornata!' : 'Categoria aggiunta!', 'success');
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: editingCategory ? 'UPDATE' : 'CREATE',
        entity_type: 'Category',
        entity_id: targetCategory.id,
      });
    }
  };

  // ── Reorder (move up / down) ──────────────────────────────────────────
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    // Re-assign sort_order
    const reordered = newCategories.map((c, i) => ({
      ...c,
      sort_order: i + 1,
    }));
    setCategories(reordered);

    setSyncing(true);
    const err = await Store.upsertCategories(reordered);
    setSyncing(false);

    if (err) {
      showToast(`Errore riordino: ${err}`, 'error');
    } else {
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'REORDER',
        entity_type: 'Category',
        entity_id: 'all',
      });
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const previousCategories = categories;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);

    setSyncing(true);
    const err = await Store.deleteCategory(id);
    setSyncing(false);

    if (err) {
      setCategories(previousCategories); // revert
      showToast(`Errore eliminazione: ${err}`, 'error');
    } else {
      showToast('Categoria eliminata.', 'success');
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'DELETE',
        entity_type: 'Category',
        entity_id: id,
      });
    }
  };

  // ── Toggle active ─────────────────────────────────────────────────────
  const toggleActive = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const updated = { ...cat, active: !cat.active };
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));

    setSyncing(true);
    const err = await Store.upsertCategory(updated);
    setSyncing(false);

    if (err) {
      setCategories((prev) => prev.map((c) => (c.id === id ? cat : c))); // revert
      showToast(`Errore sincronizzazione: ${err}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-7 h-7 animate-spin text-aperitivo-spritz" />
          <p className="text-xs font-semibold">Caricamento da Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Syncing indicator */}
      {syncing && (
        <div className="fixed top-4 right-4 z-[150] flex items-center gap-2 px-3 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Sincronizzazione...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
            Gestione Categorie
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 sm:mt-1">
            Riordina, aggiungi o modifica le sezioni del menu digitale.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors shadow-2xs"
            title="Ricarica dati da Supabase"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Categoria</span>
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden divide-y divide-stone-100">
        {categories.map((cat, index) => {
          const count = items.filter((i) => i.category_id === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50/50 transition-colors"
            >
              {/* Category Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Large Touch Up/Down Reorder Controls */}
                <div className="flex flex-row sm:flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0 || syncing}
                    className="p-1.5 sm:p-1 rounded bg-stone-100 sm:bg-transparent text-stone-600 hover:text-stone-900 disabled:opacity-30"
                    title="Sposta in alto"
                  >
                    <ArrowUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === categories.length - 1 || syncing}
                    className="p-1.5 sm:p-1 rounded bg-stone-100 sm:bg-transparent text-stone-600 hover:text-stone-900 disabled:opacity-30"
                    title="Sposta in basso"
                  >
                    <ArrowDown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-aperitivo-linen border border-stone-200 flex items-center justify-center text-aperitivo-spritz font-extrabold text-xs flex-shrink-0">
                  {cat.sort_order}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {cat.name.it}
                    </h3>
                    {cat.name.en && (
                      <span className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                        EN: {cat.name.en}
                      </span>
                    )}
                    {cat.name.fr && (
                      <span className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                        FR: {cat.name.fr}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {count} {count === 1 ? 'prodotto' : 'prodotti'} associati
                  </span>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <button
                  onClick={() => toggleActive(cat.id)}
                  disabled={syncing}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
                    cat.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat.active ? 'Attiva' : 'Nascosta'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Modifica categoria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Elimina categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="p-10 text-center text-stone-400 font-medium text-xs">
            Nessuna categoria. Aggiungine una con il tasto &quot;Nuova Categoria&quot;.
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nome (Italiano) *
                </label>
                <input
                  type="text"
                  value={nameIt}
                  onChange={(e) => setNameIt(e.target.value)}
                  placeholder="es. Aperitivi & Cocktails"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nome (Inglese - EN)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="es. Aperitifs & Cocktails"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nome (Francese - FR)
                </label>
                <input
                  type="text"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  placeholder="es. Apéritifs & Cocktails"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-aperitivo-spritz hover:bg-aperitivo-vermilion rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {modalSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{modalSaving ? 'Salvataggio...' : 'Salva Categoria'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Confermi l&apos;eliminazione?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {items.filter((i) => i.category_id === deleteConfirmId).length > 0
                ? `Attenzione: ci sono ${
                    items.filter((i) => i.category_id === deleteConfirmId).length
                  } prodotti associati a questa categoria. Verranno eliminati automaticamente da Supabase.`
                : 'Sei sicuro di voler eliminare questa categoria dal menu?'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Elimina Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
