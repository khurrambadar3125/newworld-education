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
    // Set default schema options to avoid 1000-row limit issues
    _client = createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'public' },
      global: { headers: { 'x-client-info': 'newworld-platform' } },
    });
  }
  return _client;
}

/**
 * Paginated fetch — gets ALL rows without hitting 1000 limit
 * Usage: const allRows = await fetchAll(supabase, 'question_bank', { curriculum: 'edexcel' }, 'subject');
 */
export async function fetchAll(table, filters = {}, selectCols = '*', pageSize = 1000) {
  const sb = getSupabase();
  if (!sb) return [];

  let allData = [];
  let from = 0;

  while (true) {
    let query = sb.from(table).select(selectCols).range(from, from + pageSize - 1);

    for (const [key, val] of Object.entries(filters)) {
      query = query.eq(key, val);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) break;

    allData = [...allData, ...data];
    if (data.length < pageSize) break; // Last page
    from += pageSize;
  }

  return allData;
}

/**
 * Get exact count without fetching rows
 */
export async function getCount(table, filters = {}) {
  const sb = getSupabase();
  if (!sb) return 0;

  let query = sb.from(table).select('id', { count: 'exact', head: true });
  for (const [key, val] of Object.entries(filters)) {
    query = query.eq(key, val);
  }

  const { count, error } = await query;
  if (error) return 0;
  return count || 0;
}
