import { createClient } from '@supabase/supabase-js';
import { env } from './config';

if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(env.supabase.url, env.supabase.anonKey);
