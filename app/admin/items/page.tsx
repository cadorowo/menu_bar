'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Utensils,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  Ban,
  RefreshCw,
  WifiOff,
  Loader2,
} from 'lucide-react';
import { MenuItem, Category } from '@/lib/types';
import { Store } from '@/lib/db';
import { MenuItemModal } from '@/components/admin/MenuItemModal';
import { AllergenSvgIcon } from '@/components/public/AllergenIcons';

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

export default function MenuItemsManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold_out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null); // id of item being synced
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // ── Load: always pull fresh data from Supabase ──────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [cats, its] = await Promise.all([
      Store.fetchCategoriesFromSupabase(true), // adminMode = true → fetch ALL including inactive
      Store.fetchMenuItemsFromSupabase(true),
    ]);
    setCategories(cats.sort((a, b) => a.sort_order - b.sort_order));
    setItems(its.sort((a, b) => a.sort_order - b.sort_order));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // ── Save (add or edit) ─────────────────────────────────────────────────
  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    let targetItem: MenuItem;

    if (editingItem) {
      targetItem = { ...editingItem, ...itemData } as MenuItem;
    } else {
      targetItem = {
        id: crypto.randomUUID(),
        category_id: itemData.category_id || categories[0]?.id || '',
        name: itemData.name || { it: 'Nuovo Piatto' },
        description: itemData.description,
        price: itemData.price || 0,
        photo_url: itemData.photo_url || null,
        allergens: itemData.allergens || [],
        sold_out: itemData.sold_out || false,
        sort_order: items.length + 1,
        active: itemData.active !== undefined ? itemData.active : true,
      };
    }

    // Optimistic UI update
    const updatedItems = editingItem
      ? items.map((i) => (i.id === editingItem.id ? targetItem : i))
      : [...items, targetItem];
    setItems(updatedItems);

    setSyncing(targetItem.id);
    const err = await Store.upsertMenuItem(targetItem);
    setSyncing(null);

    if (err) {
      showToast(`Errore Supabase: ${err}`, 'error');
    } else {
      showToast(editingItem ? 'Piatto aggiornato!' : 'Piatto aggiunto!', 'success');
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: editingItem ? 'UPDATE' : 'CREATE',
        entity_type: 'MenuItem',
        entity_id: targetItem.id,
      });
    }
  };

  // ── Toggle sold-out ────────────────────────────────────────────────────
  const handleToggleSoldOut = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const updated = { ...item, sold_out: !item.sold_out };
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));

    setSyncing(id);
    const err = await Store.upsertMenuItem(updated);
    setSyncing(null);

    if (err) {
      // Revert on failure
      setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
      showToast(`Errore sincronizzazione: ${err}`, 'error');
    } else {
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'TOGGLE_SOLDOUT',
        entity_type: 'MenuItem',
        entity_id: id,
      });
    }
  };

  // ── Toggle active/visible ─────────────────────────────────────────────
  const handleToggleActive = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const updated = { ...item, active: !item.active };
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));

    setSyncing(id);
    const err = await Store.upsertMenuItem(updated);
    setSyncing(null);

    if (err) {
      setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
      showToast(`Errore sincronizzazione: ${err}`, 'error');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo piatto dal menu?')) return;

    const previousItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    setSyncing(id);
    const err = await Store.deleteMenuItem(id);
    setSyncing(null);

    if (err) {
      setItems(previousItems); // revert
      showToast(`Errore eliminazione: ${err}`, 'error');
    } else {
      showToast('Piatto eliminato.', 'success');
      Store.addChangeLog({
        admin_user_email: 'staff@barfranca.it',
        action: 'DELETE',
        entity_type: 'MenuItem',
        entity_id: id,
      });
    }
  };

  // ── Filter items ──────────────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.it.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.name.en && item.name.en.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesAvailability = true;
    if (availabilityFilter === 'available') matchesAvailability = !item.sold_out;
    if (availabilityFilter === 'sold_out') matchesAvailability = item.sold_out;

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const totalCount = items.length;
  const availableCount = items.filter((i) => !i.sold_out).length;
  const soldOutCount = items.filter((i) => i.sold_out).length;

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
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
            Gestione Piatti & Prodotti
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 sm:mt-1">
            Aggiorna in tempo reale disponibilità, prezzi, allergeni e foto.
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
            <span>Aggiungi Nuovo Piatto</span>
          </button>
        </div>
      </div>

      {/* Quick Availability Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setAvailabilityFilter('all')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            availabilityFilter === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
          }`}
        >
          Tutti ({totalCount})
        </button>

        <button
          onClick={() => setAvailabilityFilter('available')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            availabilityFilter === 'available'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Disponibili ({availableCount})</span>
        </button>

        <button
          onClick={() => setAvailabilityFilter('sold_out')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            availabilityFilter === 'sold_out'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Esauriti ({soldOutCount})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome prodotto o ingrediente..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none font-medium"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-aperitivo-spritz outline-none"
          >
            <option value="all">Tutte le categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.it}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE TOUCH CARD LIST VIEW (< 768px md:hidden) */}
      <div className="block md:hidden space-y-3">
        {filteredItems.map((item) => {
          const category = categories.find((c) => c.id === item.category_id);
          const hasNoAllergens = !item.allergens || item.allergens.length === 0;
          const isSyncing = syncing === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white p-4 rounded-2xl border transition-all space-y-3 shadow-2xs relative ${
                item.sold_out
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-stone-200'
              } ${isSyncing ? 'opacity-70' : ''}`}
            >
              {isSyncing && (
                <div className="absolute top-3 right-3">
                  <Loader2 className="w-4 h-4 animate-spin text-aperitivo-spritz" />
                </div>
              )}

              {/* Header: Name, Category, Price & Photo */}
              <div className="flex items-start gap-3">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-aperitivo-linen border border-stone-200 flex items-center justify-center text-stone-400 font-extrabold text-sm flex-shrink-0">
                    {item.name.it.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-stone-900 leading-snug">
                      {item.name.it}
                    </h3>
                    <span className="font-serif text-sm font-bold text-aperitivo-spritz flex-shrink-0">
                      € {item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                    {category ? category.name.it : '—'}
                  </p>
                </div>
              </div>

              {/* Allergen Badges Row */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                {hasNoAllergens ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    <AlertTriangle className="w-3 h-3" />
                    Allergeni da verificare
                  </span>
                ) : (
                  item.allergens.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] uppercase font-bold text-stone-700 flex items-center gap-1"
                    >
                      <AllergenSvgIcon code={code} size={12} />
                      <span>{code.substring(0, 2)}</span>
                    </span>
                  ))
                )}
              </div>

              {/* Mobile Actions & 1-Click Sold Out Button */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                {/* 1-Click Sold Out Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleSoldOut(item.id)}
                  disabled={isSyncing}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold uppercase transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50 ${
                    item.sold_out
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : item.sold_out ? (
                    <>
                      <Ban className="w-4 h-4" />
                      <span>Esaurito</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Disponibile</span>
                    </>
                  )}
                </button>

                {/* Edit, Hide, Delete triggers */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
                    title={item.active ? 'Nascondi nel menu' : 'Mostra nel menu'}
                  >
                    {item.active ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                    title="Modifica piatto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                    title="Elimina piatto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 font-medium text-xs">
            Nessun prodotto trovato con i filtri selezionati.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>= 768px hidden md:block) */}
      <div className="hidden md:block bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Prodotto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Prezzo</th>
                <th className="p-4 text-center">Allergeni UE</th>
                <th className="p-4 text-center">Disponibilità Rapida</th>
                <th className="p-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => {
                const category = categories.find((c) => c.id === item.category_id);
                const hasNoAllergens = !item.allergens || item.allergens.length === 0;
                const isSyncing = syncing === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      item.sold_out ? 'bg-amber-50/30' : ''
                    } ${isSyncing ? 'opacity-60' : ''}`}
                  >
                    {/* Name & Photo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.photo_url ? (
                          <img
                            src={item.photo_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-aperitivo-linen border border-stone-200 flex items-center justify-center text-stone-400 font-bold text-xs flex-shrink-0">
                            {item.name.it.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900">
                            {item.name.it}
                          </div>
                          {item.name.en && (
                            <div className="text-stone-400 text-[11px]">
                              {item.name.en}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-medium text-stone-700">
                      {category ? category.name.it : '—'}
                    </td>

                    {/* Price */}
                    <td className="p-4 text-right font-serif font-bold text-aperitivo-spritz text-sm">
                      € {item.price.toFixed(2)}
                    </td>

                    {/* Allergen Status with SVG Icons */}
                    <td className="p-4 text-center">
                      {hasNoAllergens ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          Da verificare
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {item.allergens.map((code) => (
                            <span
                              key={code}
                              className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-[9px] uppercase font-bold text-stone-700 flex items-center gap-1"
                              title={code}
                            >
                              <AllergenSvgIcon code={code} size={11} />
                              <span>{code.substring(0, 2)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* INSTANT 1-CLICK SOLD OUT TOGGLE */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSoldOut(item.id)}
                        disabled={isSyncing}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50 ${
                          item.sold_out
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 ring-2 ring-amber-400/30'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        }`}
                        title="Clicca per cambiare immediatamente lo stato esaurito"
                      >
                        {isSyncing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : item.sold_out ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Esaurito</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Disponibile</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleActive(item.id)}
                          disabled={isSyncing}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            item.active
                              ? 'text-stone-500 hover:bg-stone-100'
                              : 'text-stone-300 hover:bg-stone-100'
                          }`}
                          title={item.active ? 'Nascondi nel menu' : 'Mostra nel menu'}
                        >
                          {item.active ? (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-stone-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Modifica piatto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isSyncing}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Elimina piatto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 font-medium">
                    Nessun prodotto trovato con i filtri selezionati.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        categories={categories}
      />
    </div>
  );
}
