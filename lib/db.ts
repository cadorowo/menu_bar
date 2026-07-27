import { Category, MenuItem, ChangeLog } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: { it: 'Caffetteria & Colazione', en: 'Coffee & Breakfast', fr: 'Cafétéria & Petit-déjeuner' },
    sort_order: 1,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: { it: 'Aperitivi & Cocktails', en: 'Aperitifs & Cocktails', fr: 'Apéritifs & Cocktails' },
    sort_order: 2,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: { it: "Vini della Valle d'Aosta", en: 'Aosta Valley Wines', fr: "Vins de la Vallée d'Aoste" },
    sort_order: 3,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: { it: "Taglieri & Panini Valdostani", en: 'Valdostan Boards & Sandwiches', fr: "Planches & Sandwichs Valdôtains" },
    sort_order: 4,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    name: { it: 'Dolci della Casa', en: 'Homemade Desserts', fr: 'Desserts Maison' },
    sort_order: 5,
    active: true,
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: { it: 'Genepì Spritz Valdostano', en: 'Valdostan Genepì Spritz', fr: 'Spritz au Génépy Valdôtain' },
    description: {
      it: 'Liquore tipico al Genepì delle Alpi, Prosecco DOC, seltz e scorza di limone.',
      en: 'Traditional Alpine Genepì liqueur, Prosecco DOC, soda and lemon peel.',
      fr: 'Liqueur typique de Génépy des Alpes, Prosecco DOC, eau gazeuse et zeste de citron.',
    },
    price: 7.00,
    photo_url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=400&q=80',
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: { it: 'Aperol Spritz Classico', en: 'Classic Aperol Spritz', fr: 'Aperol Spritz Classique' },
    description: {
      it: "Prosecco DOC, Aperol, seltz, fetta d'arancia fresca e oliva verde.",
      en: 'Prosecco DOC, Aperol, soda, fresh orange slice and green olive.',
      fr: "Prosecco DOC, Aperol, eau gazeuse, tranche d'orange fraîche et olive verte.",
    },
    price: 6.50,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b33',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: { it: "Torrette Valle d'Aosta DOC (Calice)", en: 'Torrette Aosta Valley DOC (Glass)', fr: "Torrette Vallée d'Aoste DOC (Verre)" },
    description: {
      it: 'Vino rosso autoctono valdostano, corpo armonico con note di mandorla e piccoli frutti rossi.',
      en: 'Native Aosta Valley red wine, harmonious body with almond and red berry notes.',
      fr: "Vin rouge autochtone valdôtain, corps harmonieux aux notes d'amande et de fruits rouges.",
    },
    price: 5.50,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b44',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: { it: 'Blanc de Morgex et de La Salle DOC', en: 'Blanc de Morgex et de La Salle DOC', fr: 'Blanc de Morgex et de La Salle DOC' },
    description: {
      it: 'Vino bianco da vitigni ad alta quota, fresco, minerale e profumato.',
      en: 'High-altitude white wine, fresh, mineral and aromatic.',
      fr: "Vin blanc de cépage d'altitude, frais, minéral et aromatique.",
    },
    price: 6.00,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b55',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: { it: "Tagliere Valdostano con Fontina DOP & Mocetta", en: 'Valdostan Board with Fontina DOP & Mocetta', fr: "Planche Valdôtaine avec Fontina AOP & Mocetta" },
    description: {
      it: "Fontina d'alpeggio DOP, Mocetta di bovino, Lardo d'Arnad DOP e pane nero di segale.",
      en: 'Alpine Fontina DOP cheese, beef Mocetta, Arnad Lard DOP and rye black bread.',
      fr: "Fromage Fontina d'alpage AOP, Mocetta de bœuf, Lard d'Arnad AOP et pain noir de seigle.",
    },
    price: 14.00,
    photo_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
    allergens: ['gluten', 'milk', 'sulphites'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b66',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: { it: "Crostone al Lardo d'Arnad DOP & Miele di Castagno", en: 'Arnad Lard & Chestnut Honey Toast', fr: "Tartine au Lard d'Arnad AOP & Miel de Châtaignier" },
    description: {
      it: "Pane di segale caldo tostato con Lardo d'Arnad DOP fondente e miele biologico di castagno.",
      en: 'Warm toasted rye bread with melting Arnad Lard DOP and organic chestnut honey.',
      fr: "Pain de seigle chaud grillé au Lard d'Arnad AOP fondant et miel de châtaignier bio.",
    },
    price: 7.50,
    photo_url: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=400&q=80',
    allergens: ['gluten'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b77',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: { it: "Panino con Jambon de Bosses DOP & Fontina", en: 'Jambon de Bosses DOP & Fontina Sandwich', fr: "Sandwich au Jambon de Bosses AOP & Fontina" },
    description: {
      it: "Prosciutto crudo stagionato Jambon de Bosses DOP delle Alpi e Fontina fusa.",
      en: 'Cured Alpine Jambon de Bosses DOP ham and melted Fontina cheese.',
      fr: "Jambon cru affiné Jambon de Bosses AOP des Alpes et Fontina fondue.",
    },
    price: 6.50,
    photo_url: null,
    allergens: ['gluten', 'milk'],
    sold_out: false,
    sort_order: 3,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b88',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: { it: 'Caffè Espresso Valdostano', en: 'Valdostan Espresso Coffee', fr: 'Café Espresso Valdôtain' },
    description: {
      it: 'Miscela arabica intensa servita bollente.',
      en: 'Rich intense arabica espresso coffee.',
      fr: "Mélange d'arabica intense servi très chaud.",
    },
    price: 1.30,
    photo_url: null,
    allergens: [],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b99',
    category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    name: { it: 'Tegole Valdostane Artigianali con Gelato', en: 'Artisanal Valdostan Tegole with Ice Cream', fr: 'Tegole Valdôtaines Artisanales avec Glace' },
    description: {
      it: 'Biscotti tradizionali alle nocciole serviti con gelato alla vaniglia.',
      en: 'Traditional hazelnut wafer biscuits served with vanilla ice cream.',
      fr: 'Biscuits traditionnels aux noisettes servis avec une glace à la vanille.',
    },
    price: 5.00,
    photo_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
    allergens: ['gluten', 'eggs', 'milk', 'nuts'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
];

export const INITIAL_CHANGELOGS: ChangeLog[] = [];

const STORAGE_KEYS = {
  CATEGORIES: 'bar_franca_categories_v4',
  ITEMS: 'bar_franca_items_v4',
  CHANGELOGS: 'bar_franca_changelogs_v4',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: map raw Supabase row → Category
// ─────────────────────────────────────────────────────────────────────────────
function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name:
      typeof row.name === 'string'
        ? JSON.parse(row.name)
        : (row.name as Category['name']),
    sort_order: Number(row.sort_order) || 1,
    active: row.active !== undefined ? Boolean(row.active) : true,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: map raw Supabase row → MenuItem
// ─────────────────────────────────────────────────────────────────────────────
function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.id),
    category_id: String(row.category_id),
    name:
      typeof row.name === 'string'
        ? JSON.parse(row.name)
        : (row.name as MenuItem['name']),
    description: row.description
      ? typeof row.description === 'string'
        ? JSON.parse(row.description)
        : (row.description as MenuItem['description'])
      : undefined,
    price: Number(row.price) || 0,
    photo_url: (row.photo_url as string | null) || null,
    allergens: Array.isArray(row.allergens)
      ? (row.allergens as MenuItem['allergens'])
      : [],
    sold_out: Boolean(row.sold_out),
    sort_order: Number(row.sort_order) || 1,
    active: row.active !== undefined ? Boolean(row.active) : true,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Store — the single source of truth for all data operations
// ─────────────────────────────────────────────────────────────────────────────
export class Store {
  // ── localStorage read helpers (used as offline fallback) ──────────────────

  static getCategories(): Category[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  static getMenuItems(): MenuItem[] {
    if (typeof window === 'undefined') return INITIAL_MENU_ITEMS;
    const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  }

  // ── Supabase fetch (reads authoritative data from DB) ────────────────────

  /**
   * Fetches ALL categories from Supabase (including inactive ones for admin).
   * Falls back to localStorage if Supabase is not configured or returns an error.
   */
  static async fetchCategoriesFromSupabase(adminMode = false): Promise<Category[]> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getCategories();
    }
    try {
      let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Supabase fetchCategories error:', error.message);
        return this.getCategories();
      }
      if (!data || data.length === 0) {
        return this.getCategories();
      }
      const mapped = (data as Record<string, unknown>[]).map(mapCategory);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mapped));
      }
      return mapped;
    } catch (err) {
      console.error('Supabase fetchCategories exception:', err);
      return this.getCategories();
    }
  }

  /**
   * Fetches ALL menu items from Supabase (including inactive ones for admin).
   * Falls back to localStorage if Supabase is not configured or returns an error.
   */
  static async fetchMenuItemsFromSupabase(adminMode = false): Promise<MenuItem[]> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getMenuItems();
    }
    try {
      let query = supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Supabase fetchMenuItems error:', error.message);
        return this.getMenuItems();
      }
      if (!data || data.length === 0) {
        return this.getMenuItems();
      }
      const mapped = (data as Record<string, unknown>[]).map(mapMenuItem);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(mapped));
      }
      return mapped;
    } catch (err) {
      console.error('Supabase fetchMenuItems exception:', err);
      return this.getMenuItems();
    }
  }

  // ── Supabase write (upsert/delete a single item) ─────────────────────────

  /**
   * Upserts a single category to Supabase AND updates localStorage cache.
   * Returns null on success, or an error message string on failure.
   */
  static async upsertCategory(category: Category): Promise<string | null> {
    // Always update local cache immediately
    const current = this.getCategories();
    const exists = current.find((c) => c.id === category.id);
    const updated = exists
      ? current.map((c) => (c.id === category.id ? category : c))
      : [...current, category];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    }

    if (!supabase || !isSupabaseConfigured) return null;

    const { error } = await supabase.from('categories').upsert(
      {
        id: category.id,
        name: category.name,
        sort_order: category.sort_order,
        active: category.active,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase upsertCategory error:', error.message);
      return error.message;
    }
    return null;
  }

  /**
   * Upserts multiple categories at once (for reordering).
   * Returns null on success, or an error message string on failure.
   */
  static async upsertCategories(categories: Category[]): Promise<string | null> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    if (!supabase || !isSupabaseConfigured) return null;

    const { error } = await supabase.from('categories').upsert(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        sort_order: cat.sort_order,
        active: cat.active,
      })),
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase upsertCategories error:', error.message);
      return error.message;
    }
    return null;
  }

  /**
   * Deletes a single category from Supabase AND removes from localStorage cache.
   * Returns null on success, or an error message string on failure.
   */
  static async deleteCategory(id: string): Promise<string | null> {
    const current = this.getCategories();
    const updated = current.filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    }

    if (!supabase || !isSupabaseConfigured) return null;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      console.error('Supabase deleteCategory error:', error.message);
      return error.message;
    }
    return null;
  }

  /**
   * Upserts a single menu item to Supabase AND updates localStorage cache.
   * Returns null on success, or an error message string on failure.
   */
  static async upsertMenuItem(item: MenuItem): Promise<string | null> {
    // Always update local cache immediately
    const current = this.getMenuItems();
    const exists = current.find((i) => i.id === item.id);
    const updated = exists
      ? current.map((i) => (i.id === item.id ? item : i))
      : [...current, item];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
    }

    if (!supabase || !isSupabaseConfigured) return null;

    const { error } = await supabase.from('menu_items').upsert(
      {
        id: item.id,
        category_id: item.category_id,
        name: item.name,
        description: item.description ?? null,
        price: item.price,
        photo_url: item.photo_url ?? null,
        allergens: item.allergens,
        sold_out: item.sold_out,
        sort_order: item.sort_order,
        active: item.active,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase upsertMenuItem error:', error.message);
      return error.message;
    }
    return null;
  }

  /**
   * Deletes a single menu item from Supabase AND removes from localStorage cache.
   * Returns null on success, or an error message string on failure.
   */
  static async deleteMenuItem(id: string): Promise<string | null> {
    const current = this.getMenuItems();
    const updated = current.filter((i) => i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
    }

    if (!supabase || !isSupabaseConfigured) return null;

    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (error) {
      console.error('Supabase deleteMenuItem error:', error.message);
      return error.message;
    }
    return null;
  }

  // ── Legacy bulk-save (kept for compatibility, now delegates to upsert) ────

  /** @deprecated Use upsertCategory / upsertCategories instead */
  static saveCategories(categories: Category[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    if (supabase && isSupabaseConfigured) {
      supabase
        .from('categories')
        .upsert(
          categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order,
            active: cat.active,
          })),
          { onConflict: 'id' }
        )
        .then(({ error }) => {
          if (error) console.warn('Supabase saveCategories error:', error.message);
        });
    }
  }

  /** @deprecated Use upsertMenuItem instead */
  static saveMenuItems(items: MenuItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    }
    if (supabase && isSupabaseConfigured) {
      supabase
        .from('menu_items')
        .upsert(
          items.map((item) => ({
            id: item.id,
            category_id: item.category_id,
            name: item.name,
            description: item.description ?? null,
            price: item.price,
            photo_url: item.photo_url ?? null,
            allergens: item.allergens,
            sold_out: item.sold_out,
            sort_order: item.sort_order,
            active: item.active,
          })),
          { onConflict: 'id' }
        )
        .then(({ error }) => {
          if (error) console.warn('Supabase saveMenuItems error:', error.message);
        });
    }
  }

  // ── Change Log ──────────────────────────────────────────────────────────

  static getChangeLogs(): ChangeLog[] {
    if (typeof window === 'undefined') return INITIAL_CHANGELOGS;
    const stored = localStorage.getItem(STORAGE_KEYS.CHANGELOGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CHANGELOGS, JSON.stringify(INITIAL_CHANGELOGS));
      return INITIAL_CHANGELOGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CHANGELOGS;
    }
  }

  static addChangeLog(log: Omit<ChangeLog, 'id' | 'created_at'>) {
    const logs = this.getChangeLogs();
    const newLog: ChangeLog = {
      ...log,
      id: crypto.randomUUID ? crypto.randomUUID() : 'log-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newLog, ...logs].slice(0, 100); // keep last 100 entries
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CHANGELOGS, JSON.stringify(updated));
    }
    return newLog;
  }
}