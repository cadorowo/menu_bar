import { Allergen, AllergenCode } from './types';

export const ALLERGENS: Allergen[] = [
  {
    code: 'gluten',
    icon: 'Wheat',
    label: {
      it: 'Glutine (frumento, segale, orzo, avena)',
      en: 'Gluten (wheat, rye, barley, oats)',
      fr: 'Gluten (blé, seigle, orge, avoine)',
    },
  },
  {
    code: 'crustaceans',
    icon: 'Shrimp',
    label: {
      it: 'Crostacei e prodotti a base di crostacei',
      en: 'Crustaceans and crustacean products',
      fr: 'Crustacés et produits à base de crustacés',
    },
  },
  {
    code: 'eggs',
    icon: 'Egg',
    label: {
      it: 'Uova e prodotti a base di uova',
      en: 'Eggs and egg products',
      fr: 'Œufs et produits à base d’œufs',
    },
  },
  {
    code: 'fish',
    icon: 'Fish',
    label: {
      it: 'Pesce e prodotti a base di pesce',
      en: 'Fish and fish products',
      fr: 'Poissons et produits à base de poisson',
    },
  },
  {
    code: 'peanuts',
    icon: 'Nut',
    label: {
      it: 'Arachidi e prodotti a base di arachidi',
      en: 'Peanuts and peanut products',
      fr: 'Arachides et produits à base d’arachides',
    },
  },
  {
    code: 'soybeans',
    icon: 'Bean',
    label: {
      it: 'Soia e prodotti a base di soia',
      en: 'Soybeans and soybean products',
      fr: 'Soja et produits à base de soja',
    },
  },
  {
    code: 'milk',
    icon: 'Milk',
    label: {
      it: 'Latte e prodotti a base di latte (incluso lattosio)',
      en: 'Milk and dairy products (including lactose)',
      fr: 'Lait et produits à base de lait (y compris le lactose)',
    },
  },
  {
    code: 'nuts',
    icon: 'TreeNut',
    label: {
      it: 'Frutta a guscio (mandorle, nocciole, noci, pistacchi)',
      en: 'Tree nuts (almonds, hazelnuts, walnuts, pistachios)',
      fr: 'Fruits à coque (amandes, noisettes, noix, pistaches)',
    },
  },
  {
    code: 'celery',
    icon: 'Carrot',
    label: {
      it: 'Sedano e prodotti a base di sedano',
      en: 'Celery and celery products',
      fr: 'Céleri et produits à base de céleri',
    },
  },
  {
    code: 'mustard',
    icon: 'Flame',
    label: {
      it: 'Senape e prodotti a base di senape',
      en: 'Mustard and mustard products',
      fr: 'Moutarde et produits à base de moutarde',
    },
  },
  {
    code: 'sesame',
    icon: 'CircleDot',
    label: {
      it: 'Semi di sesamo e prodotti a base di sesamo',
      en: 'Sesame seeds and sesame products',
      fr: 'Graines de sésame et produits à base de sésame',
    },
  },
  {
    code: 'sulphites',
    icon: 'Wine',
    label: {
      it: 'Anidride solforosa e solfiti (>10 mg/kg o 10 mg/l)',
      en: 'Sulphur dioxide and sulphites (>10 mg/kg or 10 mg/l)',
      fr: 'Anhydride sulfureux et sulfites (>10 mg/kg ou 10 mg/l)',
    },
  },
  {
    code: 'lupin',
    icon: 'Flower',
    label: {
      it: 'Lupini e prodotti a base di lupini',
      en: 'Lupin and lupin products',
      fr: 'Lupin et produits à base de lupin',
    },
  },
  {
    code: 'molluscs',
    icon: 'Shell',
    label: {
      it: 'Molluschi e prodotti a base di molluschi',
      en: 'Molluscs and mollusc products',
      fr: 'Mollusques et produits à base de mollusques',
    },
  },
];

export const ALLERGEN_MAP: Record<AllergenCode, Allergen> = ALLERGENS.reduce(
  (acc, allergen) => {
    acc[allergen.code] = allergen;
    return acc;
  },
  {} as Record<AllergenCode, Allergen>
);

export function getAllergen(code: AllergenCode): Allergen | undefined {
  return ALLERGEN_MAP[code];
}
