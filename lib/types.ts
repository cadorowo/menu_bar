export type Locale = 'it' | 'en' | 'fr';

export interface LocalizedString {
  it: string;
  en?: string;
  fr?: string;
  [key: string]: string | undefined;
}

export type AllergenCode =
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soybeans'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'molluscs';

export interface Allergen {
  code: AllergenCode;
  icon: string;
  label: LocalizedString;
}

export interface Category {
  id: string;
  name: LocalizedString;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: LocalizedString;
  description?: LocalizedString;
  price: number;
  photo_url?: string | null;
  allergens: AllergenCode[];
  sold_out: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChangeLog {
  id: string;
  admin_user_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_SOLDOUT' | 'REORDER';
  entity_type: 'Category' | 'MenuItem';
  entity_id: string;
  diff?: any;
  created_at: string;
}
