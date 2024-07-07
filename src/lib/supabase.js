import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const url = process.env.REACT_APP_SUPABASE_URL;
const anon = process.env.REACT_APP_SUPABASE_ANON;
export const supabase = createClient(url, anon, {});
