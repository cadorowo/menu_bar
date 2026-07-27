# AGENT.md — LLM Developer Guide for Menu Bar Franca

> This file is intended for AI coding assistants (LLMs) working on this codebase. Read this before making changes to understand the project architecture, data flow, and critical constraints.

---

## Project Summary

**Menu Bar Franca** is a Next.js 14 (App Router) full-stack application with two surfaces:

1. **`/` — Public Menu**: Read-only, mobile-first digital menu for bar guests. Loads data live from Supabase (falls back to localStorage cache if offline).
2. **`/admin` — Admin Dashboard**: PIN-protected management panel. Fully responsive (mobile drawer + desktop sidebar). Writes to Supabase on every save operation.

---

## Critical Constraints — Read Before Touching Anything

### 1. PIN Code
The admin dashboard is protected by PIN `2002`. This is hardcoded in `app/admin/login/page.tsx`. **Do not change it without explicit user instruction.**

### 2. UUID Format
Supabase tables (`categories`, `menu_items`, `change_logs`) use **PostgreSQL UUID columns** for all primary and foreign keys. Strings like `"cat-1"` or `"item-1"` will be **rejected** by the database with error `22P02: invalid input syntax for type uuid`.

- Always use `crypto.randomUUID()` when generating new IDs.
- The seed data in `lib/db.ts` (`INITIAL_CATEGORIES`, `INITIAL_MENU_ITEMS`) must use valid UUID format strings.

### 3. AllergenCode Type
The TypeScript type `AllergenCode` in `lib/types.ts` uses **English full-word enum strings**:
```
'gluten' | 'crustaceans' | 'eggs' | 'fish' | 'peanuts' | 'soybeans' |
'milk' | 'nuts' | 'celery' | 'mustard' | 'sesame' | 'sulphites' | 'lupin' | 'molluscs'
```
**Do not** use short codes like `'GL'`, `'SU'`, `'LA'` in TypeScript arrays — those are only used as visual icon labels in the UI.

### 4. Sticky Header Architecture
The public menu (`app/page.tsx`) wraps `<Header />` and `<CategoryNav />` together in a **single sticky parent `<div>`**. Do not make them independently sticky (`sticky top-[X]`) — this causes clipping and overlap bugs on different device pixel densities.

```tsx
// CORRECT — single unified sticky wrapper
<div className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b ...">
  <Header ... />
  <CategoryNav ... />
</div>

// WRONG — independently sticky children clip each other
<Header className="sticky top-0 ..." />
<CategoryNav className="sticky top-[58px] ..." />
```

### 5. Supabase RLS Policies
The Supabase tables have **Row Level Security** (RLS) enabled. The anon key can only access data if explicit policies allow it. If data stops loading, the most likely cause is missing RLS policies. The required policies for full functionality are:
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `categories` for `anon`
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `menu_items` for `anon`

---

## Data Flow

```
Public Menu (/)
  └── useEffect → Store.fetchCategoriesFromSupabase()
                  Store.fetchMenuItemsFromSupabase()
                    ├── Supabase query (if configured)
                    │     └── Maps rows → Category[] / MenuItem[]
                    │     └── Caches result in localStorage (key: v4)
                    └── Falls back to localStorage / INITIAL_* constants

Admin Dashboard (/admin)
  └── Reads:  Store.getCategories() / Store.getMenuItems() (from localStorage)
  └── Writes: Store.saveCategories() / Store.saveMenuItems()
                ├── Writes to localStorage immediately
                └── Fires async Supabase upsert (best effort, no blocking)
```

---

## File Map

### Core Application

| File | Purpose |
|---|---|
| `app/page.tsx` | Public menu — async Supabase fetch, search, category filter |
| `app/admin/layout.tsx` | Auth guard wrapper + responsive layout container |
| `app/admin/page.tsx` | Dashboard KPI overview (categories, items, sold-out, allergen gaps) |
| `app/admin/items/page.tsx` | Items CRUD — mobile card view + desktop table view |
| `app/admin/categories/page.tsx` | Category CRUD with reorder up/down |
| `app/admin/changelog/page.tsx` | Audit log of all admin changes |
| `app/admin/login/page.tsx` | PIN login (PIN: `2002`) |

### Components — Public

| File | Purpose |
|---|---|
| `components/public/Header.tsx` | Bar name + MapPin location + allergen legend trigger button |
| `components/public/CategoryNav.tsx` | Horizontal scroll filter pills with `getBoundingClientRect` centering |
| `components/public/DishRow.tsx` | Dish card — allergen pills, accordion description, photo lightbox |
| `components/public/AllergenIcons.tsx` | Renders official JPEG allergen icons from `public/allergens/` |
| `components/public/AllergenLegendModal.tsx` | Bottom-sheet EU allergen legend (14 items) |
| `components/public/Footer.tsx` | Opening hours, address, phone |

### Components — Admin

| File | Purpose |
|---|---|
| `components/admin/AdminSidebar.tsx` | Desktop `w-64` sidebar + mobile hamburger drawer |
| `components/admin/MenuItemModal.tsx` | Full form modal for adding/editing menu items (trilingual, allergens, photo) |

### Library

| File | Purpose |
|---|---|
| `lib/db.ts` | `Store` class: localStorage r/w + Supabase async fetch/upsert. Seed data with UUIDs. |
| `lib/supabase.ts` | Supabase client init from env vars. Exports `supabase` and `isSupabaseConfigured`. |
| `lib/types.ts` | TypeScript interfaces: `Category`, `MenuItem`, `ChangeLog`, `AllergenCode` |
| `lib/allergens.ts` | 14 EU allergen definitions with labels in IT/EN/FR |
| `lib/i18n.tsx` | React context for locale detection (`it`, `en`, `fr`) and `t()` helper |

### Assets

| Path | Purpose |
|---|---|
| `public/allergens/GL.jpeg` | Gluten allergen icon |
| `public/allergens/CR.jpeg` | Crustaceans icon |
| `public/allergens/UO.jpeg` | Eggs (Uova) icon |
| `public/allergens/PE.jpeg` | Fish (Pesce) icon |
| `public/allergens/AR.jpeg` | Peanuts (Arachidi) icon |
| `public/allergens/SO.jpeg` | Soybeans (Soia) icon |
| `public/allergens/LA.jpeg` | Milk (Latte) icon |
| `public/allergens/FR.jpeg` | Nuts (Frutta a guscio) icon |
| `public/allergens/SE.jpeg` | Celery (Sedano) icon |
| `public/allergens/SN.jpeg` | Mustard (Senape) icon |
| `public/allergens/SS.jpeg` | Sesame icon |
| `public/allergens/SU.jpeg` | Sulphites icon |
| `public/allergens/LU.jpeg` | Lupin icon |
| `public/allergens/MO.jpeg` | Molluscs icon |
| `supabase_schema.sql` | Full PostgreSQL schema with RLS — run once in Supabase SQL Editor |
| `.github/workflows/keep-supabase-alive.yml` | Cron GitHub Action (every 3 days at 12:00 UTC) to prevent free-tier DB auto-pause |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project REST API URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable anon key | Yes |

Both are `NEXT_PUBLIC_` prefixed so they are available in the browser bundle.

---

## Setup Checklist for New Environments

When deploying or setting up a fresh environment:

- [ ] `npm install` — install dependencies
- [ ] Create `.env.local` with Supabase URL and anon key
- [ ] Run `supabase_schema.sql` in Supabase SQL Editor
- [ ] Apply RLS policies for anon CRUD access (see README.md)
- [ ] Confirm Supabase returns data: `categories` (5 rows), `menu_items` (9 rows)
- [ ] Add env vars to Vercel dashboard for production deployments
- [ ] Run `npm run build` to validate TypeScript — should show 0 errors
- [ ] Verify GitHub Action `.github/workflows/keep-supabase-alive.yml` is enabled

---

## Known Behaviors & Workarounds

### Supabase Keep-Alive Workflow
Supabase Free Tier automatically pauses projects after 7 days of inactivity. The workflow `.github/workflows/keep-supabase-alive.yml` runs every 3 days at 12:00 UTC, sending a light `curl` GET request to `/rest/v1/categories?select=id&limit=1`. This resets the inactivity counter so the project stays active 24/7 without needing paid upgrades or manual log-ins.

### Category Filter Centering
`CategoryNav.tsx` uses `getBoundingClientRect()` math in the `onClick` handler to scroll the active pill to center. This is intentional and more reliable than CSS `scroll-behavior: smooth`. Do not replace it with `scrollIntoView`.

### LocalStorage Cache Keys
The `Store` class uses versioned localStorage keys (`bar_franca_categories_v4`, `bar_franca_items_v4`). When migrating data formats, bump the version number to avoid stale-cache issues.

### Supabase Fetch Fallback
If Supabase returns an empty array (0 rows) or an error, `Store.fetchCategoriesFromSupabase()` falls back silently to the localStorage cache or `INITIAL_*` seed constants. This prevents the public menu from showing a blank page when the DB is unreachable.

### name Column on Supabase
The `categories.name` and `menu_items.name` columns are `JSONB`, not `TEXT`. When Supabase returns them, they may be returned as a JavaScript object (already parsed) rather than a JSON string. The mapping functions in `db.ts` handle both: `typeof item.name === 'string' ? JSON.parse(item.name) : item.name`.

---

## Bar Identity Reference

| Field | Value |
|---|---|
| Bar Name | Bar Franca — Aosta |
| Address | Via Croix-de-Ville, 70, 11100 Aosta AO |
| Phone | +39 334 190 2702 |
| Admin PIN | `2002` |
| GitHub | `https://github.com/cadorowo/menu_bar` |
| Supabase Project ID | `mertfuqvcqidwbqdjzle` |
| Hours (Mon–Thu) | 06:30 – 22:30 |
| Hours (Fri–Sat) | 06:30 – 01:00 |
| Hours (Sun) | Chiuso |
