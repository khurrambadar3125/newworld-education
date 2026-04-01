/**
 * utils/realtimeLearning.js — Real-Time Per-Message Learning Engine
 *
 * Learns from EVERY message, not just every 5th.
 * Detects patterns, updates student profile, and feeds back into the next response.
 *
 * Three layers:
 * 1. IMMEDIATE — within the same response (inject into prompt)
 * 2. BACKGROUND — after response (save to Supabase, non-blocking)
 * 3. ACCUMULATED — builds over time (weekly cron reads these signals)
 */

/**
 * Layer 1: IMMEDIATE LEARNING — analyze student message and inject insights into prompt
 * Runs BEFORE the Anthropic API call. Adds context to the system prompt.
 * Must be fast (<50ms) — no API calls, no database queries.
 */
function getImmediateLearningInjection(message, conversationHistory, sessionMemory) {
  const insights = [];
  const msgLower = (message || '').toLowerCase();
  const history = conversationHistory || [];

  // 1. Detect repeated confusion — student asking same topic again
  const recentUserMsgs = history.filter(m => m.role === 'user').slice(-5);
  const recentTopics = recentUserMsgs.map(m => (m.content || '').toLowerCase());
  const currentWords = msgLower.split(/\s+/).filter(w => w.length > 4);
  let repeatedTopic = null;
  for (const prev of recentTopics) {
    const overlap = currentWords.filter(w => prev.includes(w)).length;
    if (overlap >= 3) { repeatedTopic = true; break; }
  }
  if (repeatedTopic) {
    insights.push('LEARNING SIGNAL: Student is asking about a similar topic AGAIN. This suggests the previous explanation did not fully land. Try a DIFFERENT approach this time — use an analogy, a diagram description, or break it into smaller pieces. Do NOT repeat the same explanation.');
  }

  // 2. Detect frustration signals
  const frustrationWords = ['i dont understand', 'i don\'t understand', 'confused', 'still confused', 'what do you mean', 'huh', 'i dont get it', 'this makes no sense', 'explain again', 'try again', 'samajh nahi aya', 'kuch samajh nahi', 'pata nahi'];
  const isFrustrated = frustrationWords.some(w => msgLower.includes(w));
  if (isFrustrated) {
    insights.push('LEARNING SIGNAL: Student is frustrated or confused. SLOW DOWN. Use simpler language. Start from the very basics. Use a real-world analogy they can relate to. Do NOT use technical vocabulary until they confirm they understand the analogy.');
  }

  // 3. Detect confidence signals
  const confidenceWords = ['i know this', 'skip', 'already know', 'move on', 'next', 'easy', 'boring'];
  const isConfident = confidenceWords.some(w => msgLower.includes(w));
  if (isConfident) {
    insights.push('LEARNING SIGNAL: Student says they already know this. Challenge them — go straight to a harder exam question. If they get it right, move on fast. If they get it wrong, their confidence was misplaced — correct gently but firmly.');
  }

  // 4. Detect language preference
  const urduWords = ['kya', 'hai', 'nahi', 'mujhe', 'batao', 'samjhao', 'ye', 'woh', 'kyun', 'kaise'];
  const urduCount = urduWords.filter(w => msgLower.includes(w)).length;
  if (urduCount >= 2) {
    insights.push('LEARNING SIGNAL: Student is mixing Urdu/Roman Urdu. Respond in English but feel free to add brief Urdu explanations in brackets for difficult concepts. Example: "Osmosis (yaani paani ka movement)..."');
  }

  // 5. Detect short/lazy answer
  if (message.trim().length < 20 && history.length > 2) {
    const lastAssistant = history.filter(m => m.role === 'assistant').pop();
    if (lastAssistant?.content?.includes('?')) {
      insights.push('LEARNING SIGNAL: Student gave a very short answer to your question. They may be disengaged or unsure. Do NOT accept a one-word answer for an explain/describe question. Push them: "Can you add one more sentence? What is the REASON for this?"');
    }
  }

  // 6. Detect student correcting Starky
  const correctionWords = ['no that\'s wrong', 'that\'s not right', 'actually', 'you\'re wrong', 'incorrect', 'no it\'s', 'wrong answer'];
  const isCorrectingStarky = correctionWords.some(w => msgLower.includes(w));
  if (isCorrectingStarky) {
    insights.push('LEARNING SIGNAL: Student is correcting you. Take this seriously. Check your previous answer. If the student is right, acknowledge it immediately: "You are correct — I should have said X." If they are wrong, explain why gently with evidence.');
  }

  if (!insights.length) return '';
  return '\n\n' + insights.join('\n\n');
}

/**
 * Layer 2: BACKGROUND LEARNING — save signals after response (non-blocking)
 * Runs AFTER the response is sent. Saves to Supabase for accumulated learning.
 */
async function saveMessageLearning(supabase, studentId, message, starkyResponse, subject, meta) {
  if (!supabase || !studentId) return;

  try {
    const msgLower = (message || '').toLowerCase();
    const signals = [];

    // Detect confusion
    const confusionWords = ['i dont understand', 'confused', 'what do you mean', 'explain again', 'huh'];
    if (confusionWords.some(w => msgLower.includes(w))) {
      signals.push({ type: 'confusion', topic: subject || 'general', message: message.slice(0, 200) });
    }

    // Detect mastery
    const masteryWords = ['i get it', 'makes sense', 'understood', 'oh i see', 'got it', 'samajh gaya'];
    if (masteryWords.some(w => msgLower.includes(w))) {
      signals.push({ type: 'mastery', topic: subject || 'general', message: message.slice(0, 200) });
    }

    // Detect Starky correction by student
    const correctionWords = ['no that\'s wrong', 'that\'s not right', 'actually it\'s', 'you\'re wrong'];
    if (correctionWords.some(w => msgLower.includes(w))) {
      signals.push({ type: 'starky_error', topic: subject || 'general', message: message.slice(0, 200), starky_response: (starkyResponse || '').slice(0, 300) });
    }

    // Save all signals
    if (signals.length > 0) {
      const rows = signals.map(s => ({
        student_id: studentId,
        signal_type: s.type,
        topic: s.topic,
        message_excerpt: s.message,
        starky_response_excerpt: s.starky_response || null,
        metadata: meta || {},
        timestamp: new Date().toISOString(),
      }));
      await supabase.from('learning_signals').insert(rows).catch(() => {});
    }
  } catch {}
}

/**
 * Layer 3: Build accumulated learning injection for a student
 * Called at chat start to inject everything we've learned about this student.
 */
function buildStudentLearningProfile(preferences) {
  if (!preferences) return '';

  const parts = [];

  if (preferences.learning_style && preferences.learning_style !== 'mixed') {
    parts.push(`This student learns best with ${preferences.learning_style} approaches.`);
  }

  if (preferences.effective_techniques?.length) {
    parts.push(`Techniques that WORK for this student: ${preferences.effective_techniques.join(', ')}. Use these.`);
  }

  if (preferences.suggested_approach) {
    parts.push(`Recommended approach: ${preferences.suggested_approach}`);
  }

  if (preferences.weak_topics?.length) {
    const topics = preferences.weak_topics.map(t => typeof t === 'string' ? t : t.topic).filter(Boolean);
    if (topics.length) parts.push(`Known WEAK TOPICS: ${topics.join(', ')}. Give extra attention and scaffolding on these.`);
  }

  if (preferences.difficulty_level === 'hard') {
    parts.push('This is a high performer — challenge them. Skip basics. Go straight to exam-level depth.');
  } else if (preferences.difficulty_level === 'easy') {
    parts.push('This student struggles. Use simpler language. More examples. More encouragement. Smaller steps.');
  }

  if (preferences.preferred_language === 'roman_urdu') {
    parts.push('Student prefers Roman Urdu. Add brief Urdu explanations in brackets.');
  }

  if (!parts.length) return '';
  return `\n\nSTUDENT LEARNING PROFILE (learned from previous sessions):\n${parts.join('\n')}`;
}

module.exports = {
  getImmediateLearningInjection,
  saveMessageLearning,
  buildStudentLearningProfile,
};
