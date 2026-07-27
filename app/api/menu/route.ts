import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    categories: INITIAL_CATEGORIES.filter((c) => c.active).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
    items: INITIAL_MENU_ITEMS.filter((i) => i.active).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  });
}
