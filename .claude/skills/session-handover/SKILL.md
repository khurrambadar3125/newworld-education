---
name: session-handover
description: Auto-generate a handover document before context expires or session ends. Captures everything the next session needs to know.
allowed-tools: Bash(git *) Read Write Glob Grep
---

# Session Handover — Save Context Before It's Lost

Generate a complete handover document capturing everything from this session.

## WHAT TO CAPTURE

### 1. What was done this session
```bash
# Commits made during this session (last 24h)
git log --oneline --since="24 hours ago"
```

### 2. What's still broken / unfinished
- List every known issue discussed but not fixed
- List every task started but not completed
- List every "we'll do this later" item

### 3. Decisions made
- Any architectural decisions
- Any content/design choices
- Any rules established (save to CLAUDE.md if permanent)

### 4. Feedback from Khurram
- Save any new feedback to memory files
- Update MEMORY.md index

### 5. Current platform state
- Bank counts (query Supabase if possible)
- Pages changed
- Uncommitted changes

## OUTPUT FORMAT

Write to `/Users/khurramb/Desktop/session-handover-[DATE].md`:

```markdown
# NewWorldEdu — Session Handover
# Date: [DATE]

## COMPLETED THIS SESSION
- [list of commits with descriptions]

## STILL BROKEN / UNFINISHED
1. [issue — what's wrong, what file, what needs to happen]

## DECISIONS MADE
- [decision — why — how it affects future work]

## FEEDBACK SAVED
- [feedback item — saved to which memory file]

## NEXT SESSION PRIORITIES
1. [most important thing to do next]
2. [second priority]
3. [third priority]

## PLATFORM STATE
- Bank: [X] questions
- Pages: [X] pages
- Last commit: [hash] [message]
- Uncommitted: [files]
```

## WHEN TO USE
- When context drops below 20%
- At the end of a long session
- When Khurram says "save session" or "handover"
- Before switching to a completely different task

## ALSO UPDATE
- MEMORY.md with any new memory files created
- CLAUDE.md if any new permanent rules were established
