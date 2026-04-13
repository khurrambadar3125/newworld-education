---
name: cost-audit
description: Audit Vercel build costs, Anthropic API costs, Supabase reads, cron invocations. Find waste and apply the build cost discipline rules from memory. Run monthly or when bills spike.
allowed-tools: Read Grep Glob Bash(git *) Bash(grep *) Bash(cat *) Bash(wc *)
---

# Cost Audit

Find and fix money leaks across Vercel + Anthropic + Supabase.

## RULE 1 — Vercel Build Minutes (from memory: feedback_build_cost_discipline)

Check these guardrails exist and are working:

### 1a. vercel.json has ignoreCommand
```bash
grep -q "ignoreCommand" vercel.json && echo "✓ ignoreCommand set" || echo "✗ MISSING — add it"
```

### 1b. .vercel-ignore-build.sh exists and is executable
```bash
[ -x .vercel-ignore-build.sh ] && echo "✓ ignore script ready" || echo "✗ script missing or not executable"
```

### 1c. Commit discipline — last 30 commits
```bash
# How many of the last 30 commits touched only docs/skills/memory?
SKIP=0; BUILD=0
for hash in $(git log --pretty=format:'%H' HEAD~30..HEAD); do
  files=$(git diff --name-only "$hash~1" "$hash" 2>/dev/null)
  code=0
  for f in $files; do
    case "$f" in
      pages/*|components/*|utils/*|styles/*|public/*|scripts/*|package.json|package-lock.json|next.config.*|vercel.json|middleware.*) code=1; break ;;
    esac
  done
  if [ "$code" = "0" ]; then SKIP=$((SKIP+1)); else BUILD=$((BUILD+1)); fi
done
echo "Last 30 commits: $BUILD needed build, $SKIP could've been skipped"
echo "Estimated savings with ignoreCommand: $((SKIP * 100 / 30))% of builds avoided"
```

### 1d. Squashable rapid-fire commits
Look for commits made within 60 seconds of each other — those should have been one commit:
```bash
git log --pretty=format:'%ct %s' HEAD~30..HEAD | awk 'NR>1 && prev-$1 < 60 {print "RAPID: " prev_msg " → " substr($0, index($0,$2))} {prev=$1; prev_msg=substr($0, index($0,$2))}'
```

## RULE 2 — Anthropic API

### 2a. Model check — must be Haiku
```bash
# Find any non-Haiku model references in API routes
grep -rn "claude-3-sonnet\|claude-3-opus\|claude-sonnet\|claude-opus" pages/api/ utils/ 2>/dev/null
# Expected: none (except explicit admin/upload scripts for Khurram)
```

### 2b. Prompt caching verification
```bash
# Every anthropic call must use cache_control: ephemeral
grep -L "cache_control" pages/api/anthropic.js pages/api/drill.js pages/api/chat.js 2>/dev/null
```

### 2c. Token leaks — calls without max_tokens cap
```bash
grep -rn "anthropic\|messages.create" pages/api/ | grep -v "max_tokens"
```

### 2d. AbortController on fetch
Memory leak = wasted tokens if user navigates away mid-stream:
```bash
grep -rn "fetch.*anthropic\|fetch.*drill" pages/*.jsx | grep -v "AbortController\|signal"
```

## RULE 3 — Supabase Reads

### 3a. Unbounded queries
```bash
# .select() without .limit() on known large tables
grep -rn "from('question_bank'\|from('strategy_signals'\|from('leads')" pages/api/ utils/ | grep -v ".limit("
```

### 3b. Missing indexes
Check the Supabase dashboard for missing indexes on frequently queried columns — not checkable from code but flag for manual review.

### 3c. KV cache hit rate
```bash
# Find expensive Supabase queries that don't use KV caching
grep -rn "from('teaching_insights'\|from('student_preferences'" pages/api/ | grep -v "kv\|upstash"
```

## RULE 4 — Cron Jobs

### 4a. Count and frequency
```bash
# Count crons in vercel.json
python3 -c "import json; d=json.load(open('vercel.json')); crons=d.get('crons',[]); print(f'{len(crons)} crons'); [print(f\"  {c['path']}: {c['schedule']}\") for c in crons]"
```

### 4b. High-frequency crons
Flag any cron running more often than hourly. Usually those are mistakes.

### 4c. Redundant crons
Look for crons doing overlapping work (e.g. two crons both warming the same cache).

## RULE 5 — Cross-Platform (for Khurram's 12 platforms)

If this skill is run in the newworld-platform repo but Khurram has 11 others, the memory rule `feedback_build_cost_discipline` should be copied to each. For each other platform:

1. Add `.vercel-ignore-build.sh` (copy from this repo)
2. Add `"ignoreCommand": "bash .vercel-ignore-build.sh"` to its vercel.json
3. Disable Preview deployments in Vercel dashboard if not needed
4. Review crons

## REPORT FORMAT

```
COST AUDIT — 2026-04-13
═══════════════════════

BUILD (Vercel):
  ✓ ignoreCommand configured
  ✓ .vercel-ignore-build.sh executable
  ✗ Last 30 commits — 9 were doc-only, could have skipped build
  ⚠ 4 pairs of rapid-fire commits (< 60s apart) — should have been squashed

API (Anthropic):
  ✓ All routes use claude-3-haiku-20240307
  ✓ cache_control: ephemeral on all 3 AI routes
  ✗ /api/drill.js missing max_tokens on 1 call
  ✗ pages/index.jsx fetch missing AbortController (4 places)

DATABASE (Supabase):
  ✗ utils/masteryEngine.js: unbounded select('*')
  ✓ /api/cron/lead-drip has .limit(500)
  ⚠ /api/weaknesses could use KV cache

CRONS:
  27 crons total
  ⚠ /api/cron/daily-question runs 5x/day — reconsider
  ⚠ 2 crons overlap (both warm same cache)

ESTIMATED MONTHLY SAVINGS IF FIXED:
  Build minutes: 30-50%
  API tokens: 10-20%
  DB reads: 5%
```

## USAGE

```
/cost-audit                  # Full audit
/cost-audit build            # Just Vercel build checks
/cost-audit api              # Just Anthropic checks
/cost-audit db               # Just Supabase checks
/cost-audit cron             # Just cron checks
/cost-audit fix              # Audit + auto-fix safe issues
```

## THE DISCIPLINE

**Before any commit/push in any session**, ask: does this actually change what users see? If no → skip the build via `ignoreCommand`. If yes → batch with other related changes before pushing.

Rule from memory: ≤3 pushes per feature, never 10.
