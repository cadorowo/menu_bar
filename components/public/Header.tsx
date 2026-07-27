'use client';

import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

interface HeaderProps {
  onOpenAllergenModal: () => void;
}

export function Header({ onOpenAllergenModal }: HeaderProps) {
  const { locale } = useLocale();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-aperitivo-border/80 px-4 sm:px-5 py-4 transition-all shadow-paper">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Restaurant Brand without icon */}
        <div>
          <h1 className="font-serif text-xl font-extrabold tracking-tight text-aperitivo-slate leading-none">
            Menu Bar Franca
          </h1>
          <p className="text-[10px] font-semibold text-aperitivo-spritz tracking-widest uppercase flex items-center gap-1 mt-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Via Croix-de-Ville, 70 • Aosta</span>
          </p>
        </div>

        {/* Allergen Info Trigger */}
        <button
          onClick={onOpenAllergenModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-aperitivo-slate bg-white hover:bg-aperitivo-softGlow border border-aperitivo-border rounded-full shadow-2xs transition-all active:scale-95 group cursor-pointer"
          aria-label={locale === 'it' ? 'Legenda Allergeni EU' : 'EU Allergen Legend'}
        >
          <Info className="w-3.5 h-3.5 text-aperitivo-spritz group-hover:rotate-12 transition-transform" />
          <span>{locale === 'it' ? 'Allergeni' : locale === 'fr' ? 'Allergènes' : 'Allergens'}</span>
        </button>
      </div>
    </header>
  );
}
