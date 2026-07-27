'use client';

import React from 'react';
import { Info, Sparkles, Coffee } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

interface HeaderProps {
  onOpenAllergenModal: () => void;
}

export function Header({ onOpenAllergenModal }: HeaderProps) {
  const { locale } = useLocale();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-aperitivo-border/80 px-4 py-3.5 transition-all shadow-paper">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Restaurant Studio Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-aperitivo-spritz to-aperitivo-campari flex items-center justify-center text-white shadow-md shadow-aperitivo-spritz/25">
            <Coffee className="w-5 h-5 text-white/95" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-aperitivo-slate leading-tight">
              Bar Franca
            </h1>
            <p className="text-[10px] font-semibold text-aperitivo-spritz tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Via Croix-de-Ville, 70 • Aosta</span>
            </p>
          </div>
        </div>

        {/* Allergen Info Trigger */}
        <button
          onClick={onOpenAllergenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-aperitivo-slate bg-white hover:bg-aperitivo-softGlow border border-aperitivo-border rounded-full shadow-2xs transition-all active:scale-95 group"
          aria-label={locale === 'it' ? 'Legenda Allergeni EU' : 'EU Allergen Legend'}
        >
          <Info className="w-3.5 h-3.5 text-aperitivo-spritz group-hover:rotate-12 transition-transform" />
          <span>{locale === 'it' ? 'Allergeni' : 'Allergens'}</span>
        </button>
      </div>
    </header>
  );
}
