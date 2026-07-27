'use client';

import React, { useEffect, useRef } from 'react';
import { Category } from '@/lib/types';
import { useLocale } from '@/lib/i18n';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  const { t, locale } = useLocale();
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Bulletproof horizontal tab centering using viewport rects
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const nav = navRef.current;
      const tab = activeTabRef.current;

      const navRect = nav.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2;
      const navCenter = navRect.left + navRect.width / 2;
      const diff = tabCenter - navCenter;

      nav.scrollTo({
        left: nav.scrollLeft + diff,
        behavior: 'smooth',
      });
    }
  }, [activeCategoryId]);

  const handleTabClick = (id: string) => {
    onSelectCategory(id);
  };

  return (
    <nav className="relative w-full bg-[#FAF7F2] py-2.5">
      <div
        ref={navRef}
        className="max-w-md mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar px-3.5 snap-x-container"
      >
        {/* 'All' Tab Option */}
        <button
          ref={activeCategoryId === 'all' ? activeTabRef : null}
          onClick={() => handleTabClick('all')}
          className={`snap-tab flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-colors cursor-pointer ${
            activeCategoryId === 'all'
              ? 'bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion text-white shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
          }`}
        >
          {locale === 'it' ? 'Tutti' : locale === 'fr' ? 'Tous' : 'All'}
        </button>

        {/* Dynamic Category Tabs */}
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTabClick(cat.id)}
              className={`snap-tab flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
              }`}
            >
              {t(cat.name)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
