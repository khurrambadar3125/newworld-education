/**
 * utils/supabase.js
 * Supabase client — used server-side only (service_role key).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

let _client = null;

export function getSupabase() {
  if (!_client && supabaseUrl && supabaseKey) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}
