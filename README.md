# Menu Bar Franca — Digital Menu

> **A bilingual (IT / EN / FR), mobile-first digital menu and real-time admin dashboard for Bar Franca, Aosta.**

![Bar Franca](https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=80)

---

## Overview

This is a full-stack Next.js 14 application that powers the digital menu for **Bar Franca — Aosta**. It consists of two main surfaces:

1. **Public Menu** (`/`) — A mobile-first, read-only menu for guests. Supports filtering by category, full-text search, allergen display, and dish photo lightbox.
2. **Admin Dashboard** (`/admin`) — A PIN-protected management panel to add/edit/delete categories and dishes, toggle sold-out status, and track changes in real time. Synced live with Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Styling | Tailwind CSS |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Language | TypeScript |
| Icons | [Lucide React](https://lucide.dev/) |
| Image Storage | Supabase Storage (`menu-photos` bucket) |
| Hosting | [Vercel](https://vercel.com/) (recommended) |

---

## Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com/) project
- A [Vercel](https://vercel.com/) account (for deployment)

---

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cadorowo/menu_bar.git
cd menu_bar
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> Both values are found in your Supabase project → **Settings → API**.

### 3. Setup the Supabase Database

In your Supabase project, open the **SQL Editor** and run the full schema:

```bash
# The schema file is already in the project root
cat supabase_schema.sql
```

Paste and execute the contents of [`supabase_schema.sql`](./supabase_schema.sql) in the Supabase SQL Editor. This creates:
- `categories` table
- `menu_items` table
- `allergens` table (with 14 EU mandatory allergens pre-seeded)
- `change_logs` table
- Row Level Security (RLS) policies

### 4. Configure Row Level Security (RLS)

After running the schema, ensure the following RLS policies exist to allow public read and admin writes. Run in the Supabase SQL Editor:

```sql
-- Allow public (anon) to read categories and items
CREATE POLICY "Allow anon select on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow anon select on menu_items" ON menu_items FOR SELECT USING (true);

-- Allow anon to write (needed for admin dashboard with anon key)
CREATE POLICY "Allow anon insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on menu_items" ON menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on menu_items" ON menu_items FOR DELETE USING (true);
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public menu.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

### 6. Supabase Keep-Alive (Prevent Free Tier 7-Day Auto-Pause)

Supabase Free Tier automatically pauses projects after 7 days of inactivity. This repository includes an automated GitHub Action workflow ([`.github/workflows/keep-supabase-alive.yml`](./.github/workflows/keep-supabase-alive.yml)) that pings the Supabase API **every 3 days**.

To enable custom secrets in GitHub Actions (optional):
1. Go to your repository on GitHub: **Settings → Secrets and variables → Actions**
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Repository Secrets.

---

## Admin Dashboard Access

The admin dashboard is protected by a **4-digit PIN passcode**.

| Field | Value |
|---|---|
| PIN Code | `2002` |
| URL | `/admin/login` |

> To change the PIN, edit the validation logic in `app/admin/login/page.tsx`.

---

## Deploy to Vercel

1. Push your code to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

> ⚠️ Do **not** commit `.env.local` to Git. It is already in `.gitignore`.

---

## Project Structure

```
menu_bar/
├── app/
│   ├── page.tsx              # Public menu page (/)
│   ├── layout.tsx            # Root HTML layout
│   ├── admin/
│   │   ├── layout.tsx        # Admin auth wrapper & sidebar
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── items/page.tsx    # Menu items management
│   │   ├── categories/page.tsx # Categories management
│   │   ├── changelog/page.tsx  # Change history log
│   │   └── login/page.tsx    # PIN login page
│   └── api/menu/route.ts     # Public menu API endpoint
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx  # Responsive sidebar + mobile drawer
│   │   └── MenuItemModal.tsx # Add/edit menu item form modal
│   └── public/
│       ├── Header.tsx        # Bar name + location + allergen trigger
│       ├── CategoryNav.tsx   # Horizontal scrollable category filter pills
│       ├── DishRow.tsx       # Dish card with allergen badges & lightbox
│       ├── AllergenIcons.tsx # Official allergen image icon renderer
│       ├── AllergenLegendModal.tsx # EU 14-allergen legend modal
│       └── Footer.tsx        # Hours, address, contact info
├── lib/
│   ├── db.ts                 # Store class: localStorage + Supabase sync
│   ├── supabase.ts           # Supabase client initialization
│   ├── types.ts              # TypeScript interfaces and types
│   ├── allergens.ts          # 14 EU allergen definitions
│   └── i18n.tsx              # Locale context + translation helper
├── public/
│   └── allergens/            # Official allergen image icons (GL.jpeg, etc.)
└── supabase_schema.sql       # Full database schema with RLS policies
```

---

## Features

### Public Menu
- 🌐 **Trilingual** (Italiano / English / Français) — auto-detected browser language
- 🔍 **Real-time search** across dish names and descriptions
- 🏷️ **Category filter pills** — horizontal scroll, auto-centering on tap
- 🖼️ **Dish photo lightbox** — tap any thumbnail to expand full-screen
- 🧾 **EU Allergen icons** — 14 mandatory EU allergens per dish with official graphic icons
- 📱 **Mobile-first** — optimized for phone browsers

### Admin Dashboard
- 🔐 **PIN-protected login** (passcode: `2002`)
- ➕ **Add / Edit / Delete** categories and menu items
- ✅ **1-Click sold-out toggle** per item (visible instantly on public menu)
- 👁️ **Show/Hide** items without deleting them
- 📸 **Photo upload** via Supabase Storage or direct URL
- 🌍 **Trilingual input** for all names and descriptions (IT / EN / FR)
- 🔄 **Live Supabase sync** — changes reflect instantly on the public menu
- 📋 **Change history log** — audit trail of all admin operations
- 📱 **Responsive** — mobile drawer navigation, touch-friendly cards

---

## Bar Franca Contact Details

| Field | Value |
|---|---|
| Name | Bar Franca |
| Address | Via Croix-de-Ville, 70, 11100 Aosta AO |
| Phone | +39 334 190 2702 |
| Hours (Mon–Thu) | 06:30 – 22:30 |
| Hours (Fri–Sat) | 06:30 – 01:00 |
| Hours (Sun) | Chiuso |

---

## Legal Compliance

This digital menu is compliant with **EU Regulation 1169/2011** on food information to consumers. All 14 mandatory allergens are documented per item using standardized icons and a trilingual accessible legend.

---

## License

Private project — © Bar Franca, Aosta.
