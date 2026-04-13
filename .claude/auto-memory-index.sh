#!/bin/bash
# Auto-index memory after each Claude Code session
# Ensures MEMORY.md is always up to date with all memory files
# Called by Stop hook alongside update-claude-md.sh

MEM_DIR="/Users/khurramb/.claude/projects/-Users-khurramb-projects-newworld-platform/memory"
INDEX="$MEM_DIR/MEMORY.md"

[ -d "$MEM_DIR" ] || exit 0
[ -f "$INDEX" ] || exit 0

# Find all memory .md files (excluding MEMORY.md itself)
# For each, check if it's in the index. If not, flag it.
MISSING=""
for f in "$MEM_DIR"/*.md; do
  name=$(basename "$f")
  [ "$name" = "MEMORY.md" ] && continue

  # Check if this file is referenced in MEMORY.md
  if ! grep -q "($name)" "$INDEX" 2>/dev/null; then
    # Extract description from frontmatter
    desc=$(awk '/^description:/ {sub(/^description:[ ]*/, ""); print; exit}' "$f" 2>/dev/null)
    [ -z "$desc" ] && desc="(no description)"

    # Detect type from frontmatter
    type=$(awk '/^type:/ {sub(/^type:[ ]*/, ""); print; exit}' "$f" 2>/dev/null)
    [ -z "$type" ] && type="project"

    MISSING="${MISSING}
TYPE:${type}|FILE:${name}|DESC:${desc}"
  fi
done

# If any missing, append them to the end under an auto-added section
if [ -n "$MISSING" ]; then
  # Ensure the "Auto-indexed" section exists, else create it
  if ! grep -q "^## Auto-indexed (pending review)" "$INDEX"; then
    printf "\n## Auto-indexed (pending review)\n" >> "$INDEX"
  fi

  # Append each missing file
  echo "$MISSING" | while IFS='|' read -r t f d; do
    [ -z "$t" ] && continue
    filename=$(echo "$f" | sed 's/^FILE://')
    desc=$(echo "$d" | sed 's/^DESC://')
    entry="- [$filename]($filename) — $desc"
    # Only add if not already there
    if ! grep -qF "($filename)" "$INDEX"; then
      echo "$entry" >> "$INDEX"
    fi
  done
fi

# Report memory stats
TOTAL_FILES=$(ls "$MEM_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
INDEXED=$(grep -c '^- \[' "$INDEX" 2>/dev/null || echo 0)

cat <<EOF
{"systemMessage": "Memory indexed: ${INDEXED} entries across ${TOTAL_FILES} files"}
EOF
