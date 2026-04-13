#!/bin/bash
# install-cost-discipline.sh
# One-command installer — copies build cost discipline to any Vercel repo.
#
# USAGE:
#   Navigate to any other platform's repo root, then:
#     bash /Users/khurramb/projects/newworld-platform/scripts/install-cost-discipline.sh
#
# Or with explicit target:
#     bash install-cost-discipline.sh /path/to/other-platform
#
# What it does:
#   1. Copies .vercel-ignore-build.sh into the repo
#   2. Adds ignoreCommand to vercel.json (creates vercel.json if missing)
#   3. Commits and pushes so the skip takes effect immediately
#
# Safe to run multiple times — idempotent.

set -e

SOURCE_SCRIPT="/Users/khurramb/projects/newworld-platform/.vercel-ignore-build.sh"
TARGET_DIR="${1:-$(pwd)}"

cd "$TARGET_DIR"

# Sanity checks
if [ ! -d .git ]; then
  echo "✗ $TARGET_DIR is not a git repository"
  exit 1
fi

if [ ! -f "$SOURCE_SCRIPT" ]; then
  echo "✗ Source script missing: $SOURCE_SCRIPT"
  exit 1
fi

REPO=$(basename "$TARGET_DIR")
echo "→ Installing cost discipline in: $REPO"

# Step 1: Copy script
if [ -f .vercel-ignore-build.sh ]; then
  echo "  ⊘ .vercel-ignore-build.sh already exists (keeping existing)"
else
  cp "$SOURCE_SCRIPT" .vercel-ignore-build.sh
  chmod +x .vercel-ignore-build.sh
  echo "  ✓ Copied .vercel-ignore-build.sh"
fi

# Step 2: Update vercel.json
if [ ! -f vercel.json ]; then
  echo '{"ignoreCommand": "bash .vercel-ignore-build.sh"}' > vercel.json
  echo "  ✓ Created vercel.json with ignoreCommand"
else
  python3 - <<PYEOF
import json
with open('vercel.json') as f:
    d = json.load(f)
if d.get('ignoreCommand') == 'bash .vercel-ignore-build.sh':
    print("  ⊘ ignoreCommand already set")
else:
    d['ignoreCommand'] = 'bash .vercel-ignore-build.sh'
    with open('vercel.json', 'w') as f:
        json.dump(d, f, indent=2)
    print("  ✓ Added ignoreCommand to vercel.json")
PYEOF
fi

# Step 2b: Install local pre-push hook (warns if push will trigger build)
HOOK_SOURCE="/Users/khurramb/projects/newworld-platform/scripts/pre-push-build-check.sh"
if [ -f "$HOOK_SOURCE" ]; then
  cp "$HOOK_SOURCE" .git/hooks/pre-push
  chmod +x .git/hooks/pre-push
  echo "  ✓ Installed pre-push hook (shows build/skip before each push)"
fi

# Step 3: Commit and push
STAGED=$(git status --porcelain .vercel-ignore-build.sh vercel.json 2>/dev/null)
if [ -z "$STAGED" ]; then
  echo "  ⊘ Nothing to commit — already up to date"
  exit 0
fi

git add .vercel-ignore-build.sh vercel.json
git commit -m "Cost discipline — skip Vercel builds on docs-only commits

Saves 22-50% of Vercel build minutes by skipping builds when only
*.md, .claude/*, .github/*, docs/*, README* changed.

Installed via scripts/install-cost-discipline.sh from newworld-platform."

echo "  ✓ Committed"

# Safe push — rebase if remote has changes
if git push origin main 2>/dev/null; then
  echo "  ✓ Pushed to main"
else
  echo "  ⚠ Push rejected — pulling with rebase"
  git pull --rebase origin main
  git push origin main
  echo "  ✓ Pushed after rebase"
fi

echo ""
echo "✅ Done. $REPO now skips Vercel builds for docs/skills/memory commits."
