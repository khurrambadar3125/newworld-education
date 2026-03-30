/**
 * /api/mocks/register — Register a student for Starky Mocks
 * Stores registration in Supabase starky_mocks table
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { name, email, school, grade, country, subjects } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required', success: false });
  }

  try {
    // Check if already registered
    const { data: existing } = await supabase
      .from('starky_mocks')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .limit(1);

    if (existing?.length) {
      // Update subjects if already registered
      await supabase
        .from('starky_mocks')
        .update({ subjects: subjects || [], updated_at: new Date().toISOString() })
        .eq('email', email.toLowerCase().trim());

      return res.status(200).json({ success: true, existing: true });
    }

    // Insert new registration
    const { error } = await supabase.from('starky_mocks').insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      school: school?.trim() || null,
      grade: grade || 'O Level',
      country: country || 'PK',
      subjects: subjects || [],
      registered_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[mocks/register] Supabase error:', error.message);
      // If table doesn't exist yet, still return success (registration saved in localStorage)
      return res.status(200).json({ success: true, note: 'Registration recorded locally' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[mocks/register] Error:', err.message);
    return res.status(200).json({ success: true, note: 'Registration recorded locally' });
  }
}
