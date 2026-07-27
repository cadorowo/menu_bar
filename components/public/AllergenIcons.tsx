'use client';

import React from 'react';
import { AllergenCode } from '@/lib/types';
import { ALLERGEN_MAP } from '@/lib/allergens';

interface AllergenIconProps {
  code: AllergenCode;
  size?: number; // default 16
  className?: string;
  showLabel?: boolean;
}

export function AllergenSvgIcon({ code, size = 16 }: { code: AllergenCode; size?: number }) {
  switch (code) {
    case 'gluten':
      // Wheat Stalk
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M12 4c-2 1-3.5 3-3.5 5 2 0 3.5-1.5 3.5-5z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 4c2 1 3.5 3 3.5 5-2 0-3.5-1.5-3.5-5z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 9c-2.5 1-4 3.5-4 6 2.5 0 4-2 4-6z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 9c2.5 1 4 3.5 4 6-2.5 0-4-2-4-6z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'crustaceans':
      // Prawn / Shrimp
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10c0-4-3-7-7-7S4 6 4 10c0 3 2 5.5 5 6.5L7 20l3-1.5 2 1.5 2-1.5 3 1.5-2-3.5c3-1 5-3.5 5-6.5z" />
          <path d="M14 6a2 2 0 0 0-4 0" />
          <circle cx="8" cy="9" r="1" fill="currentColor" />
        </svg>
      );

    case 'eggs':
      // Egg / Fried Egg
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8 2 5 6 5 12c0 5 3.1 9 7 9s7-4 7-9c0-6-3-10-7-10z" />
          <circle cx="12" cy="13" r="3" fill="currentColor" fillOpacity="0.25" />
        </svg>
      );

    case 'fish':
      // Fish
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 12c4-6 11.5-6 15 0-3.5 6-11 6-15 0z" />
          <path d="M6.5 12L2 8v8l4.5-4z" />
          <circle cx="18" cy="11" r="1" fill="currentColor" />
        </svg>
      );

    case 'peanuts':
      // Peanut Shell
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 5a3.5 3.5 0 0 0-3.5 3.5c0 1.5.8 2.8 2 3.5-1.2.7-2 2-2 3.5A3.5 3.5 0 0 0 8 19c1.5 0 2.8-.8 3.5-2 .7 1.2 2 2 3.5 2a3.5 3.5 0 0 0 3.5-3.5c0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5A3.5 3.5 0 0 0 15 5c-1.5 0-2.8.8-3.5 2-.7-1.2-2-2-3.5-2z" />
        </svg>
      );

    case 'soybeans':
      // Soybean / Edamame Pod
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19C10 19 19 14 20 4c-10 0-15 9-16 15z" />
          <circle cx="9" cy="14" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="14" cy="9" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'milk':
      // Milk Bottle / Dairy Glass
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8v3H8z" />
          <path d="M7 5l-1 4v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9l-1-4H7z" />
          <path d="M6 12h12" />
        </svg>
      );

    case 'nuts':
      // Tree Nut / Acorn
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v3" />
          <path d="M6 8h12a1 1 0 0 1 1 1v1H5V9a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0.2" />
          <path d="M5 10c0 5 3.5 9.5 7 11 3.5-1.5 7-6 7-11H5z" />
        </svg>
      );

    case 'celery':
      // Celery Stalk / Leafy Plant
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V8" />
          <path d="M7 22V12c0-3 2-5 5-5s5 2 5 5v10" />
          <path d="M12 7C9 4 6 5 4 8c3 1 6 0 8-1z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 7c3-3 6-2 8 1-3 1-6 0-8-1z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'mustard':
      // Mustard Flower / Seed Drop
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5L7 11c0 3 2.5 6 5 6s5-3 5-6l-5-8.5z" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" />
          <path d="M8 20.5h8" />
        </svg>
      );

    case 'sesame':
      // Sesame Seeds
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="8" ry="9" />
          <path d="M10 9c0-1 1-2 2-2s2 1 2 2-1 2.5-2 3.5L10 9z" fill="currentColor" />
          <path d="M14 15c0-1 1-2 2-2s2 1 2 2-1 2.5-2 3.5L14 15z" fill="currentColor" />
          <path d="M7 14c0-1 1-2 2-2s2 1 2 2-1 2.5-2 3.5L7 14z" fill="currentColor" />
        </svg>
      );

    case 'sulphites':
      // Wine Glass with Sulphites SO2
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 22h8" />
          <path d="M12 15v7" />
          <path d="M6 3h12l-1 6a5 5 0 0 1-10 0L6 3z" />
          <path d="M6.5 8h11" />
        </svg>
      );

    case 'lupin':
      // Lupin Flower Spike
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V4" />
          <circle cx="12" cy="5" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="9" cy="9" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="15" cy="9" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="8" cy="14" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16" cy="14" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'molluscs':
      // Seashell / Clam
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 0 0-9 9c0 4 3 7 8 8l1 1 1-1c5-1 8-4 8-8a9 9 0 0 0-9-9z" />
          <path d="M12 3v17" />
          <path d="M12 3c-3 4-5 8-5 13" />
          <path d="M12 3c3 4 5 8 5 13" />
        </svg>
      );

    default:
      return null;
  }
}

export function AllergenPillBadge({
  code,
  showLabel = false,
  className = '',
}: AllergenIconProps) {
  const allergen = ALLERGEN_MAP[code];
  if (!allergen) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-aperitivo-border text-aperitivo-slate shadow-2xs text-[11px] font-semibold transition-all hover:border-aperitivo-spritz/50 ${className}`}
      title={allergen.label.it}
    >
      <span className="text-aperitivo-spritz flex-shrink-0 flex items-center justify-center">
        <AllergenSvgIcon code={code} size={14} />
      </span>
      {showLabel ? (
        <span className="truncate">{allergen.label.it.split(' ')[0]}</span>
      ) : (
        <span className="font-mono text-[10px] uppercase font-bold text-stone-600">
          {code.substring(0, 2)}
        </span>
      )}
    </div>
  );
}
