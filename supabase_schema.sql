-- Supabase Database Schema for Aperitivo Bar Digital Menu
-- Compliant with EU Regulation 1169/2011 (14 mandatory allergens)

-- 1. Create Enums & Types
CREATE TYPE allergen_code AS ENUM (
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soybeans',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs'
);

-- 2. Category Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL, -- e.g. {"it": "Cocktail", "en": "Cocktails"}
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MenuItem Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name JSONB NOT NULL, -- e.g. {"it": "Aperol Spritz", "en": "Aperol Spritz"}
  description JSONB, -- e.g. {"it": "Prosecco, Aperol, soda, fetta d'arancia", "en": "Prosecco, Aperol, soda, orange slice"}
  price DECIMAL(10, 2) NOT NULL,
  photo_url TEXT,
  allergens TEXT[] DEFAULT '{}', -- array of allergen_code strings
  sold_out BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Allergen Reference Table (fixed 14 EU items)
CREATE TABLE allergens (
  code TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  label JSONB NOT NULL
);

-- Seed 14 Mandatory EU Allergens
INSERT INTO allergens (code, icon, label) VALUES
  ('gluten', 'Wheat', '{"it": "Glutine", "en": "Gluten"}'),
  ('crustaceans', 'Shrimp', '{"it": "Crostacei", "en": "Crustaceans"}'),
  ('eggs', 'Egg', '{"it": "Uova", "en": "Eggs"}'),
  ('fish', 'Fish', '{"it": "Pesce", "en": "Fish"}'),
  ('peanuts', 'Nut', '{"it": "Arachidi", "en": "Peanuts"}'),
  ('soybeans', 'Bean', '{"it": "Soia", "en": "Soybeans"}'),
  ('milk', 'Milk', '{"it": "Latte & Latticini", "en": "Milk & Dairy"}'),
  ('nuts', 'TreeNut', '{"it": "Frutta a guscio", "en": "Nuts"}'),
  ('celery', 'Carrot', '{"it": "Sedano", "en": "Celery"}'),
  ('mustard', 'Flame', '{"it": "Senape", "en": "Mustard"}'),
  ('sesame', 'CircleDot', '{"it": "Semi di sesamo", "en": "Sesame"}'),
  ('sulphites', 'Wine', '{"it": "Anidride solforosa e solfiti", "en": "Sulphites"}'),
  ('lupin', 'Flower', '{"it": "Lupini", "en": "Lupin"}'),
  ('molluscs', 'Shell', '{"it": "Molluschi", "en": "Molluscs"}')
ON CONFLICT (code) DO NOTHING;

-- 5. ChangeLog Table
CREATE TABLE change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'TOGGLE_SOLDOUT', 'REORDER'
  entity_type TEXT NOT NULL, -- 'Category', 'MenuItem'
  entity_id TEXT NOT NULL,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security Policy Setup
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;

-- Public READ access to active categories and menu items
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public menu items are viewable by everyone" ON menu_items FOR SELECT USING (active = true);
CREATE POLICY "Public allergens are viewable by everyone" ON allergens FOR SELECT USING (true);

-- Authenticated Admin full access
CREATE POLICY "Admins full access categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access menu items" ON menu_items FOR ALL TO authenticated USING (true);
