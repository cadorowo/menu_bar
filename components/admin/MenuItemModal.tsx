'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, Upload, Save, Globe } from 'lucide-react';
import { MenuItem, Category, AllergenCode } from '@/lib/types';
import { ALLERGENS } from '@/lib/allergens';
import { uploadDishPhoto } from '@/lib/supabase';
import { AllergenSvgIcon } from '@/components/public/AllergenIcons';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<MenuItem>) => void;
  initialItem?: MenuItem | null;
  categories: Category[];
}

export function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  categories,
}: MenuItemModalProps) {
  const [nameIt, setNameIt] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [descIt, setDescIt] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [allergens, setAllergens] = useState<AllergenCode[]>([]);
  const [soldOut, setSoldOut] = useState(false);
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setNameIt(initialItem.name.it || '');
      setNameEn(initialItem.name.en || '');
      setNameFr(initialItem.name.fr || '');
      setDescIt(initialItem.description?.it || '');
      setDescEn(initialItem.description?.en || '');
      setDescFr(initialItem.description?.fr || '');
      setPrice(initialItem.price.toString());
      setCategoryId(initialItem.category_id);
      setPhotoUrl(initialItem.photo_url || '');
      setAllergens(initialItem.allergens || []);
      setSoldOut(initialItem.sold_out);
      setActive(initialItem.active);
    } else {
      setNameIt('');
      setNameEn('');
      setNameFr('');
      setDescIt('');
      setDescEn('');
      setDescFr('');
      setPrice('');
      setCategoryId(categories[0]?.id || '');
      setPhotoUrl('');
      setAllergens([]);
      setSoldOut(false);
      setActive(true);
    }
  }, [initialItem, categories, isOpen]);

  if (!isOpen) return null;

  const toggleAllergen = (code: AllergenCode) => {
    setAllergens((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadedUrl = await uploadDishPhoto(file);
    if (uploadedUrl) {
      setPhotoUrl(uploadedUrl);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameIt.trim() || !price || !categoryId) return;

    onSave({
      id: initialItem?.id,
      category_id: categoryId,
      name: {
        it: nameIt.trim(),
        en: nameEn.trim() || nameIt.trim(),
        fr: nameFr.trim() || nameIt.trim(),
      },
      description: {
        it: descIt.trim(),
        en: descEn.trim(),
        fr: descFr.trim(),
      },
      price: parseFloat(price),
      photo_url: photoUrl.trim() || null,
      allergens,
      sold_out: soldOut,
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-xs p-0 sm:p-4 font-sans">
      <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-aperitivo-spritz" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              {initialItem ? 'Modifica Piatto' : 'Aggiungi Nuovo Piatto'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form id="menu-item-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Categoria *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-aperitivo-spritz focus:border-aperitivo-spritz outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.it}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Prezzo (€) *
              </label>
              <input
                type="number"
                step="0.10"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="es. 7.50"
                required
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-aperitivo-spritz focus:border-aperitivo-spritz outline-none"
              />
            </div>
          </div>

          {/* Multilingual Names (IT, EN, FR) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-aperitivo-spritz" />
              <span>Nome Prodotto Trilingue (IT / EN / FR)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">IT *</span>
                <input
                  type="text"
                  value={nameIt}
                  onChange={(e) => setNameIt(e.target.value)}
                  placeholder="Genepì Spritz"
                  required
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">EN</span>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Valdostan Genepì Spritz"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">FR</span>
                <input
                  type="text"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  placeholder="Spritz au Génépy"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none"
                />
              </div>
            </div>
          </div>

          {/* Multilingual Descriptions (IT, EN, FR) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Descrizione Trilingue
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">IT</span>
                <textarea
                  rows={2}
                  value={descIt}
                  onChange={(e) => setDescIt(e.target.value)}
                  placeholder="Ingredienti..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none resize-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">EN</span>
                <textarea
                  rows={2}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="Ingredients..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none resize-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">FR</span>
                <textarea
                  rows={2}
                  value={descFr}
                  onChange={(e) => setDescFr(e.target.value)}
                  placeholder="Ingrédients..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload & URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Foto Piatto (Upload File o URL)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <label className="flex items-center justify-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-aperitivo-spritz" />
                <span>{uploading ? 'Caricamento...' : 'Carica File Immagine'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-center sm:text-left text-xs text-stone-400 font-medium">oppure</span>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-aperitivo-spritz outline-none"
              />
            </div>

            {photoUrl && (
              <div className="flex items-center gap-2 pt-1">
                <img
                  src={photoUrl}
                  alt="Anteprima"
                  className="w-10 h-10 rounded-lg object-cover border border-stone-300 shadow-2xs"
                />
                <span className="text-[11px] text-stone-500 font-medium">
                  Anteprima foto caricata
                </span>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-xs text-rose-600 hover:underline ml-auto font-medium"
                >
                  Rimuovi foto
                </button>
              </div>
            )}
          </div>

          {/* Allergen Selection Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Allergeni EU (14 Obbligatori)
              </label>
              {allergens.length === 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Da selezionare
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-stone-200 rounded-xl bg-stone-50/50">
              {ALLERGENS.map((allergen) => {
                const isSelected = allergens.includes(allergen.code);
                return (
                  <button
                    key={allergen.code}
                    type="button"
                    onClick={() => toggleAllergen(allergen.code)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-aperitivo-spritz text-white font-semibold shadow-2xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border text-[9px] font-bold flex-shrink-0 ${
                        isSelected
                          ? 'border-white bg-white/20 text-white'
                          : 'border-stone-300 text-aperitivo-spritz'
                      }`}
                    >
                      <AllergenSvgIcon code={allergen.code} size={13} />
                    </span>
                    <span className="truncate">{allergen.label.it.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 px-3 py-2 rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={soldOut}
                onChange={(e) => setSoldOut(e.target.checked)}
                className="w-4 h-4 rounded text-aperitivo-spritz focus:ring-aperitivo-spritz cursor-pointer"
              />
              <span>Segna come Esaurito (Sold Out)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-aperitivo-spritz focus:ring-aperitivo-spritz cursor-pointer"
              />
              <span>Attivo (Visibile nel menu)</span>
            </label>
          </div>
        </form>

        {/* Sticky Fixed Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-5 sm:px-6 py-3.5 flex items-center justify-between z-20 flex-shrink-0 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            form="menu-item-form"
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion hover:opacity-95 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{initialItem ? 'Salva Modifiche' : 'Salva Piatto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
