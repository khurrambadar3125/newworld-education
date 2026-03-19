/**
 * signalCollector.js
 * Silent signal collection — captures every meaningful student interaction.
 * All writes are async, fire-and-forget, non-blocking.
 * Batches signals and flushes to /api/signals every 10 seconds.
 */

let signalQueue = [];
let flushTimer = null;

function queueSignal(signal) {
  signalQueue.push({ ...signal, timestamp: Date.now() });
  if (!flushTimer) {
    flushTimer = setTimeout(flushSignals, 10000);
  }
  if (signalQueue.length >= 20) flushSignals();
}

function flushSignals() {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (signalQueue.length === 0) return;
  const batch = [...signalQueue];
  signalQueue = [];
  fetch('/api/signals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signals: batch }),
  }).catch(() => {});
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (signalQueue.length > 0) {
      try { navigator.sendBeacon('/api/signals', JSON.stringify({ signals: signalQueue })); } catch {}
    }
  });
}

// ── Sentiment detection ──────────────────────────────────────────────
function detectSentiment(text) {
  const msg = text.toLowerCase();
  const frustrated = ['dont understand', "don't understand", 'confused', 'hard', 'difficult', 'ugh', 'hate', 'stupid', 'cant', "can't", 'impossible', 'give up', 'frustrated', 'samajh nahi', 'mushkil', 'pareshan', 'thak'];
  const positive = ['thank', 'thanks', 'great', 'perfect', 'amazing', 'got it', 'understood', 'makes sense', 'helpful', 'shukriya', 'jazakallah', 'awesome', 'wow', 'cool', 'nice'];
  const confused = ['what', 'huh', '?', 'kya', 'i dont get', "i don't get", 'what do you mean', 'explain again', 'still confused', 'phir se'];
  if (frustrated.some(s => msg.includes(s))) return 'frustrated';
  if (positive.some(s => msg.includes(s))) return 'positive';
  if (confused.some(s => msg.includes(s))) return 'confused';
  return 'neutral';
}

// ── Confusion detection ──────────────────────────────────────────────
function detectConfusionSignal(userMessage, previousStarkyResponse, previousUserMessage) {
  const msg = userMessage.toLowerCase().trim();
  if (previousStarkyResponse && previousStarkyResponse.length > 300 && msg.length < 10) {
    if (['ok', 'okay', 'what', 'huh', '?', 'hmm', 'um', 'kya', 'theek'].includes(msg.replace(/[.!?,]/g, '').trim())) {
      return 'short_dismissive_after_long_response';
    }
  }
  if (/don't understand|dont understand|still confused|samajh nahi|nahi samjha|nahi samjhi/i.test(msg)) {
    return 'explicit_confusion';
  }
  if (previousUserMessage) {
    const a = userMessage.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const b = previousUserMessage.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (a === b) return 'repeated_question';
    const wordsA = new Set(a.split(/\s+/));
    const wordsB = new Set(b.split(/\s+/));
    if (wordsA.size >= 3) {
      let overlap = 0;
      for (const w of wordsA) { if (wordsB.has(w)) overlap++; }
      if (overlap / wordsA.size > 0.6) return 'rephrased_question';
    }
  }
  return null;
}

// ── Language detection ────────────────────────────────────────────────
function detectLanguage(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'urdu_script';
  const romanUrdu = ['hai', 'kya', 'nahi', 'acha', 'theek', 'haan', 'yaar', 'bhai', 'karo', 'mujhe', 'samajh', 'batao', 'kaisa', 'kaise'];
  const words = text.toLowerCase().split(/\s+/);
  const urduCount = words.filter(w => romanUrdu.includes(w)).length;
  if (urduCount >= 2 || (words.length > 0 && urduCount / words.length > 0.3)) return 'roman_urdu';
  return 'english';
}

// ── Public API ────────────────────────────────────────────────────────

export function recordMessageSignal({
  email, subject, grade, userMessage, starkyResponse,
  responseTimeMs, sessionNumber, previousUserMessage,
  previousStarkyResponse, isFirstMessage,
}) {
  const sentiment = detectSentiment(userMessage);
  const confusionSignal = detectConfusionSignal(userMessage, previousStarkyResponse, previousUserMessage);
  const language = detectLanguage(userMessage);
  const now = new Date();

  queueSignal({
    type: 'message',
    email: email || 'anonymous',
    subject: subject || '',
    grade: grade || '',
    topic: subject || '',
    language,
    sentiment,
    metadata: {
      messageLength: userMessage.length,
      responseLength: starkyResponse?.length || 0,
      responseTimeMs: responseTimeMs || 0,
      sessionNumber: sessionNumber || 1,
      dayOfWeek: now.getDay(),
      hourOfDay: now.getHours(),
      isFirstMessage: !!isFirstMessage,
      containsQuestion: /\?/.test(userMessage),
      confusionSignal,
    },
  });

  if (confusionSignal) {
    queueSignal({
      type: 'confusion',
      email: email || 'anonymous',
      topic: subject || '',
      grade: grade || '',
      metadata: {
        confusionType: confusionSignal,
        originalQuestion: userMessage.substring(0, 500),
        starkyResponse: (previousStarkyResponse || '').substring(0, 500),
      },
    });
  }
}

export function recordDrillSignal({ email, subject, topic, score, maxScore, timePerQuestion, hintsUsed, completed }) {
  queueSignal({
    type: 'drill',
    email: email || 'anonymous',
    subject, topic,
    metadata: { score, maxScore, timePerQuestion, hintsUsed, completed: !!completed },
  });
}

export function recordDropoffSignal({ email, stage, page }) {
  queueSignal({ type: 'dropoff', email: email || 'anonymous', metadata: { stage, page } });
}

export function recordMoodSignal({ email, mood, subject, message }) {
  queueSignal({
    type: 'mood',
    email: email || 'anonymous',
    subject: subject || '',
    sentiment: mood,
    metadata: { messagePreview: (message || '').substring(0, 200) },
  });
}

// ── Engagement & teaching strategy signals ──────────────────────────

/**
 * Detect what teaching technique Starky used in a response.
 * Returns an array of strategy tags found.
 */
function detectTeachingStrategy(starkyResponse) {
  if (!starkyResponse) return [];
  const msg = starkyResponse.toLowerCase();
  const strategies = [];

  // Games & interactive techniques
  if (/i spy|let'?s play|game time|treasure hunt|quiz time|challenge/i.test(msg)) strategies.push('game');
  if (/imagine|picture this|think of it like|pretend/i.test(msg)) strategies.push('analogy');
  if (/how many|count with me|what do you think|can you tell me/i.test(msg)) strategies.push('socratic');
  if (/story|once upon|there was a/i.test(msg)) strategies.push('storytelling');
  if (/draw|picture|diagram|look at this/i.test(msg)) strategies.push('visual');
  if (/sing|rhyme|rhythm|clap/i.test(msg)) strategies.push('musical');
  if (/great job|superstar|amazing|well done|brilliant|fantastic|proud/i.test(msg)) strategies.push('praise');
  if (/step 1|step 2|first.*then.*finally/i.test(msg)) strategies.push('scaffolding');
  if (/real.?world|in real life|for example.*daily|like when you/i.test(msg)) strategies.push('real_world');
  if (/mark scheme|examiner|marks for|command word/i.test(msg)) strategies.push('exam_technique');
  if (/hint|clue|think about/i.test(msg)) strategies.push('hints');
  if (/try again|one more time|almost|close/i.test(msg)) strategies.push('encouragement');

  return strategies;
}

/**
 * Detect engagement level from the user's response to Starky.
 * High engagement = longer messages, questions, enthusiasm.
 * Low engagement = single words, dismissive.
 */
function detectEngagement(userMessage, previousStarkyLength) {
  if (!userMessage) return 'unknown';
  const msg = userMessage.trim();
  const len = msg.length;

  // High engagement signals
  if (len > 100) return 'high';
  if (/\?.*\?/g.test(msg)) return 'high'; // multiple questions
  if (/yes!|yeah!|wow|cool|amazing|haan|maza|fun/i.test(msg)) return 'high';
  if (/tell me more|what else|and then|teach me|another/i.test(msg)) return 'high';
  if (/i think|i got|let me try|my answer/i.test(msg)) return 'high';

  // Low engagement signals
  if (len < 5 && /^(ok|k|hmm|no|nah|bye|stop)$/i.test(msg.replace(/[.!?,]/g, ''))) return 'low';
  if (len < 3) return 'low';

  return 'medium';
}

/**
 * Record a teaching strategy signal — captures what Starky did AND how the student responded.
 * This is the core of the "what worked" feedback loop.
 */
export function recordStrategySignal({
  email, subject, grade, starkyResponse, userResponse,
  sessionNumber, messageIndex,
}) {
  const strategies = detectTeachingStrategy(starkyResponse);
  if (strategies.length === 0) return; // nothing interesting to log

  const engagement = detectEngagement(userResponse);

  queueSignal({
    type: 'strategy',
    email: email || 'anonymous',
    subject: subject || '',
    grade: grade || '',
    sentiment: engagement,
    metadata: {
      strategies,
      engagement,
      sessionNumber: sessionNumber || 1,
      messageIndex: messageIndex || 0,
      starkyPreview: (starkyResponse || '').substring(0, 300),
      userPreview: (userResponse || '').substring(0, 200),
    },
  });
}

export { detectSentiment, detectLanguage, detectConfusionSignal, detectTeachingStrategy, detectEngagement, flushSignals };
