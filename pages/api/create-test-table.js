/**
 * One-time utility: creates tables in Supabase.
 * cambridge_test_answers + cambridge_weaknesses
 */
import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.query.secret !== process.env.CRON_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'No Supabase' });

  try {
    // Try creating the table via RPC or direct SQL
    const { error } = await sb.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS public.cambridge_test_answers (
        id SERIAL PRIMARY KEY,
        subject TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        model TEXT DEFAULT /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        question_index INTEGER
      );`
    });

    if (error) {
      // RPC might not exist — try inserting a test row to see if table exists
      const { error: insertErr } = await sb.from('cambridge_test_answers').insert({
        subject: 'Test', question: 'Test question', answer: 'Test answer',
        model: 'test', timestamp: new Date().toISOString(), question_index: -1,
      });

      if (insertErr && insertErr.message.includes('does not exist')) {
        return res.status(200).json({
          message: 'Table does not exist. Please create it manually in Supabase SQL editor:',
          sql: `CREATE TABLE public.cambridge_test_answers (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  model TEXT DEFAULT /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  question_index INTEGER
);

ALTER TABLE public.cambridge_test_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.cambridge_test_answers FOR ALL USING (auth.role() = 'service_role');`
        });
      }

      // Table exists — clean up test row
      await sb.from('cambridge_test_answers').delete().eq('question_index', -1);
      return res.status(200).json({ message: 'Table already exists. Ready to run test.' });
    }

    return res.status(200).json({ message: 'Table created successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
