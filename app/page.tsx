'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/public/Header';
import { CategoryNav } from '@/components/public/CategoryNav';
import { DishRow } from '@/components/public/DishRow';
import { AllergenLegendModal } from '@/components/public/AllergenLegendModal';
import { Footer } from '@/components/public/Footer';
import { Category, MenuItem } from '@/lib/types';
import { Store } from '@/lib/db';
import { useLocale } from '@/lib/i18n';
import { Search, X } from 'lucide-react';

export default function PublicMenuPage() {
  const { t, locale } = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadedCategories = Store.getCategories()
      .filter((c) => c.active)
      .sort((a, b) => a.sort_order - b.sort_order);
    const loadedItems = Store.getMenuItems()
      .filter((i) => i.active)
      .sort((a, b) => a.sort_order - b.sort_order);

    setCategories(loadedCategories);
    setMenuItems(loadedItems);
    setLoading(false);
  }, []);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter items by search query if typed
  const queryClean = searchQuery.trim().toLowerCase();
  const isSearching = Boolean(queryClean);

  if (loading) {
    return (
      <div className="min-h-screen bg-aperitivo-linen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-aperitivo-spritz border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-aperitivo-muted tracking-wide">
            Caricamento del menu Bar Franca...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aperitivo-linen text-aperitivo-slate flex flex-col font-sans bg-paper-pattern">
      {/* Main Header */}
      <Header onOpenAllergenModal={() => setIsLegendOpen(true)} />

      {/* Category Tab Navigation */}
      <CategoryNav
        categories={categories}
        activeCategoryId={isSearching ? 'all' : activeCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* Search Input Bar (Spacious & Clean) */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 pb-1">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'it'
                ? 'Cerca piatto, drink o ingrediente...'
                : locale === 'fr'
                ? 'Chercher un plat, une boisson...'
                : 'Search dish, drink or ingredient...'
            }
            className="w-full pl-9 pr-9 py-2.5 text-xs rounded-2xl bg-white border border-stone-200 focus:ring-2 focus:ring-aperitivo-spritz/40 focus:border-aperitivo-spritz outline-none shadow-2xs font-medium placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Dishes Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-0 py-3 space-y-7">
        {categories.map((category) => {
          if (!isSearching && activeCategoryId !== 'all' && activeCategoryId !== category.id) {
            return null;
          }

          let categoryItems = menuItems.filter(
            (item) => item.category_id === category.id
          );

          if (isSearching) {
            categoryItems = categoryItems.filter((item) => {
              const nameMatch =
                t(item.name).toLowerCase().includes(queryClean) ||
                (item.name.en && item.name.en.toLowerCase().includes(queryClean)) ||
                (item.name.fr && item.name.fr.toLowerCase().includes(queryClean));
              const descMatch =
                item.description &&
                (t(item.description).toLowerCase().includes(queryClean) ||
                  (item.description.en &&
                    item.description.en.toLowerCase().includes(queryClean)) ||
                  (item.description.fr &&
                    item.description.fr.toLowerCase().includes(queryClean)));
              return nameMatch || descMatch;
            });
          }

          if (categoryItems.length === 0) return null;

          return (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="pt-3 pb-1 scroll-mt-36"
            >
              {/* Category Title Header */}
              <div className="px-5 pb-3 flex items-center justify-between border-b border-aperitivo-border/80 mx-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-aperitivo-spritz inline-block shadow-2xs" />
                  <h2 className="font-serif text-xl font-bold text-aperitivo-slate tracking-tight">
                    {t(category.name)}
                  </h2>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1">
                {categoryItems.map((item) => (
                  <DishRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty Search Result State */}
        {isSearching &&
          menuItems.filter((item) => {
            const nameMatch =
              t(item.name).toLowerCase().includes(queryClean) ||
              (item.name.en && item.name.en.toLowerCase().includes(queryClean)) ||
              (item.name.fr && item.name.fr.toLowerCase().includes(queryClean));
            const descMatch =
              item.description &&
              (t(item.description).toLowerCase().includes(queryClean) ||
                (item.description.en &&
                  item.description.en.toLowerCase().includes(queryClean)) ||
                (item.description.fr &&
                  item.description.fr.toLowerCase().includes(queryClean)));
            return nameMatch || descMatch;
          }).length === 0 && (
            <div className="p-10 text-center space-y-3">
              <p className="text-xs font-semibold text-aperitivo-muted">
                {locale === 'it'
                  ? 'Nessun piatto trovato per "' + searchQuery + '"'
                  : locale === 'fr'
                  ? 'Aucun plat trouvé pour "' + searchQuery + '"'
                  : 'No dishes found for "' + searchQuery + '"'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-aperitivo-spritz hover:underline cursor-pointer"
              >
                {locale === 'it'
                  ? 'Mostra tutti i piatti'
                  : locale === 'fr'
                  ? 'Afficher tous les plats'
                  : 'Show all dishes'}
              </button>
            </div>
          )}
      </main>

      {/* Allergen Legend Bottom Sheet Modal */}
      <AllergenLegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
