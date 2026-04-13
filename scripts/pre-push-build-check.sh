#!/bin/bash
# Pre-push hook — tells you whether Vercel will build or skip this push.
# Install per repo: cp this to .git/hooks/pre-push && chmod +x .git/hooks/pre-push
#
# This is a NON-BLOCKING hook — it only prints info. Push proceeds either way.
# To block accidental doc+code mixed pushes, add `exit 1` under the "code changed" branch.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[2m'
RESET='\033[0m'

# What's in the range being pushed
read local_ref local_sha remote_ref remote_sha
if [ -z "$local_sha" ]; then
  # stdin empty — called manually. Inspect last commit instead.
  CHANGED=$(git diff HEAD~1 --name-only 2>/dev/null)
else
  if [ "$remote_sha" = "0000000000000000000000000000000000000000" ]; then
    # New branch — inspect entire branch vs main
    CHANGED=$(git diff main --name-only 2>/dev/null || git diff HEAD~1 --name-only)
  else
    CHANGED=$(git diff "$remote_sha..$local_sha" --name-only 2>/dev/null)
  fi
fi

[ -z "$CHANGED" ] && CHANGED=$(git diff HEAD~1 --name-only 2>/dev/null)

# Check for code-triggering files
CODE_TRIGGER=0
DOC_ONLY_FILES=""
CODE_FILES=""

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    pages/*|components/*|utils/*|styles/*|public/*|scripts/*|package.json|package-lock.json|next.config.*|vercel.json|middleware.*|.env*|tsconfig.json)
      CODE_TRIGGER=1
      CODE_FILES="${CODE_FILES}\n  ${file}"
      ;;
    *.md|.claude/*|.github/*|README*|CLAUDE.md|docs/*|.gitignore|.vercelignore|.vercel-ignore-build.sh)
      DOC_ONLY_FILES="${DOC_ONLY_FILES}\n  ${file}"
      ;;
    *)
      # Unknown — check extension
      case "$file" in
        *.js|*.ts|*.jsx|*.tsx|*.mjs|*.html|*.css|*.vue|*.py|*.json)
          CODE_TRIGGER=1
          CODE_FILES="${CODE_FILES}\n  ${file}"
          ;;
        *)
          DOC_ONLY_FILES="${DOC_ONLY_FILES}\n  ${file}"
          ;;
      esac
      ;;
  esac
done <<< "$CHANGED"

echo ""
if [ "$CODE_TRIGGER" = "1" ]; then
  printf "${YELLOW}→ Vercel WILL build (~2 min build time charged)${RESET}\n"
  printf "${DIM}  Code files triggering build:${RESET}"
  printf "$CODE_FILES\n"
  if [ -n "$DOC_ONLY_FILES" ]; then
    printf "${DIM}  Also in this push (would've been skipped alone):${RESET}"
    printf "$DOC_ONLY_FILES\n"
  fi
else
  printf "${GREEN}⊘ Vercel will SKIP build (💰 \$0 charged)${RESET}\n"
  printf "${DIM}  Only these docs/config changed:${RESET}"
  printf "$DOC_ONLY_FILES\n"
fi
echo ""

exit 0
