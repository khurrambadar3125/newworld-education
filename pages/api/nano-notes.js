/**
 * pages/api/nano-notes.js — Serve Nano Notes for a chapter
 * ─────────────────────────────────────────────────────────────────
 * GET /api/nano-notes?subject=Chemistry&chapter=1
 * GET /api/nano-notes?subject=Chemistry&topic=States+of+matter
 *
 * Returns the structured revision note for that chapter.
 * Falls back to local JSON files if Supabase table doesn't exist yet.
 */

import { getSupabase } from '../../utils/supabase';
import { SYLLABUS, getTopicsForSubject } from '../../utils/syllabusStructure';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { subject, chapter, topic, level = 'O Level' } = req.query;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  const supabase = getSupabase();

  // Find chapter by ID or by topic name
  let chapterId = chapter;
  let chapterName = topic;

  if (!chapterId && topic) {
    // Find chapter ID from SYLLABUS by topic name
    const entry = SYLLABUS[subject];
    if (entry) {
      for (const theme of entry.themes) {
        for (const section of theme.sections) {
          if (section.name.toLowerCase() === topic.toLowerCase() ||
              section.keywords.some(kw => topic.toLowerCase().includes(kw))) {
            chapterId = section.id;
            chapterName = section.name;
            break;
          }
        }
        if (chapterId) break;
      }
    }
  }

  try {
    let noteData = null;

    // Try Supabase first
    if (supabase && chapterId) {
      const { data } = await supabase
        .from('nano_notes')
        .select('*')
        .eq('subject', subject)
        .eq('chapter_id', chapterId)
        .single();

      if (data) {
        noteData = data.note_data;

        // Track view count
        supabase
          .from('nano_notes')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
          .then(() => {});
      }
    }

    // Fallback: try local JSON file
    if (!noteData) {
      const localPath = path.join(process.cwd(), 'data', 'nano-notes',
        `${subject.replace(/\s+/g, '-')}_${chapterId || '1'}.json`);
      try {
        if (fs.existsSync(localPath)) {
          const local = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          noteData = local.note_data;
        }
      } catch {}
    }

    if (!noteData) {
      // Return a minimal note structure so the UI still works
      return res.status(200).json({
        subject,
        chapter: chapterId,
        chapterName: chapterName || topic || 'General',
        available: false,
        note: null,
        message: 'Notes for this chapter are being generated. Try the worked example below.',
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');
    return res.status(200).json({
      subject,
      chapter: chapterId,
      chapterName: chapterName || noteData.title,
      available: true,
      note: noteData,
    });

  } catch (err) {
    console.error('[nano-notes] Error:', err.message);
    return res.status(500).json({ error: 'Failed to load notes' });
  }
}
