'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Track window scroll to compress filter bar when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pure horizontal container auto-scroll (NO vertical window jump/shift)
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const nav = navRef.current;
      const tab = activeTabRef.current;
      const navWidth = nav.clientWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.clientWidth;

      const targetLeft = tabLeft - navWidth / 2 + tabWidth / 2;
      nav.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  }, [activeCategoryId]);

  const handleTabClick = (id: string) => {
    onSelectCategory(id);
    // Bring user smoothly to top of the menu when selecting any category tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`sticky top-[56px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-aperitivo-border/50 transition-all duration-300 ${
        isScrolled ? 'py-1 shadow-md' : 'py-2 shadow-2xs'
      }`}
    >
      <div
        ref={navRef}
        className={`max-w-md mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3.5 snap-x-container transition-all duration-300`}
      >
        {/* 'All' Tab Option */}
        <button
          ref={activeCategoryId === 'all' ? activeTabRef : null}
          onClick={() => handleTabClick('all')}
          className={`snap-tab flex-shrink-0 rounded-full font-bold tracking-tight whitespace-nowrap transition-all duration-300 cursor-pointer ${
            isScrolled ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'
          } ${
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
              className={`snap-tab flex-shrink-0 rounded-full font-bold tracking-tight whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isScrolled ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'
              } ${
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
