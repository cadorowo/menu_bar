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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-aperitivo-border/80 px-5 py-4.5 transition-all shadow-paper">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Restaurant Brand (Clean text without icon) */}
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-aperitivo-slate leading-tight">
            Menu Bar Franca
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold text-aperitivo-spritz tracking-widest uppercase flex items-center gap-1 mt-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Via Croix-de-Ville, 70 • Aosta</span>
          </p>
        </div>

        {/* Allergen Info Trigger */}
        <button
          onClick={onOpenAllergenModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-aperitivo-slate bg-white hover:bg-aperitivo-softGlow border border-aperitivo-border rounded-full shadow-2xs transition-all active:scale-95 group cursor-pointer"
          aria-label={locale === 'it' ? 'Legenda Allergeni EU' : 'EU Allergen Legend'}
        >
          <Info className="w-3.5 h-3.5 text-aperitivo-spritz group-hover:rotate-12 transition-transform" />
          <span>{locale === 'it' ? 'Allergeni' : 'Allergens'}</span>
        </button>
      </div>
    </header>
  );
}
