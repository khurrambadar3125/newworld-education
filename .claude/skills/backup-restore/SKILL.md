---
name: backup-restore
description: Run weekly database backup, verify env vars, and restore from zero if needed. MUST run every week automatically.
allowed-tools: Bash(node *) Bash(ls *) Read Write Glob
---

# Backup & Restore — Disaster Recovery

## WEEKLY BACKUP (run every session or at minimum weekly)

```bash
node scripts/backup-database.mjs
```

This exports ALL Supabase tables to `~/Desktop/newworld-backup-YYYY-MM-DD/`:
- JSON file per table (question_bank, leads, student data, etc.)
- Environment variable status check
- Backup summary with row counts

## WHAT GETS BACKED UP
- question_bank (89K+ questions)
- All student/parent data tables
- Leads, subscribers, contacts
- News articles, dictionary
- Championship entries, leaderboard
- Environment variable status (not actual secrets)

## VERIFY BACKUP
```bash
ls ~/Desktop/newworld-backup-* | tail -1
cat ~/Desktop/newworld-backup-*/\_BACKUP-SUMMARY.md
```

## RESTORE FROM ZERO
See: `scripts/restore-database.md` for step-by-step guide.

Quick version:
1. Clone repo from GitHub
2. Create new Supabase project
3. Create tables + import JSON backups
4. Enable RLS
5. Set env vars
6. Deploy to Vercel
7. Point DNS

## ENV VARS BACKUP
The actual .env.vercel file is on the local machine only.
Keep a copy in a SECURE location (encrypted USB, password manager, NOT in git).

Critical vars to back up:
- ANTHROPIC_API_KEY
- SUPABASE_URL + SUPABASE_SECRET_KEY
- KV_REST_API_URL + KV_REST_API_TOKEN
- GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
- NEXTAUTH_SECRET
- RESEND_API_KEY
- DASHBOARD_ADMIN_PASSWORD
- CRON_SECRET

## SCHEDULE
- Run backup: EVERY WEEK (minimum)
- Run at START of every Claude Code session
- Keep last 4 backups on Desktop, delete older ones

## RULES
- NEVER commit .env.vercel or actual secrets to git
- NEVER skip backup before major changes
- ALWAYS verify backup completed by checking summary file
