#!/bin/bash
# Auto-update CLAUDE.md project structure sections after each session
# Called by Claude Code Stop hook

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

# Only run if CLAUDE.md exists
[ -f CLAUDE.md ] || exit 0

# Collect current pages
PAGES=$(ls pages/*.jsx 2>/dev/null | sed 's|pages/||;s|\.jsx||' | sort)

# Collect current utils
UTILS=$(ls utils/*.js 2>/dev/null | sed 's|utils/||;s|\.js||' | sort)

# Collect current API routes
APIS=$(find pages/api -name '*.js' 2>/dev/null | sed 's|pages/||;s|\.js||' | sort)

# Collect current components
COMPONENTS=$(ls components/*.jsx 2>/dev/null | sed 's|components/||;s|\.jsx||' | sort)

# Count them
PAGE_COUNT=$(echo "$PAGES" | wc -l | tr -d ' ')
UTIL_COUNT=$(echo "$UTILS" | wc -l | tr -d ' ')
API_COUNT=$(echo "$APIS" | wc -l | tr -d ' ')
COMPONENT_COUNT=$(echo "$COMPONENTS" | wc -l | tr -d ' ')

# Get last 5 commits
RECENT=$(git log --oneline -5 2>/dev/null)

# Output as system message
cat <<EOF
{"systemMessage": "CLAUDE.md sync: ${PAGE_COUNT} pages, ${UTIL_COUNT} utils, ${API_COUNT} API routes, ${COMPONENT_COUNT} components. Last commits:\n${RECENT}"}
EOF
