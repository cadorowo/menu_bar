'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Save,
  Globe,
} from 'lucide-react';
import { Category, MenuItem } from '@/lib/types';
import { Store } from '@/lib/db';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [nameIt, setNameIt] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const cats = Store.getCategories().sort((a, b) => a.sort_order - b.sort_order);
    setCategories(cats);
    setItems(Store.getMenuItems());
  };

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameIt.trim()) return;

    let updated: Category[];
    if (editingCategory) {
      updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: {
                it: nameIt.trim(),
                en: nameEn.trim() || nameIt.trim(),
                fr: nameFr.trim() || nameIt.trim(),
              },
            }
          : c
      );
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'UPDATE',
        entity_type: 'Category',
        entity_id: editingCategory.id,
      });
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name: {
          it: nameIt.trim(),
          en: nameEn.trim() || nameIt.trim(),
          fr: nameFr.trim() || nameIt.trim(),
        },
        sort_order: categories.length + 1,
        active: true,
      };
      updated = [...categories, newCat];
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'CREATE',
        entity_type: 'Category',
        entity_id: newCat.id,
      });
    }

    Store.saveCategories(updated);
    setCategories(updated);
    setIsModalOpen(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
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

    Store.saveCategories(reordered);
    setCategories(reordered);
    Store.addChangeLog({
      admin_user_email: 'staff@barfranca.it',
      action: 'REORDER',
      entity_type: 'Category',
      entity_id: 'all',
    });
  };

  const handleDelete = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    Store.saveCategories(updated);
    setCategories(updated);
    setDeleteConfirmId(null);
    Store.addChangeLog({
      admin_user_email: 'staff@barfranca.it',
      action: 'DELETE',
      entity_type: 'Category',
      entity_id: id,
    });
  };

  const toggleActive = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    Store.saveCategories(updated);
    setCategories(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
            Gestione Categorie
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Riordina, aggiungi o modifica le sezioni del menu digitale.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Categoria</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden divide-y divide-stone-100">
        {categories.map((cat, index) => {
          const count = items.filter((i) => i.category_id === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
            >
              {/* Category Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                    title="Sposta in alto"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === categories.length - 1}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                    title="Sposta in basso"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-aperitivo-linen border border-stone-200 flex items-center justify-center text-aperitivo-spritz font-extrabold text-xs flex-shrink-0">
                  {cat.sort_order}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {cat.name.it}
                    </h3>
                    {cat.name.en && (
                      <span className="text-[11px] text-stone-400 font-medium">
                        EN: {cat.name.en}
                      </span>
                    )}
                    {cat.name.fr && (
                      <span className="text-[11px] text-stone-400 font-medium">
                        FR: {cat.name.fr}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {count} {count === 1 ? 'prodotto' : 'prodotti'} associati
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    cat.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat.active ? 'Attiva' : 'Nascosta'}
                </button>

                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteConfirmId(cat.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
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
                  className="px-5 py-2 text-xs font-bold text-white bg-aperitivo-spritz hover:bg-aperitivo-vermilion rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salva Categoria</span>
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
              Confermi l'eliminazione?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {items.filter((i) => i.category_id === deleteConfirmId).length > 0
                ? `Attenzione: ci sono ${
                    items.filter((i) => i.category_id === deleteConfirmId).length
                  } prodotti associati a questa categoria.`
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
