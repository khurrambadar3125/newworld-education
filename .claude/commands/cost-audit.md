---
name: cost-audit
description: Audit Vercel build costs, Anthropic API costs, Supabase reads, cron invocations. Run monthly or when bills spike.
allowed-tools: Read Grep Glob Bash(git *) Bash(grep *) Bash(cat *) Bash(wc *)
---

Run the cost-audit skill at .claude/skills/cost-audit/SKILL.md

Argument: $ARGUMENTS (build | api | db | cron | fix | or blank for full audit)
