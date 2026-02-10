import { createClient } from '@supabase/supabase-js';

// Use placeholder values to prevent build crashes if env vars are missing
// Real values must be provided in Vercel settings for the app to function
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
