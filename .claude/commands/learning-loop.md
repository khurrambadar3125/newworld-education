---
name: learning-loop
description: Inspect, debug, and enhance the self-improving learning loop. The learning loop is THE core intelligence system — every session feeds back into making Starky smarter.
allowed-tools: Read Grep Glob Bash(node *) Bash(curl *)
---

# Learning Loop — The Self-Improving Brain

The learning loop is the platform's core competitive advantage. Every student session generates signals that feed back into improving the platform. This skill helps inspect, debug, and enhance it.

## THE 7-LAYER LOOP

### Layer 1: Signal Collection (every session)
**File:** `utils/signalCollector.js`
- Records: message signals, mood signals, dropoff signals, strategy signals
- Detects sentiment from student messages
- Fires on every chat interaction

**Check:**
```bash
grep -n "recordMessageSignal\|recordMoodSignal\|recordDropoffSignal" utils/signalCollector.js | head -20
```

### Layer 2: Session Analysis (end of session)
**File:** `utils/sessionAnalysis.js`
- Analyzes completed sessions for patterns
- Identifies weak topics per student
- Feeds into weakness detector

**Check:**
```bash
grep -n "analyzeSession\|sessionSummary" utils/sessionAnalysis.js | head -20
```

### Layer 3: Weakness Detection (continuous)
**File:** `utils/weaknessDetector.js`
- 60+ weakness categories
- Background detection during sessions
- Predictive weakness engine

**Check:**
```bash
grep -n "detectWeakness\|WEAKNESS_CATEGORIES" utils/weaknessDetector.js | head -20
```

### Layer 4: Signal Analysis (daily 9pm PKT)
**Cron:** `pages/api/cron/signal-analysis.js`
- Processes all signals collected that day
- Identifies platform-wide patterns
- Generates insights for auto-improver

**Check:**
```bash
curl -s https://www.newworld.education/api/cron/signal-analysis \
  -H "x-cron-secret: $CRON_SECRET" | head -50
```

### Layer 5: Auto-Improver (Saturday 10pm PKT)
**Cron:** `pages/api/cron/auto-improver.js`
- Uses signal analysis to improve prompts
- Identifies gaps in knowledge base
- Suggests new atoms/goals

**File:** `utils/autoImprover.js`
```bash
grep -n "improve\|enhance\|gap" utils/autoImprover.js | head -20
```

### Layer 6: Evolution Report (daily 10am PKT)
**Cron:** `pages/api/cron/evolution-report.js`
- Summarizes what improved
- What students struggled with
- What was auto-fixed

### Layer 7: Predictive Analysis (daily 11pm PKT)
**Cron:** `pages/api/cron/predictive-analysis.js`
- Predicts which topics will be weak tomorrow
- Pre-generates content for predicted weak areas
- Fires before the next study day

## CRON SCHEDULE (all times PKT)

| Time | Cron | What |
|------|------|------|
| 2:00 AM | brain-update | Daily brain update from bank |
| 6:00 AM | phase-transitions | Academic calendar phase check |
| 8:00 AM | news-publish | Publish 3 news articles |
| 9:00 PM | signal-analysis | Process day's signals |
| 9:00 PM | kv-backup | Backup KV data |
| 10:00 AM | evolution-report | Daily evolution summary |
| 10:00 PM (Sat) | auto-improver | Weekly self-improvement |
| 11:00 PM | predictive-analysis | Predict tomorrow's weak topics |
| 1:00 AM | national-insights | National learning insights |
| Every 6h | self-heal | Self-healing checks |

## INSPECTING THE LOOP

### Check if signals are being collected:
```bash
# Check KV for recent signals
curl -s "https://www.newworld.education/api/health" \
  -H "x-admin-password: $DASHBOARD_PASSWORD"
```

### Check signal volume:
```javascript
// In Node.js with KV access
const signals = await kv.keys('signal:*');
console.log('Total signals:', signals.length);
```

### Check weakness categories:
```bash
grep -c "id:" utils/weaknessDetector.js
# Should show 60+ categories
```

### Check atoms/goals count:
```bash
grep -c "id:" utils/starkyAtomsKB.js
# Should show 2,168+ goals
```

## ENHANCING THE LOOP

### Adding a new weakness category:
1. Read `utils/weaknessDetector.js`
2. Add new category to the CATEGORIES array
3. Add detection logic
4. Test with a sample session

### Adding a new signal type:
1. Read `utils/signalCollector.js`
2. Add new record function
3. Wire it into the relevant component
4. Add processing in signal-analysis cron

### Adding a new atom/goal:
1. Read `utils/starkyAtomsKB.js`
2. Add new atom with: id, subject, atom text
3. The brain-update cron will pick it up

## DEBUGGING

### Loop not firing?
1. Check Vercel cron logs for errors
2. Verify CRON_SECRET matches between Vercel env and cron headers
3. Check `vercel.json` for cron schedule configuration

### Signals not collecting?
1. Check if `signalCollector` is imported in the relevant page
2. Check KV connection (KV_REST_API_URL, KV_REST_API_TOKEN)
3. Check browser console for fetch errors to /api/signals

### Weakness not detected?
1. Check if the student has enough session history
2. Minimum 5 questions needed for pattern detection
3. Check weaknessDetector categories match the subject

## RULES
- NEVER disable any part of the loop
- NEVER skip signal collection
- NEVER bypass weakness detection
- The loop is SACRED — only enhance, never reduce
- Every session MUST log — no bypass, no skip
