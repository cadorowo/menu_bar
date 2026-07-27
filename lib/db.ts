import { Category, MenuItem, ChangeLog } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: { it: 'Caffetteria & Colazione', en: 'Coffee & Breakfast', fr: 'Cafétéria & Petit-déjeuner' },
    sort_order: 1,
    active: true,
  },
  {
    id: 'cat-2',
    name: { it: 'Aperitivi & Cocktails', en: 'Aperitifs & Cocktails', fr: 'Apéritifs & Cocktails' },
    sort_order: 2,
    active: true,
  },
  {
    id: 'cat-3',
    name: { it: 'Vini della Valle d’Aosta', en: 'Aosta Valley Wines', fr: 'Vins de la Vallée d’Aoste' },
    sort_order: 3,
    active: true,
  },
  {
    id: 'cat-4',
    name: { it: 'Taglieri & Panini Valdostani', en: 'Valdostan Boards & Sandwiches', fr: 'Planches & Sandwichs Valdôtains' },
    sort_order: 4,
    active: true,
  },
  {
    id: 'cat-5',
    name: { it: 'Dolci della Casa', en: 'Homemade Desserts', fr: 'Desserts Maison' },
    sort_order: 5,
    active: true,
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    category_id: 'cat-2',
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
    id: 'item-2',
    category_id: 'cat-2',
    name: { it: 'Aperol Spritz Classico', en: 'Classic Aperol Spritz', fr: 'Aperol Spritz Classique' },
    description: {
      it: 'Prosecco DOC, Aperol, seltz, fetta d’arancia fresca e oliva verde.',
      en: 'Prosecco DOC, Aperol, soda, fresh orange slice and green olive.',
      fr: 'Prosecco DOC, Aperol, eau gazeuse, tranche d’orange fraîche et olive verte.',
    },
    price: 6.50,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'item-3',
    category_id: 'cat-3',
    name: { it: 'Torrette Valle d’Aosta DOC (Calice)', en: 'Torrette Aosta Valley DOC (Glass)', fr: 'Torrette Vallée d’Aoste DOC (Verre)' },
    description: {
      it: 'Vino rosso autoctono valdostano, corpo armonico con note di mandorla e piccoli frutti rossi.',
      en: 'Native Aosta Valley red wine, harmonious body with almond and red berry notes.',
      fr: 'Vin rouge autochtone valdôtain, corps harmonieux aux notes d’amande et de fruits rouges.',
    },
    price: 5.50,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'item-4',
    category_id: 'cat-3',
    name: { it: 'Blanc de Morgex et de La Salle DOC', en: 'Blanc de Morgex et de La Salle DOC', fr: 'Blanc de Morgex et de La Salle DOC' },
    description: {
      it: 'Vino bianco da vitigni ad alta quota, fresco, minerale e profumato.',
      en: 'High-altitude white wine, fresh, mineral and aromatic.',
      fr: 'Vin blanc de cépage d’altitude, frais, minéral et aromatique.',
    },
    price: 6.00,
    photo_url: null,
    allergens: ['sulphites'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'item-5',
    category_id: 'cat-4',
    name: { it: 'Tagliere Valdostano con Fontina DOP & Mocetta', en: 'Valdostan Board with Fontina DOP & Mocetta', fr: 'Planche Valdôtaine avec Fontina AOP & Mocetta' },
    description: {
      it: 'Fontina d’alpeggio DOP, Mocetta di bovino, Lardo d’Arnad DOP e pane nero di segale.',
      en: 'Alpine Fontina DOP cheese, beef Mocetta, Arnad Lard DOP and rye black bread.',
      fr: 'Fromage Fontina d’alpage AOP, Mocetta de bœuf, Lard d’Arnad AOP et pain noir de seigle.',
    },
    price: 14.00,
    photo_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
    allergens: ['gluten', 'milk', 'sulphites'],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'item-6',
    category_id: 'cat-4',
    name: { it: 'Crostone al Lardo d’Arnad DOP & Miele di Castagno', en: 'Arnad Lard & Chestnut Honey Toast', fr: 'Tartine au Lard d’Arnad AOP & Miel de Châtaignier' },
    description: {
      it: 'Pane di segale caldo tostato con Lardo d’Arnad DOP fondente e miele biologico di castagno.',
      en: 'Warm toasted rye bread with melting Arnad Lard DOP and organic chestnut honey.',
      fr: 'Pain de seigle chaud grillé au Lard d’Arnad AOP fondant et miel de châtaignier bio.',
    },
    price: 7.50,
    photo_url: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=400&q=80',
    allergens: ['gluten'],
    sold_out: false,
    sort_order: 2,
    active: true,
  },
  {
    id: 'item-7',
    category_id: 'cat-4',
    name: { it: 'Panino con Jambon de Bosses DOP & Fontina', en: 'Jambon de Bosses DOP & Fontina Sandwich', fr: 'Sandwich au Jambon de Bosses AOP & Fontina' },
    description: {
      it: 'Prosciutto crudo stagionato Jambon de Bosses DOP delle Alpi e Fontina fusa.',
      en: 'Cured Alpine Jambon de Bosses DOP ham and melted Fontina cheese.',
      fr: 'Jambon cru affiné Jambon de Bosses AOP des Alpes et Fontina fondue.',
    },
    price: 6.50,
    photo_url: null,
    allergens: ['gluten', 'milk'],
    sold_out: false,
    sort_order: 3,
    active: true,
  },
  {
    id: 'item-8',
    category_id: 'cat-1',
    name: { it: 'Caffè Espresso Valdostano', en: 'Valdostan Espresso Coffee', fr: 'Café Espresso Valdôtain' },
    description: {
      it: 'Miscela arabica intensa servita bollente.',
      en: 'Rich intense arabica espresso coffee.',
      fr: 'Mélange d’arabica intense servi très chaud.',
    },
    price: 1.30,
    photo_url: null,
    allergens: [],
    sold_out: false,
    sort_order: 1,
    active: true,
  },
  {
    id: 'item-9',
    category_id: 'cat-5',
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

export const INITIAL_CHANGELOGS: ChangeLog[] = [
  {
    id: 'log-1',
    admin_user_email: 'barfranca@aosta.it',
    action: 'CREATE',
    entity_type: 'MenuItem',
    entity_id: 'item-1',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    diff: { name: 'Genepì Spritz Valdostano', price: 7.00 },
  },
];

const STORAGE_KEYS = {
  CATEGORIES: 'bar_franca_categories_v3',
  ITEMS: 'bar_franca_items_v3',
  CHANGELOGS: 'bar_franca_changelogs_v3',
};

export class Store {
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

  static async fetchCategoriesFromSupabase(): Promise<Category[]> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getCategories();
    }
    try {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return this.getCategories();
      }
      const mapped: Category[] = data.map((item) => ({
        id: String(item.id),
        name: typeof item.name === 'string' ? JSON.parse(item.name) : item.name,
        sort_order: item.sort_order || 1,
        active: item.active !== undefined ? item.active : true,
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mapped));
      }
      return mapped;
    } catch {
      return this.getCategories();
    }
  }

  static saveCategories(categories: Category[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    const client = supabase;
    if (client && isSupabaseConfigured) {
      Promise.all(
        categories.map((cat) =>
          client.from('categories').upsert(
            {
              id: cat.id,
              name: cat.name,
              sort_order: cat.sort_order,
              active: cat.active,
            },
            { onConflict: 'id' }
          )
        )
      ).catch((err) => console.warn('Supabase sync categories notice:', err));
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

  static async fetchMenuItemsFromSupabase(): Promise<MenuItem[]> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getMenuItems();
    }
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return this.getMenuItems();
      }
      const mapped: MenuItem[] = data.map((item) => ({
        id: String(item.id),
        category_id: String(item.category_id),
        name: typeof item.name === 'string' ? JSON.parse(item.name) : item.name,
        description: typeof item.description === 'string' ? JSON.parse(item.description) : item.description,
        price: Number(item.price) || 0,
        photo_url: item.photo_url || null,
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        sold_out: Boolean(item.sold_out),
        sort_order: item.sort_order || 1,
        active: item.active !== undefined ? item.active : true,
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(mapped));
      }
      return mapped;
    } catch {
      return this.getMenuItems();
    }
  }

  static saveMenuItems(items: MenuItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    }
    const client = supabase;
    if (client && isSupabaseConfigured) {
      Promise.all(
        items.map((item) =>
          client.from('menu_items').upsert(
            {
              id: item.id,
              category_id: item.category_id,
              name: item.name,
              description: item.description,
              price: item.price,
              photo_url: item.photo_url,
              allergens: item.allergens,
              sold_out: item.sold_out,
              sort_order: item.sort_order,
              active: item.active,
            },
            { onConflict: 'id' }
          )
        )
      ).catch((err) => console.warn('Supabase sync items notice:', err));
    }
  }

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
      id: 'log-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newLog, ...logs];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CHANGELOGS, JSON.stringify(updated));
    }
    const client = supabase;
    if (client && isSupabaseConfigured) {
      client.from('change_logs').insert([
        {
          id: newLog.id,
          admin_user_email: newLog.admin_user_email,
          action: newLog.action,
          entity_type: newLog.entity_type,
          entity_id: newLog.entity_id,
          diff: newLog.diff,
        },
      ]).then(() => {}, () => {});
    }
    return newLog;
  }
}
