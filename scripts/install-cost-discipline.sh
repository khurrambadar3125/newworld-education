#!/bin/bash
# install-cost-discipline.sh
# Comprehensive installer for Khurram's cost + continuity discipline.
#
# USAGE:
#   cd /path/to/any-repo
#   bash /Users/khurramb/projects/newworld-platform/scripts/install-cost-discipline.sh
#
# Or with explicit target:
#   bash install-cost-discipline.sh /path/to/target-repo
#
# What it installs:
#   1. .vercel-ignore-build.sh            — skip Vercel builds on docs-only commits
#   2. vercel.json ignoreCommand          — wires the skip logic
#   3. .claude/session-end.sh             — Stop hook script (SESSION.md + CLAUDE.md + backup)
#   4. .claude/settings.json              — Stop hook configuration (git-tracked)
#   5. .git/hooks/pre-push                — local warning before pushes that trigger builds
#
# Safe to run multiple times — idempotent. Only commits + pushes if changes happened.

set -e

SOURCE_REPO="/Users/khurramb/projects/newworld-platform"
TARGET_DIR="${1:-$(pwd)}"

cd "$TARGET_DIR"

if [ ! -d .git ]; then
  echo "✗ $TARGET_DIR is not a git repository"
  exit 1
fi

REPO=$(basename "$TARGET_DIR")
echo "→ Installing cost + continuity discipline in: $REPO"

# ─── 1. Vercel build skip script ───
if [ -f .vercel-ignore-build.sh ]; then
  echo "  ⊘ .vercel-ignore-build.sh already exists"
else
  cp "$SOURCE_REPO/.vercel-ignore-build.sh" .vercel-ignore-build.sh
  chmod +x .vercel-ignore-build.sh
  echo "  ✓ Installed .vercel-ignore-build.sh"
fi

# ─── 2. vercel.json ignoreCommand ───
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

# ─── 3. Session-end Stop hook script (git-tracked) ───
mkdir -p .claude
if [ -f .claude/session-end.sh ]; then
  # Overwrite to keep in sync with newworld's version
  cp "$SOURCE_REPO/.claude/session-end.sh" .claude/session-end.sh
  chmod +x .claude/session-end.sh
  echo "  ✓ Updated .claude/session-end.sh"
else
  cp "$SOURCE_REPO/.claude/session-end.sh" .claude/session-end.sh
  chmod +x .claude/session-end.sh
  echo "  ✓ Installed .claude/session-end.sh"
fi

# ─── 4. Stop hook config (git-tracked, so it travels with the repo) ───
if [ -f .claude/settings.json ]; then
  # Merge — preserve existing hooks, add ours if missing
  python3 - <<PYEOF
import json
path = '.claude/settings.json'
with open(path) as f:
    d = json.load(f)
stop_hooks = d.setdefault('hooks', {}).setdefault('Stop', [])
if not stop_hooks:
    stop_hooks.append({'hooks': []})
existing = []
for group in stop_hooks:
    for h in group.get('hooks', []):
        existing.append(h.get('command', ''))
if not any('session-end.sh' in c for c in existing):
    stop_hooks[0]['hooks'].append({
        "type": "command",
        "command": "bash .claude/session-end.sh 2>/dev/null || true",
        "timeout": 30,
        "statusMessage": "Saving session state..."
    })
    with open(path, 'w') as f:
        json.dump(d, f, indent=2)
    print("  ✓ Added Stop hook to .claude/settings.json")
else:
    print("  ⊘ Stop hook already in .claude/settings.json")
PYEOF
else
  cp "$SOURCE_REPO/.claude/settings.json" .claude/settings.json
  echo "  ✓ Created .claude/settings.json with Stop hook"
fi

# ─── 5. Pre-push hook (local only — warns about build cost) ───
HOOK_SOURCE="$SOURCE_REPO/scripts/pre-push-build-check.sh"
if [ -f "$HOOK_SOURCE" ]; then
  cp "$HOOK_SOURCE" .git/hooks/pre-push
  chmod +x .git/hooks/pre-push
  echo "  ✓ Installed .git/hooks/pre-push"
fi

# ─── 6. Commit and push (if anything changed) ───
STAGED=$(git status --porcelain .vercel-ignore-build.sh vercel.json .claude/session-end.sh .claude/settings.json 2>/dev/null)
if [ -z "$STAGED" ]; then
  echo "  ⊘ Nothing to commit — already up to date"
  exit 0
fi

git add .vercel-ignore-build.sh vercel.json .claude/session-end.sh .claude/settings.json
git commit -m "Cost + continuity discipline — skip docs builds + auto session handover

Installed:
- .vercel-ignore-build.sh     — skip Vercel build on docs/skills/memory
- vercel.json ignoreCommand   — wires the skip logic
- .claude/session-end.sh      — auto SESSION.md + CLAUDE.md + backup on Stop
- .claude/settings.json       — Stop hook config (travels with repo)

Saves 22-50% of Vercel build minutes. Auto-generates session handover.
Installed via scripts/install-cost-discipline.sh from newworld-platform."

echo "  ✓ Committed"

# Determine default branch (could be main, master, etc.)
BRANCH=$(git branch --show-current)
if git push origin "$BRANCH" 2>/dev/null; then
  echo "  ✓ Pushed to $BRANCH"
else
  echo "  ⚠ Push rejected — pulling with rebase"
  git pull --rebase origin "$BRANCH" 2>/dev/null && git push origin "$BRANCH"
  echo "  ✓ Pushed after rebase"
fi

echo ""
echo "✅ Done. $REPO now has full cost + continuity discipline."
