import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON;
export const supabase = createClient(url, anon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});