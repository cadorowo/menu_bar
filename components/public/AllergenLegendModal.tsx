'use client';

import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { ALLERGENS } from '@/lib/allergens';
import { useLocale } from '@/lib/i18n';
import { AllergenSvgIcon } from '@/components/public/AllergenIcons';

interface AllergenLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllergenLegendModal({
  isOpen,
  onClose,
}: AllergenLegendModalProps) {
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-aperitivo-slate/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn font-sans">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-aperitivo-linen rounded-t-3xl sm:rounded-3xl shadow-paper-lg flex flex-col overflow-hidden z-10 border border-aperitivo-border">
        {/* Header */}
        <div className="sticky top-0 bg-aperitivo-linen border-b border-aperitivo-border px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-100 text-aperitivo-spritz">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-aperitivo-slate">
              {locale === 'it'
                ? 'Legenda Allergeni (Reg. UE 1169/2011)'
                : locale === 'fr'
                ? 'Légende des allergènes (Règ. UE 1169/2011)'
                : 'Allergen Legend (EU Reg. 1169/2011)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-aperitivo-slate leading-relaxed bg-white border border-aperitivo-border p-3.5 rounded-xl shadow-2xs font-medium">
            {locale === 'it'
              ? 'I nostri piatti possono contenere uno o più dei 14 allergeni principali regolamentati nell’Unione Europea:'
              : locale === 'fr'
              ? 'Nos plats peuvent contenir un ou plusieurs des 14 allergènes principaux réglementés dans l’Union Européenne :'
              : 'Our dishes may contain one or more of the 14 mandatory EU regulated allergens:'}
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {ALLERGENS.map((allergen) => (
              <div
                key={allergen.code}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-aperitivo-border/80 shadow-2xs hover:border-aperitivo-spritz/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-aperitivo-softGlow border border-aperitivo-spritz/30 text-aperitivo-spritz flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <AllergenSvgIcon code={allergen.code} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-aperitivo-slate capitalize">
                      {t(allergen.label)}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                      ({allergen.code})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-aperitivo-border bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-aperitivo-slate hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {locale === 'it' ? 'Chiudi Legenda' : locale === 'fr' ? 'Fermer la légende' : 'Close Legend'}
          </button>
        </div>
      </div>
    </div>
  );
}
