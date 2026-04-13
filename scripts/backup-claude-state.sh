#!/bin/bash
# Backup entire Claude state to GitHub so it survives laptop failure.
# Run manually any time. Idempotent. Safe to run on a cron.
#
# What it backs up:
#   - ~/.claude/ESTATE.md                              (estate index)
#   - ~/.claude/projects/*/memory/                     (per-project memory for ALL projects)
#   - ~/.claude/settings.local.json (redacted)         (hooks + config)
#
# Target: private GitHub repo `khurrambadar3125/claude-state-backup`

set -e

TOKEN="${GITHUB_TOKEN:-$(git -C /Users/khurramb/projects/newworld-platform config --get remote.origin.url 2>/dev/null | grep -oE 'ghp_[A-Za-z0-9]+')}"
BACKUP_DIR="/Users/khurramb/.claude-backup"
REPO_NAME="claude-state-backup"

if [ -z "$TOKEN" ]; then
  echo "✗ No GitHub token found"
  exit 1
fi

# Ensure backup repo exists (private)
curl -s -X POST -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO_NAME}\",\"private\":true,\"description\":\"Backup of ~/.claude state — memory, estate, config\"}" \
  > /dev/null 2>&1 || true

# Initialize local backup clone if needed
if [ ! -d "$BACKUP_DIR/.git" ]; then
  rm -rf "$BACKUP_DIR"
  git clone -q "https://${TOKEN}@github.com/khurrambadar3125/${REPO_NAME}.git" "$BACKUP_DIR" 2>/dev/null || {
    mkdir -p "$BACKUP_DIR"
    cd "$BACKUP_DIR"
    git init -q
    git remote add origin "https://${TOKEN}@github.com/khurrambadar3125/${REPO_NAME}.git"
  }
fi

cd "$BACKUP_DIR"

# Copy ESTATE.md
cp /Users/khurramb/.claude/ESTATE.md ESTATE.md 2>/dev/null || true

# Copy per-project memory directories
rm -rf projects
mkdir -p projects
for proj in /Users/khurramb/.claude/projects/*/; do
  name=$(basename "$proj")
  if [ -d "$proj/memory" ]; then
    mkdir -p "projects/$name"
    cp -r "$proj/memory" "projects/$name/"
  fi
done

# Copy settings (redact any tokens)
if [ -f /Users/khurramb/.claude/settings.local.json ]; then
  python3 -c "
import json, re
with open('/Users/khurramb/.claude/settings.local.json') as f:
    raw = f.read()
# Redact any token-like strings
raw = re.sub(r'ghp_[A-Za-z0-9]{20,}', 'ghp_REDACTED', raw)
raw = re.sub(r'sk-[A-Za-z0-9-]{20,}', 'sk-REDACTED', raw)
with open('settings.local.redacted.json', 'w') as f:
    f.write(raw)
" 2>/dev/null || true
fi

# Commit + push
git add -A
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
if git diff --cached --quiet; then
  echo "⊘ No changes to backup"
else
  git -c user.email=khurram@newworld.education -c user.name="Khurram B" commit -q -m "Backup ${TIMESTAMP}"
  git push -q origin HEAD 2>&1 | tail -1
  COUNT=$(find projects -name "*.md" | wc -l | tr -d ' ')
  echo "✓ Backed up ${COUNT} memory files to ${REPO_NAME}"
fi
