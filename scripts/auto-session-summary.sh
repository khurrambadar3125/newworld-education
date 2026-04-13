#!/bin/bash
# auto-session-summary.sh
# Writes a structured session summary to memory at every session end.
# Idempotent — creates one file per date, appends if re-run same day.
#
# Uses only git state + memory file detection — no AI call, no cost.

PROJECT=$(basename "$(pwd)")
DATE=$(date '+%Y-%m-%d')
NOW=$(date '+%H:%M')

# Memory dir (per project)
ENCODED=$(pwd | sed 's|/|-|g')
MEM_DIR="/Users/khurramb/.claude/projects/${ENCODED}/memory"
[ -d "$MEM_DIR" ] || exit 0

SUMMARY_FILE="${MEM_DIR}/session_summary_${DATE}.md"

# ─── Gather session facts ───
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
[ -d .git ] || exit 0

# Today's commits
TODAY_COMMITS=$(git log --since="${DATE} 00:00" --pretty=format:'- %h %s' 2>/dev/null)

# Memory files created/modified today
NEW_MEMORIES=""
if [ -d "$MEM_DIR" ]; then
  NEW_MEMORIES=$(find "$MEM_DIR" -name "*.md" -newermt "${DATE} 00:00" -not -name "session_summary_*" 2>/dev/null | while read f; do
    name=$(basename "$f" .md)
    desc=$(awk '/^description:/ {sub(/^description:[ ]*/, ""); print; exit}' "$f" 2>/dev/null)
    [ -z "$desc" ] && desc="(no description)"
    echo "- **${name}** — ${desc}"
  done)
fi

# Files modified (any time, for reference)
FILES_TOUCHED=$(git log --since="${DATE} 00:00" --name-only --pretty=format: 2>/dev/null | sort -u | grep -v "^$" | head -30)

# Push count today
PUSH_COUNT=$(echo "$TODAY_COMMITS" | grep -c "^- [a-f0-9]" 2>/dev/null || echo 0)

# Uncommitted
UNCOMMITTED=$(git status --short 2>/dev/null)

# ─── Only write if there was actual activity today ───
if [ "$PUSH_COUNT" = "0" ] && [ -z "$NEW_MEMORIES" ] && [ -z "$UNCOMMITTED" ]; then
  exit 0  # quiet day, nothing to summarize
fi

# ─── Write summary (overwrite per day — always latest) ───
cat > "$SUMMARY_FILE" <<EOF
---
name: Session summary — ${DATE}
description: Autonomous summary of work on ${PROJECT} on ${DATE}. Auto-written by session-end hook.
type: project
---

## Session: ${PROJECT} — ${DATE}
**Last updated this session:** ${NOW}

## Commits today (${PUSH_COUNT} pushes)
${TODAY_COMMITS:-_(no commits)_}

## New memory entries
${NEW_MEMORIES:-_(no new memory files)_}

## Uncommitted at session end
\`\`\`
${UNCOMMITTED:-(clean)}
\`\`\`

## Top files touched today
\`\`\`
${FILES_TOUCHED:-(none)}
\`\`\`

---
_Auto-written by scripts/auto-session-summary.sh on every Stop hook._
_Purpose: every session's key work survives without manual effort._
EOF

exit 0
