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

  // Auto-scroll active tab into center of nav container
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategoryId]);

  const handleTabClick = (id: string) => {
    onSelectCategory(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(`category-${id}`);
    if (element) {
      const offset = 60;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="relative bg-[#FAF7F2] border-b border-aperitivo-border/50 py-1.5">
      <div
        ref={navRef}
        className="max-w-md mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 snap-x-container"
      >
        {/* 'All' Tab Option (Compact & Short) */}
        <button
          ref={activeCategoryId === 'all' ? activeTabRef : null}
          onClick={() => handleTabClick('all')}
          className={`snap-tab flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
            activeCategoryId === 'all'
              ? 'bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion text-white shadow-xs'
              : 'bg-white/90 text-stone-600 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
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
              className={`snap-tab flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-aperitivo-spritz to-aperitivo-vermilion text-white shadow-xs'
                  : 'bg-white/90 text-stone-600 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
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
