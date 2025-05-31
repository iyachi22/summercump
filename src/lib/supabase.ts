import { createClient } from '@supabase/supabase-js';
import { env } from '@/utils/env';

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your configuration.');
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});
