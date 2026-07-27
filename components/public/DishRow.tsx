'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { MenuItem, AllergenCode } from '@/lib/types';
import { useLocale } from '@/lib/i18n';
import { ALLERGEN_MAP } from '@/lib/allergens';
import { AllergenSvgIcon } from '@/components/public/AllergenIcons';

interface DishRowProps {
  item: MenuItem;
}

function AllergenPill({ code }: { code: AllergenCode }) {
  const { t } = useLocale();
  const allergen = ALLERGEN_MAP[code];
  if (!allergen) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-aperitivo-linen border border-aperitivo-border text-aperitivo-slate text-[10px] font-bold tracking-tight uppercase hover:bg-amber-100/60 transition-colors"
      title={t(allergen.label)}
    >
      <span className="text-aperitivo-spritz flex items-center">
        <AllergenSvgIcon code={code} size={12} />
      </span>
      <span>{code.substring(0, 2)}</span>
    </span>
  );
}

export function DishRow({ item }: DishRowProps) {
  const { t, locale } = useLocale();
  const [expanded, setExpanded] = useState(false);

  const nameText = t(item.name);
  const descriptionText = t(item.description);

  return (
    <article
      onClick={() => !item.sold_out && setExpanded((prev) => !prev)}
      className={`relative mx-4 my-2.5 bg-white border border-aperitivo-border/80 rounded-xl p-3.5 shadow-paper transition-all duration-200 ${
        item.sold_out
          ? 'opacity-60 bg-stone-100/60 cursor-not-allowed border-dashed'
          : 'cursor-pointer hover:border-aperitivo-spritz/40 hover:shadow-paper-lg active:scale-[0.99]'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Optional Thumbnail Photo */}
        {item.photo_url && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-aperitivo-border shadow-2xs bg-aperitivo-linen">
            <Image
              src={item.photo_url}
              alt={nameText}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          </div>
        )}

        {/* Text & Content Block */}
        <div className="flex-1 min-w-0">
          {/* Line 1: Dish Name + Price */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-bold text-aperitivo-slate leading-snug truncate">
              {nameText}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {item.sold_out ? (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-aperitivo-campari bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  {locale === 'it' ? 'Esaurito' : locale === 'fr' ? 'Épuisé' : 'Sold Out'}
                </span>
              ) : (
                <span className="font-serif text-sm font-bold text-aperitivo-spritz tracking-tight">
                  € {item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Line 2: Allergen Badges & Accordion Indicator */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 flex-wrap">
              {item.allergens && item.allergens.length > 0 ? (
                item.allergens.map((allergen) => (
                  <AllergenPill key={allergen} code={allergen} />
                ))
              ) : (
                <span className="text-[10px] text-stone-400 italic">
                  {locale === 'it'
                    ? 'Senza allergeni noti'
                    : locale === 'fr'
                    ? 'Sans allergènes connus'
                    : 'No known allergens'}
                </span>
              )}
            </div>

            {descriptionText && !item.sold_out && (
              <span className="text-stone-400 p-0.5 ml-2">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expanded ? 'rotate-180 text-aperitivo-spritz' : ''
                  }`}
                />
              </span>
            )}
          </div>

          {/* Expanded Description Accordion */}
          {expanded && descriptionText && !item.sold_out && (
            <div className="mt-2.5 pt-2 border-t border-aperitivo-border/60 text-xs leading-relaxed text-aperitivo-muted font-normal">
              <p>{descriptionText}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
