#!/usr/bin/env node
/**
 * scripts/backup-database.mjs — Weekly Supabase database backup
 * Exports ALL tables to JSON files on Desktop
 * Run: node scripts/backup-database.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// All known tables
const TABLES = [
  'question_bank', 'topic_mastery', 'student_progress', 'leads', 'lead_capture',
  'subscribers', 'news_articles', 'leaderboard', 'daily_challenges',
  'championship_entries', 'contact_submissions', 'school_inquiries',
  'outcomes', 'student_outcomes', 'signals', 'tracked_students',
  'student_memory', 'atom_mastery', 'nano_mastery', 'sr_queue',
  'learning_progress', 'session_data', 'student_sessions',
  'dictionary', 'multilingual_dictionary', 'teaching_bank',
  'question_bank_images', 'public_question_images',
  'users', 'profiles', 'subscriptions', 'referrals',
  'assignments', 'parent_feedback', 'school_partnerships',
  'mock_exams', 'atoms_mastery', 'sessions', 'session_logs',
];

async function backupTable(tableName) {
  const allRows = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await sb
      .from(tableName)
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) {
      // Table might not exist — skip
      if (error.code === '42P01') return { name: tableName, rows: 0, status: 'NOT_FOUND' };
      return { name: tableName, rows: 0, status: 'ERROR', error: error.message };
    }

    if (!data || data.length === 0) break;
    allRows.push(...data);
    offset += limit;

    // Safety: cap at 200K rows per table
    if (offset > 200000) {
      console.warn(`  ⚠ ${tableName}: capped at 200K rows`);
      break;
    }
  }

  return { name: tableName, rows: allRows.length, data: allRows, status: 'OK' };
}

async function main() {
  const date = new Date().toISOString().split('T')[0];
  const backupDir = path.join(process.env.HOME, 'Desktop', `newworld-backup-${date}`);

  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  console.log(`\n📦 NewWorldEdu Database Backup — ${date}`);
  console.log(`📁 Saving to: ${backupDir}\n`);

  let totalRows = 0;
  const summary = [];

  for (const table of TABLES) {
    process.stdout.write(`  Backing up ${table}...`);
    const result = await backupTable(table);

    if (result.status === 'OK' && result.rows > 0) {
      const filePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2));
      console.log(` ✓ ${result.rows} rows`);
      totalRows += result.rows;
      summary.push({ table, rows: result.rows, status: '✓' });
    } else if (result.status === 'OK') {
      console.log(` - empty`);
      summary.push({ table, rows: 0, status: '-' });
    } else {
      console.log(` ✗ ${result.status}`);
      summary.push({ table, rows: 0, status: '✗' });
    }
  }

  // Save env vars backup (redacted for safety)
  const envBackup = {
    _WARNING: 'KEEP THIS FILE SECURE. Contains API key references.',
    _DATE: date,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ? '***SET***' : 'MISSING',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '***SET***' : 'MISSING',
    KV_REST_API_URL: process.env.KV_REST_API_URL ? '***SET***' : 'MISSING',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? '***SET***' : 'MISSING',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '***SET***' : 'MISSING',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '***SET***' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***SET***' : 'MISSING',
    DASHBOARD_ADMIN_PASSWORD: process.env.DASHBOARD_ADMIN_PASSWORD ? '***SET***' : 'MISSING',
    CRON_SECRET: process.env.CRON_SECRET ? '***SET***' : 'MISSING',
    _NOTE: 'Actual values are in .env.vercel (local) and Vercel dashboard (production)',
  };
  fs.writeFileSync(path.join(backupDir, '_env-status.json'), JSON.stringify(envBackup, null, 2));

  // Save summary
  const summaryText = [
    `# NewWorldEdu Backup — ${date}`,
    ``,
    `Total rows backed up: ${totalRows.toLocaleString()}`,
    `Tables: ${summary.filter(s => s.status === '✓').length} with data, ${summary.filter(s => s.status === '-').length} empty, ${summary.filter(s => s.status === '✗').length} errors`,
    ``,
    `| Table | Rows | Status |`,
    `|-------|------|--------|`,
    ...summary.map(s => `| ${s.table} | ${s.rows.toLocaleString()} | ${s.status} |`),
    ``,
    `## To restore:`,
    `1. Create new Supabase project`,
    `2. Run table creation SQL (see scripts/restore-database.md)`,
    `3. Import JSON files using: node scripts/restore-database.mjs`,
    `4. Update .env.vercel with new Supabase URL + keys`,
    `5. Deploy to Vercel: vercel --prod`,
  ].join('\n');

  fs.writeFileSync(path.join(backupDir, '_BACKUP-SUMMARY.md'), summaryText);

  console.log(`\n✅ Backup complete: ${totalRows.toLocaleString()} rows across ${summary.filter(s => s.status === '✓').length} tables`);
  console.log(`📁 ${backupDir}`);
}

main().catch(e => { console.error('Backup failed:', e.message); process.exit(1); });
