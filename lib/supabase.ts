import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function uploadDishPhoto(file: File): Promise<string | null> {
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `dish-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading photo to Supabase:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('menu-photos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Supabase upload exception:', err);
    return null;
  }
}
