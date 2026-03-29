#!/bin/bash
# Auto-update CLAUDE.md session snapshot after each conversation
# Called by Claude Code Stop hook

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

[ -f CLAUDE.md ] || exit 0

# --- Collect current state ---
PAGE_COUNT=$(ls pages/*.jsx 2>/dev/null | wc -l | tr -d ' ')
UTIL_COUNT=$(ls utils/*.js 2>/dev/null | wc -l | tr -d ' ')
API_COUNT=$(find pages/api -name '*.js' 2>/dev/null | wc -l | tr -d ' ')
COMPONENT_COUNT=$(ls components/*.jsx 2>/dev/null | wc -l | tr -d ' ')
CRON_COUNT=$(find pages/api/cron -name '*.js' 2>/dev/null | wc -l | tr -d ' ')

# Recent commits (last 10)
RECENT_COMMITS=$(git log --oneline -10 2>/dev/null)

# Files changed in last commit
LAST_CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | head -20)

# Uncommitted changes
UNCOMMITTED=$(git diff --name-only 2>/dev/null | head -20)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | head -20)

# Current pages list
PAGES_LIST=$(ls pages/*.jsx 2>/dev/null | sed 's|pages/||;s|\.jsx||' | sort | tr '\n' ', ' | sed 's/,$//')

# Current utils list
UTILS_LIST=$(ls utils/*.js 2>/dev/null | sed 's|utils/||;s|\.js||' | sort | tr '\n' ', ' | sed 's/,$//')

# Current date
NOW=$(date '+%Y-%m-%d %H:%M')

# --- Update the Session Snapshot section ---
# Remove existing session snapshot (between markers)
sed -i '' '/^## Session Snapshot (auto-updated)/,/^## [^S]/{ /^## [^S]/!d; }' CLAUDE.md 2>/dev/null

# If no snapshot section exists, append it
if ! grep -q "## Session Snapshot (auto-updated)" CLAUDE.md 2>/dev/null; then
  cat >> CLAUDE.md <<SNAPSHOT

## Session Snapshot (auto-updated)
<!-- This section is auto-updated by .claude/update-claude-md.sh Stop hook -->
<!-- Last sync: ${NOW} -->

**Platform counts**: ${PAGE_COUNT} pages, ${UTIL_COUNT} utils, ${API_COUNT} API routes, ${COMPONENT_COUNT} components, ${CRON_COUNT} cron jobs

**All pages**: ${PAGES_LIST}

**All utils**: ${UTILS_LIST}

**Last 10 commits**:
\`\`\`
${RECENT_COMMITS}
\`\`\`

**Files changed in last commit**:
\`\`\`
${LAST_CHANGED}
\`\`\`

**Uncommitted changes**: ${UNCOMMITTED:-none}
**Untracked files**: ${UNTRACKED:-none}
SNAPSHOT
else
  # Replace existing snapshot content
  # Use a temp file approach for safety
  TMPFILE=$(mktemp)
  awk '
    /^## Session Snapshot \(auto-updated\)/ { print; skip=1; next }
    skip && /^## / { skip=0 }
    !skip { print }
  ' CLAUDE.md > "$TMPFILE"

  # Now append fresh snapshot after the header
  awk -v now="${NOW}" \
      -v counts="${PAGE_COUNT} pages, ${UTIL_COUNT} utils, ${API_COUNT} API routes, ${COMPONENT_COUNT} components, ${CRON_COUNT} cron jobs" \
      -v pages="${PAGES_LIST}" \
      -v utils="${UTILS_LIST}" \
      -v commits="${RECENT_COMMITS}" \
      -v changed="${LAST_CHANGED}" \
      -v uncommitted="${UNCOMMITTED:-none}" \
      -v untracked="${UNTRACKED:-none}" '
    /^## Session Snapshot \(auto-updated\)/ {
      print
      print "<!-- This section is auto-updated by .claude/update-claude-md.sh Stop hook -->"
      print "<!-- Last sync: " now " -->"
      print ""
      print "**Platform counts**: " counts
      print ""
      print "**All pages**: " pages
      print ""
      print "**All utils**: " utils
      print ""
      print "**Last 10 commits**:"
      print "```"
      # commits has newlines encoded — print line by line
      n = split(commits, arr, "\n")
      for (i=1; i<=n; i++) print arr[i]
      print "```"
      print ""
      print "**Files changed in last commit**:"
      print "```"
      n = split(changed, arr, "\n")
      for (i=1; i<=n; i++) print arr[i]
      print "```"
      print ""
      print "**Uncommitted changes**: " uncommitted
      print "**Untracked files**: " untracked
      next
    }
    { print }
  ' "$TMPFILE" > CLAUDE.md

  rm -f "$TMPFILE"
fi

# Output system message for Claude Code UI
cat <<EOF
{"systemMessage": "CLAUDE.md synced: ${PAGE_COUNT} pages, ${UTIL_COUNT} utils, ${API_COUNT} APIs, ${COMPONENT_COUNT} components"}
EOF
