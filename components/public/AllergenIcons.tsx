'use client';

import React from 'react';
import Image from 'next/image';
import { AllergenCode } from '@/lib/types';
import { ALLERGEN_MAP } from '@/lib/allergens';

interface AllergenIconProps {
  code: AllergenCode;
  size?: number; // default 16
  className?: string;
  showLabel?: boolean;
}

export const ALLERGEN_IMAGE_MAP: Record<AllergenCode, string> = {
  gluten: '/allergens/GL.jpeg',
  crustaceans: '/allergens/CR.jpeg',
  eggs: '/allergens/UO.jpeg',
  fish: '/allergens/PE.jpeg',
  peanuts: '/allergens/AR.jpeg',
  soybeans: '/allergens/SO.jpeg',
  milk: '/allergens/LA.jpeg',
  nuts: '/allergens/FR.jpeg',
  celery: '/allergens/SE.jpeg',
  mustard: '/allergens/SN.jpeg',
  sesame: '/allergens/SS.jpeg',
  sulphites: '/allergens/SU.jpeg',
  lupin: '/allergens/LU.jpeg',
  molluscs: '/allergens/MO.jpeg',
};

export function AllergenSvgIcon({ code, size = 18 }: { code: AllergenCode; size?: number }) {
  const src = ALLERGEN_IMAGE_MAP[code];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={code}
      width={size}
      height={size}
      className="object-cover rounded-full inline-block flex-shrink-0"
      unoptimized
    />
  );
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
      <span className="flex-shrink-0 flex items-center justify-center">
        <AllergenSvgIcon code={code} size={16} />
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
