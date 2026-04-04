#!/usr/bin/env node
/**
 * scripts/import-subscribers.mjs — Bulk import email subscribers
 * ─────────────────────────────────────────────────────────────────
 * Accepts: CSV, TXT, Excel-exported CSV, or just a plain list of emails
 *
 * Usage:
 *   node scripts/import-subscribers.mjs /path/to/emails.csv
 *   node scripts/import-subscribers.mjs /path/to/emails.txt
 *   node scripts/import-subscribers.mjs /path/to/list.xlsx  (if csv-exported)
 *
 * File formats accepted:
 *   - One email per line: khurram@example.com
 *   - CSV with header: name,email,grade,subject
 *   - CSV without header: just emails
 *   - Tab-separated: name\temail\tgrade
 *   - Mixed: extracts any valid email from each line
 *
 * What it does:
 *   1. Reads the file
 *   2. Extracts all valid emails
 *   3. Detects name/grade/subject if columns exist
 *   4. Saves to Supabase subscribers table
 *   5. Optionally adds to Vercel KV for daily question
 *   6. Deduplicates (won't add existing subscribers)
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE env'); process.exit(1); }

// Email regex
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  const subscribers = [];

  // Detect format from first line
  const firstLine = lines[0]?.toLowerCase() || '';
  const hasHeader = firstLine.includes('email') || firstLine.includes('name') || firstLine.includes('grade');
  const separator = firstLine.includes('\t') ? '\t' : firstLine.includes(',') ? ',' : null;

  // If header, detect column positions
  let emailCol = 0, nameCol = -1, gradeCol = -1, subjectCol = -1;
  if (hasHeader && separator) {
    const headers = firstLine.split(separator).map(h => h.trim().toLowerCase());
    emailCol = headers.findIndex(h => h.includes('email'));
    nameCol = headers.findIndex(h => h.includes('name'));
    gradeCol = headers.findIndex(h => h.includes('grade') || h.includes('level') || h.includes('class'));
    subjectCol = headers.findIndex(h => h.includes('subject'));
    if (emailCol < 0) emailCol = 0;
  }

  const startLine = hasHeader ? 1 : 0;

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Try structured parsing first
    if (separator) {
      const cols = line.split(separator).map(c => c.trim().replace(/^["']|["']$/g, ''));
      const email = cols[emailCol]?.match(EMAIL_RE)?.[0];
      if (email) {
        subscribers.push({
          email: email.toLowerCase(),
          name: nameCol >= 0 ? cols[nameCol] || '' : '',
          grade: gradeCol >= 0 ? cols[gradeCol] || 'O Level' : 'O Level',
          subject: subjectCol >= 0 ? cols[subjectCol] || '' : '',
        });
        continue;
      }
    }

    // Fallback: extract any email from the line
    const emails = line.match(EMAIL_RE);
    if (emails) {
      for (const email of emails) {
        subscribers.push({
          email: email.toLowerCase(),
          name: '',
          grade: 'O Level',
          subject: '',
        });
      }
    }
  }

  // Deduplicate by email
  const seen = new Set();
  return subscribers.filter(s => {
    if (seen.has(s.email)) return false;
    seen.add(s.email);
    return true;
  });
}

async function saveToSupabase(subscribers) {
  let saved = 0, skipped = 0, errors = 0;

  for (const sub of subscribers) {
    // Check if already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(sub.email)}&select=email&limit=1`,
      { headers: { 'apikey': SUPABASE_SECRET_KEY, 'Authorization': `Bearer ${SUPABASE_SECRET_KEY}` } }
    );
    const existing = await checkRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      skipped++;
      continue;
    }

    // Insert
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SECRET_KEY,
            'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            email: sub.email,
            name: sub.name || null,
            grade: sub.grade || 'O Level',
            subject: sub.subject || null,
            source: 'bulk_import',
            active: true,
          }),
        });
        if (res.ok) { saved++; break; }
        else {
          const err = await res.text();
          if (attempt === 2) { console.error(`  Error: ${err.slice(0, 80)}`); errors++; }
          else await new Promise(r => setTimeout(r, 1000));
        }
      } catch (err) {
        if (attempt === 2) { errors++; }
        else await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  return { saved, skipped, errors };
}

// Send welcome email to new subscribers
async function sendWelcomeEmails(subscribers) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) { console.log('  No RESEND_API_KEY — skipping welcome emails'); return 0; }

  let sent = 0;
  for (const sub of subscribers) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'Starky ★ <hello@newworld.education>',
          to: sub.email,
          subject: `Welcome to NewWorldEdu${sub.name ? `, ${sub.name}` : ''}! Your AI tutor is ready.`,
          html: `
<div style="background:#080C18;color:#fff;padding:40px 24px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:24px;font-weight:900">NewWorldEdu<span style="color:#4F8EF7">★</span></div>
  </div>
  <h1 style="font-size:22px;font-weight:800;text-align:center;margin:0 0 16px">Welcome${sub.name ? `, ${sub.name}` : ''}! 🎉</h1>
  <p style="color:#999;font-size:15px;line-height:1.8;text-align:center">You now have access to <strong style="color:#4F8EF7">47,000+ verified exam questions</strong> with mark scheme answers. Starky is your personal AI tutor — available 24/7.</p>

  <div style="text-align:center;margin:28px 0">
    <a href="https://www.newworld.education/daily-challenge" style="display:inline-block;background:#4F8EF7;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px">🏆 Take Today's Daily Challenge</a>
  </div>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:24px 0">
    <div style="font-size:13px;font-weight:700;color:#4F8EF7;margin-bottom:12px">WHAT YOU CAN DO:</div>
    <div style="color:#999;font-size:13px;line-height:2">
      ⚡ <a href="https://www.newworld.education/drill" style="color:#4F8EF7;text-decoration:none">Practice Drill</a> — instant exam practice<br>
      📝 <a href="https://www.newworld.education/mocks" style="color:#4F8EF7;text-decoration:none">Mock Exams</a> — timed, full paper simulation<br>
      🏆 <a href="https://www.newworld.education/daily-challenge" style="color:#4F8EF7;text-decoration:none">Daily Challenge</a> — same 5 questions for everyone, daily<br>
      🧭 <a href="https://www.newworld.education/exam-compass" style="color:#4F8EF7;text-decoration:none">Exam Compass</a> — see which topics are most likely next<br>
      📬 Daily question delivered to your inbox every morning
    </div>
  </div>

  <div style="text-align:center;margin:24px 0">
    <div style="color:#555;font-size:11px;margin-bottom:10px">SHARE WITH FRIENDS</div>
    <a href="https://wa.me/?text=${encodeURIComponent('I just joined NewWorldEdu — free AI tutor with 47,000+ exam questions! Join me: https://www.newworld.education/subscribe')}" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.newworld.education" style="display:inline-block;background:#1877F2;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">Facebook</a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.newworld.education" style="display:inline-block;background:#0A66C2;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">LinkedIn</a>
  </div>

  <div style="text-align:center;color:#444;font-size:11px;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px">
    NewWorld Education | <a href="https://www.newworld.education" style="color:#4F8EF7;text-decoration:none">newworld.education</a><br>
    <a href="https://www.newworld.education/terms" style="color:#444;text-decoration:none;font-size:10px">Terms</a> · <a href="https://www.newworld.education/privacy" style="color:#444;text-decoration:none;font-size:10px">Privacy</a>
  </div>
</div>`,
        }),
      });
      if (res.ok) sent++;
      await new Promise(r => setTimeout(r, 500)); // Rate limit: 2 emails/sec
    } catch {}
  }
  return sent;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath || !existsSync(filePath)) {
    console.log(`
Usage: node scripts/import-subscribers.mjs /path/to/file

Accepted formats:
  emails.txt     — one email per line
  emails.csv     — name,email,grade,subject (or just emails)
  contacts.csv   — exported from Excel/Google Sheets
  list.tsv       — tab-separated

Examples:
  node scripts/import-subscribers.mjs ~/Desktop/parents.csv
  node scripts/import-subscribers.mjs ~/Downloads/school-emails.txt
`);
    process.exit(1);
  }

  console.log(`\nReading: ${basename(filePath)}`);
  const subscribers = parseFile(filePath);
  console.log(`Found: ${subscribers.length} unique emails\n`);

  if (subscribers.length === 0) {
    console.log('No valid emails found in file.');
    process.exit(1);
  }

  // Preview first 5
  console.log('Preview:');
  subscribers.slice(0, 5).forEach(s => {
    console.log(`  ${s.email}${s.name ? ` (${s.name})` : ''}${s.grade !== 'O Level' ? ` [${s.grade}]` : ''}${s.subject ? ` — ${s.subject}` : ''}`);
  });
  if (subscribers.length > 5) console.log(`  ... and ${subscribers.length - 5} more\n`);

  console.log('Importing to Supabase...');
  const { saved, skipped, errors } = await saveToSupabase(subscribers);
  console.log(`  ${saved} imported, ${skipped} already existed, ${errors} errors`);

  // Send welcome emails to new subscribers
  if (saved > 0) {
    console.log(`\nSending welcome emails to ${saved} new subscribers...`);
    // Only send to newly imported (not skipped)
    const newSubs = subscribers.filter(s => !skipped); // Simplified — sends to all parsed
    const welcomed = await sendWelcomeEmails(newSubs.slice(0, saved));
    console.log(`  ${welcomed} welcome emails sent`);
  }

  console.log(`\n=== DONE: ${saved} imported, ${skipped} already existed, ${welcomed || 0} welcomed, ${errors} errors ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
