'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export function Footer() {
  const { locale, setLocale } = useLocale();
  const [showHours, setShowHours] = useState(false);

  return (
    <footer className="mt-14 bg-aperitivo-slate text-stone-300 pt-10 pb-12 px-5 border-t border-stone-800 font-sans">
      <div className="max-w-md mx-auto space-y-6 text-xs">
        {/* Brand & Address */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-aperitivo-spritz" />
            <h3 className="font-serif text-lg font-bold text-white tracking-tight">
              Bar Franca — Aosta
            </h3>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-aperitivo-spritz flex-shrink-0" />
            <span>Via Croix-de-Ville, 70, 11100 Aosta AO</span>
          </div>

          {/* Expandable Opening Hours */}
          <div className="pt-1">
            <button
              onClick={() => setShowHours(!showHours)}
              className="inline-flex items-center gap-2 text-stone-300 hover:text-white font-semibold text-xs py-1 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-aperitivo-spritz flex-shrink-0" />
              <span>
                {locale === 'it'
                  ? 'Orari di Apertura'
                  : locale === 'fr'
                  ? 'Heures d’ouverture'
                  : 'Opening Hours'}
              </span>
              {showHours ? (
                <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              )}
            </button>

            {/* Always visible summary preview (Pure White Text) */}
            {!showHours && (
              <p className="text-[11px] text-white pl-5 pt-0.5 font-medium">
                {locale === 'it'
                  ? 'Lun - Gio 06:30–22:30 | Ven - Sab 06:30–01:00 | Dom Chiuso'
                  : locale === 'fr'
                  ? 'Lun - Jeu 06:30–22:30 | Ven - Sam 06:30–01:00 | Dim Fermé'
                  : 'Mon - Thu 06:30–22:30 | Fri - Sat 06:30–01:00 | Sun Closed'}
              </p>
            )}

            {/* Detailed Hours List (All Text Pure White) */}
            {showHours && (
              <div className="mt-2.5 p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1.5 text-[11px] text-white animate-fadeIn">
                <div className="flex justify-between pb-1 border-b border-stone-800 font-bold text-white">
                  <span>{locale === 'it' ? 'Giorno' : locale === 'fr' ? 'Jour' : 'Day'}</span>
                  <span>{locale === 'it' ? 'Orario' : locale === 'fr' ? 'Heures' : 'Hours'}</span>
                </div>
                <div className="flex justify-between text-white font-medium">
                  <span>{locale === 'it' ? 'Lunedì' : locale === 'fr' ? 'Lundi' : 'Monday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 22:30</span>
                </div>
                <div className="flex justify-between text-white font-medium">
                  <span>{locale === 'it' ? 'Martedì' : locale === 'fr' ? 'Mardi' : 'Tuesday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 22:30</span>
                </div>
                <div className="flex justify-between text-white font-medium">
                  <span>{locale === 'it' ? 'Mercoledì' : locale === 'fr' ? 'Mercredi' : 'Wednesday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 22:30</span>
                </div>
                <div className="flex justify-between text-white font-medium">
                  <span>{locale === 'it' ? 'Giovedì' : locale === 'fr' ? 'Jeudi' : 'Thursday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 22:30</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>{locale === 'it' ? 'Venerdì' : locale === 'fr' ? 'Vendredi' : 'Friday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 01:00</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>{locale === 'it' ? 'Sabato' : locale === 'fr' ? 'Samedi' : 'Saturday'}</span>
                  <span className="font-mono text-white font-bold">06:30 – 01:00</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-stone-800">
                  <span>{locale === 'it' ? 'Domenica' : locale === 'fr' ? 'Dimanche' : 'Sunday'}</span>
                  <span className="text-white font-bold">{locale === 'it' ? 'Chiuso' : locale === 'fr' ? 'Fermé' : 'Closed'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Phone (Tap-to-call link ONLY) */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
          <a
            href="tel:+393341902702"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-800/90 hover:bg-stone-700 text-aperitivo-spritz font-bold rounded-xl transition-colors shadow-2xs text-xs"
          >
            <Phone className="w-4 h-4" />
            <span>+39 334 190 2702</span>
          </a>
        </div>

        {/* Fallback Language Toggle (IT | EN | FR) */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-stone-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {locale === 'it' ? 'Lingua:' : locale === 'fr' ? 'Langue:' : 'Language:'}
            </span>
          </div>
          <div className="flex items-center bg-stone-800/90 p-1 rounded-xl text-[11px] font-bold gap-1">
            <button
              onClick={() => setLocale('it')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                locale === 'it'
                  ? 'bg-aperitivo-spritz text-white shadow-2xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              IT
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                locale === 'en'
                  ? 'bg-aperitivo-spritz text-white shadow-2xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('fr')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                locale === 'fr'
                  ? 'bg-aperitivo-spritz text-white shadow-2xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-stone-500 pt-2">
          © {new Date().getFullYear()} Bar Franca Aosta. {locale === 'it' ? 'Tutti i diritti riservati.' : locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
