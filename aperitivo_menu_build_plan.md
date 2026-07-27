# Aperitivo Bar Digital Menu — Build Plan

## Project Summary
A mobile-first, read-only digital menu website for an aperitivo bar, paired with a private admin dashboard for menu management. No online ordering or payment functionality. No WhatsApp bot integration (explicitly out of scope). Supports EU-mandated allergen disclosure (14 allergens) and automatic device-language detection (i18n).

## Goals & Constraints
- Public-facing menu is informational only — no cart, no checkout, no order submission of any kind.
- Must be fast and lightweight on mobile networks (target < 1s initial load on 4G).
- Must comply with EU Regulation 1169/2011: all 14 mandatory allergens must be disclosed in writing per dish (icons acceptable if a full legend is accessible).
- Admin dashboard is private, authenticated, and not linked/discoverable from the public site.
- No WhatsApp Business API integration — explicitly excluded from this build.
- Language: i18n with automatic detection of device/browser locale, default fallback to Italian.

## Tech Stack (Recommended)
- Framework: Next.js (App Router) — static generation for public menu pages, server rendering for dashboard.
- Styling: Tailwind CSS.
- Backend/DB/Auth: Supabase (Postgres + Auth + Row Level Security).
- Hosting: Vercel.
- i18n: next-intl or i18next with i18next-browser-languagedetector.
- Image handling: Next.js Image component, optional per dish, lazy-loaded.
- Icons: single consistent line-icon set for allergens (e.g., custom SVG set mapped to the 14 EU allergen categories).

## Data Model

### Category
- id (uuid)
- name (translatable: { it: string, en: string, ... })
- sort_order (int)
- active (boolean)

### MenuItem
- id (uuid)
- category_id (fk -> Category)
- name (translatable)
- description (translatable, optional)
- price (decimal)
- photo_url (nullable string)
- allergens (array of allergen codes, from fixed 14-item enum)
- sold_out (boolean, default false)
- sort_order (int)
- active (boolean)
- created_at / updated_at (timestamps)

### Allergen (fixed reference table, seeded once)
- code (e.g., "gluten", "crustaceans", "eggs", "fish", "peanuts", "soybeans", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs")
- icon (svg reference)
- label (translatable)

### AdminUser
- id (uuid)
- email
- password_hash (handled by Supabase Auth)
- role (owner/staff)

### ChangeLog (optional but recommended)
- id (uuid)
- admin_user_id (fk)
- action (create/update/delete)
- entity_type (Category/MenuItem)
- entity_id
- diff (jsonb before/after snapshot)
- timestamp

## Public Menu Site — Page & Component Spec

### Global Layout
- Sticky header: restaurant logo/name (small, left-aligned), directly below it a horizontally scrollable category tab bar.
- Active category tab: highlighted with filled pill or underline in accent color.
- No navigation to external "order" or "cart" pages anywhere in the UI — must be structurally impossible to add without touching this spec.

### Category Tab Bar Component
- Horizontal scroll, snap-to-tab behavior on swipe.
- Tabs generated dynamically from active Categories, ordered by sort_order.
- Tapping a tab scrolls the dish list to that category's anchor (single-page scroll, not a route change) OR filters the list — choose single continuous scroll with anchors for simplicity.

### Dish Row Component (compact style)
- Layout: two-line compact row.
  - Line 1: dish name (bold, left) + price (right-aligned, same line).
  - Line 2: small inline allergen icons (max ~14px each, wrap if needed).
- Optional thumbnail: circular or rounded-square, 48-56px, left-aligned before text block.
  - If photo_url is null, text block shifts left to fill the space — no placeholder box, no broken grid.
- Tap row: expands accordion-style inline to reveal description text (no route change, no modal).
- Sold-out items: reduced opacity, "Sold out" label, non-interactive (no tap expand needed but description can still show).

### Allergen Legend
- Small info icon fixed near the category tab bar.
- Tapping opens a bottom sheet / modal listing all 14 allergens with icon + full label, in the active locale.

### Footer
- Restaurant address, opening hours, phone (tap-to-call link only — no messaging/order links).
- Optional social links (Instagram/Facebook) as icons.
- No allergen legal disclaimer duplicated here unless required — main disclosure is per-dish + legend.

### Visual Style Tokens
- Background: light/off-white or cream.
- Accent color: warm amber/citrus tone (aperitivo-appropriate), used for active tab, price highlights, sold-out badges.
- Text: dark neutral (not pure black) for contrast without harshness.
- Typography: one clean sans-serif for body/prices; optional light serif or script accent for logo/header only.
- Icon style: consistent single line-icon family across all allergen icons — do not mix icon sets.
- Spacing: generous vertical padding between dish rows despite compact layout (avoid cramped thumb-scrolling feel).

## Internationalization (i18n)
- Library: next-intl or i18next + i18next-browser-languagedetector.
- Detection: read navigator.language / Accept-Language header on first load.
- Fallback: default to Italian (it) if detected locale is unsupported.
- Translatable fields: Category.name, MenuItem.name, MenuItem.description, Allergen.label.
- Storage: each translatable field stored as a JSON object keyed by locale code (e.g., { "it": "...", "en": "..." }); dashboard allows staff to fill in only Italian and leave other locales blank (fallback to Italian string if a translation is missing).
- No visible language switcher required per spec, but include a small unobtrusive fallback toggle in the footer in case auto-detection is wrong (e.g., tourist phone set to a third language not yet translated).

## Admin Dashboard — Page & Component Spec

### Access
- Route: /admin, not linked from any public page, not indexed by search engines (robots noindex, disallow in robots.txt).
- Auth: Supabase Auth email/password login screen; consider optional 2FA.
- Session-protected routes: all /admin/* pages require valid session, redirect to /admin/login otherwise.

### Dashboard Home
- Summary view: count of categories, count of active menu items, count of sold-out items, last-edited timestamp.

### Category Management
- List view: draggable/sortable list of categories (drag to reorder = updates sort_order).
- Add category: name field (per locale), active toggle.
- Edit/delete category: inline edit, delete requires confirmation modal (warn if items exist under it).

### Menu Item Management
- List view: filterable/searchable table grouped by category, showing name, price, sold-out status, allergen tag count.
- Add/Edit item form:
  - Name (per locale, Italian required, others optional).
  - Description (per locale, optional).
  - Price (numeric input, required).
  - Category (dropdown, required).
  - Photo upload (optional, drag-and-drop or file picker, auto-resized/compressed on upload).
  - Allergen checklist: fixed list of 14 EU allergens, multi-select checkboxes.
  - Sold-out toggle.
  - Active/inactive toggle (soft-hide without deleting).
- Delete item: confirmation modal, soft-delete preferred (set active = false) with optional hard-delete for admins only.

### Change Log View (optional but recommended)
- Read-only table: timestamp, admin user, action, entity affected, before/after diff summary.

### Explicitly Out of Scope
- No WhatsApp bot, no chat-based editing interface of any kind.
- No online ordering, cart, or payment integration anywhere in the public site or dashboard.
- No customer accounts or reviews.

## Compliance Notes
- All 14 EU allergens must be represented in the Allergen reference table and available in the legend, regardless of whether a given dish uses them.
- Icons on dish rows must map 1:1 to entries in the allergen legend — no undocumented icons.
- If a dish's allergen data is incomplete or missing, dashboard should visually flag it (e.g., yellow warning badge) so staff don't accidentally publish a dish without disclosure.

## Build Order / Milestones
1. Data model + Supabase schema setup (Category, MenuItem, Allergen, AdminUser, ChangeLog).
2. Admin auth + basic CRUD dashboard (Category and MenuItem management) — build this first since it's how content gets populated.
3. Public menu site: header + category tabs + dish list (static generation, pulling from Supabase).
4. Allergen icon system + legend modal.
5. i18n setup (device detection, fallback logic, translation fields wired into dashboard forms).
6. Photo upload + optional-photo layout handling.
7. Change log (optional).
8. QA pass: mobile device testing (iOS Safari, Android Chrome), allergen compliance review, accessibility check (tap target sizes, color contrast).
9. QR code generation pointing to production menu URL.

## Explicit Non-Goals (for LLM context)
- Do not implement any ordering, cart, checkout, or payment flow.
- Do not implement WhatsApp Business API or any chat-based admin interface.
- Do not build customer login/accounts.
- Do not add a visible mandatory language switcher (device detection only, with unobtrusive fallback toggle).
