---
name: switch
description: Switch to a different project in Khurram's estate. Loads the project's memory, git state, and recent work so I can continue from where we left off. Use when Khurram says "work on X" or "switch to Y".
allowed-tools: Read Bash(cd *) Bash(git *) Bash(ls *) Bash(cat *)
---

# Switch Project

Seamless project switching across Khurram's 12-project estate from one terminal session.

## HOW TO USE

User says: "work on khurrambadar" / "switch to mizan" / "edit shari-lme"

I do:

### 1. Read the estate registry
```bash
cat ~/.claude/ESTATE.md
```
This tells me the path, purpose, and stack of the target project.

### 2. Navigate to the project
```bash
cd <path-from-registry>
```

If the repo isn't cloned locally (e.g. mizan-gmalc lives only on GitHub), clone it on demand:
```bash
TOKEN=$(git -C /Users/khurramb/projects/newworld-platform config --get remote.origin.url | grep -oE 'ghp_[A-Za-z0-9]+')
cd ~/projects && git clone "https://${TOKEN}@github.com/khurrambadar3125/<repo>.git"
cd <repo>
```

### 3. Load project context
```bash
[ -f CLAUDE.md ] && cat CLAUDE.md | head -80    # project rules
git log --oneline -10                            # recent commits
git status --short                               # uncommitted state
git diff HEAD~1 --stat                           # what last commit touched
```

### 4. Check per-project memory
Claude Code auto-loads memory for the current working directory from `~/.claude/projects/<encoded-path>/memory/`. The encoded path replaces `/` with `-`. I can verify it loaded by checking if MEMORY.md exists.

### 5. Check if there's a session handover doc
```bash
[ -f .claude/SESSION.md ] && cat .claude/SESSION.md
```
If it exists, it tells me exactly where the last session left off.

### 6. Report to Khurram
Give a quick status:
- "In `khurrambadar`. Last commit was 2h ago — live market bar updates. 1 uncommitted change in `index.html`. Ready."

## WHEN LEAVING A PROJECT

Before switching, I commit + push any in-progress work (with amend discipline):

```bash
# If still iterating on the feature I just pushed → amend
git commit --amend --no-edit
git push --force-with-lease

# If it's a genuinely new chunk of work → new commit
git commit -m "..."
git push
```

**The session handover is AUTO-GENERATED** by the Stop hook (`auto-session-handover.sh`). Khurram never writes a handover. Next session reads `.claude/SESSION.md` to resume exactly where we left off.

**Per-project isolation is preserved**: each project keeps its OWN `.claude/` folder with its own skills, super prompts, seed banks, and memory. The switch skill never moves or merges anything across projects.

## PROJECT ALIASES

User can shortcut project names:

| Says | Means |
|------|-------|
| "newworld" / "the platform" / "starky" | newworld-platform |
| "khurram" / "the personal site" / "market bar" | khurrambadar |
| "mizan" | mizan-gmalc |
| "shari" / "legal" | shari-lme |
| "stratema" | stratema-hp |
| "uae intel" | uae-intelligence-suite |
| "audit" | audit-intelligence-suite |
| "economy" | economyconsumer |
| "tokenization" | futuretokenization |
| "gold" | getgoldsilver |
| "spotlight" | spotlightdubai |
| "demos" | khurram-demos |

## USAGE

```
/switch khurrambadar        # switch to ~/khurrambadar
/switch mizan                # clone and switch to mizan-gmalc
/switch newworld             # return to main platform
/switch                      # list all projects with current status
```

## AUTONOMY

When Khurram says "work on X" without using /switch, I should invoke this skill silently — no need to make him type the slash command. Just:
1. Figure out which project he means (use aliases)
2. Cd there
3. Load context
4. Confirm with one line
5. Proceed with his request
