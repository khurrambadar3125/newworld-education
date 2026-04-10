---
name: prompt-caching
description: Inspect, optimize, and verify Anthropic prompt caching. Ensures ~80% cost savings on API calls. Run to audit cache hit rates and fix silent invalidators.
allowed-tools: Read Grep Glob Bash(node *) Bash(curl *)
---

# Prompt Caching — Cost Optimization

Prompt caching saves ~80% on input token costs. A single byte change in the system prompt prefix invalidates the entire cache. This skill audits, verifies, and optimizes caching.

## HOW IT WORKS

- `cache_control: { type: 'ephemeral' }` on system prompt blocks
- Anthropic caches the exact bytes of the prefix for 5 minutes
- Subsequent requests with identical prefix → ~90% cheaper input tokens
- ANY change in the prefix (timestamp, UUID, dynamic content) → cache miss → full price

## CURRENT SETUP

**File:** `pages/api/anthropic.js` (line ~627)
```javascript
const systemBlocks = [
  { type: 'text', text: built.systemPrompt, cache_control: { type: 'ephemeral' } },
];
```

**System prompt source:** `utils/starkyPrompt.js` → `buildMessages()` function

## AUDIT CHECKLIST

### 1. Check for silent invalidators in system prompt
These BREAK caching if they're inside the system prompt text:

```bash
# Timestamps, dates, random values
grep -n "Date.now\|new Date\|Math.random\|uuid\|timestamp" utils/starkyPrompt.js

# Per-request dynamic values
grep -n "req\.\|request\.\|session\." utils/starkyPrompt.js | head -20

# User-specific values injected early in prompt
grep -n "userProfile\|userName\|email" utils/starkyPrompt.js | head -20
```

**RULE:** Stable content must come FIRST in the system prompt. Dynamic content (student name, subject, session history) should come AFTER the cache_control breakpoint, or be in messages instead.

### 2. Verify cache is actually hitting

Add temporary logging to `pages/api/anthropic.js` after the API call:

```javascript
// After stream.on('end') or after non-streaming response:
console.log('[CACHE]', {
  cache_read: response.usage?.cache_read_input_tokens || 0,
  cache_write: response.usage?.cache_creation_input_tokens || 0,
  uncached: response.usage?.input_tokens || 0,
  hit_rate: response.usage?.cache_read_input_tokens > 0 ? 'HIT' : 'MISS',
});
```

If `cache_read_input_tokens` is always 0 across repeated requests → cache is broken.

### 3. Check prompt size

```bash
# Estimate system prompt token count
node -e "
const { buildMessages } = require('./utils/starkyPrompt');
const built = buildMessages({
  message: 'test',
  userProfile: { gradeId: 'olevel1', grade: 'O Level', name: 'Test' },
  sessionMemory: {},
  history: [],
});
console.log('Prompt chars:', built.systemPrompt.length);
console.log('Estimated tokens:', Math.ceil(built.systemPrompt.length / 4));
"
```

- Minimum cacheable prefix: ~1024 tokens (shorter won't cache)
- Current prompt: ~10K tokens (well above minimum)
- Max allowed: 50K chars (enforced in anthropic.js)

### 4. Check render order

Caching is a PREFIX match. Render order is: `tools` → `system` → `messages`

- Tools must be stable (same tools every request)
- System prompt must be stable (no dynamic content early)
- Messages are NOT cached (they change every turn)

## OPTIMIZATION TIPS

### Split system prompt for better caching
If part of the prompt is static (personality, rules) and part is dynamic (student context, subject knowledge):

```javascript
const systemBlocks = [
  // STABLE — cached across ALL students
  { type: 'text', text: stablePrompt, cache_control: { type: 'ephemeral' } },
  // DYNAMIC — changes per student, not cached
  { type: 'text', text: dynamicContext },
];
```

This way the stable part (~8K tokens) caches even when student context changes.

### Use 1-hour TTL for high-traffic subjects
```javascript
cache_control: { type: 'ephemeral', ttl: '1h' }
```
Better for subjects with many students — cache survives longer between requests.

## COST MATH

| Scenario | Input Cost |
|----------|-----------|
| No caching | $0.25 per 1M tokens (Haiku) |
| Cache write (first request) | ~$0.31 per 1M tokens (1.25x) |
| Cache read (subsequent) | ~$0.025 per 1M tokens (0.1x) |

For a 10K token system prompt used 100 times:
- Without cache: 100 × 10K × $0.25/1M = $0.25
- With cache: 1 write + 99 reads = $0.003 + $0.025 = **$0.028** (89% savings)

## PERMANENT RULES
- Prompt caching is MANDATORY — never remove cache_control
- System prompt cache_control: ephemeral on EVERY request
- Model is PERMANENTLY claude-3-haiku-20240307 ($0.25/$1.25 per million)
- Never upgrade model without Khurram's explicit approval

## USAGE
```
/prompt-caching              # Full audit
/prompt-caching verify       # Check if cache is hitting
/prompt-caching cost         # Estimate monthly savings
/prompt-caching invalidators # Find what's breaking the cache
```
