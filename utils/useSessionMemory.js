/**
 * useSessionMemory.js
 * Manages Starky session memory across conversations.
 *
 * Stores per-user in localStorage:
 *   - sessionSummary     — what happened in the last session (plain text, ~100 words)
 *   - conversationHistory — last 10 message pairs from current session
 *   - weakTopics          — topics the student struggled with
 *   - recentMistakes      — specific errors detected
 *   - currentSubject      — subject being studied right now
 *   - totalSessions       — how many sessions they've had
 *   - lastSeen            — ISO timestamp
 *
 * Usage in StarkyBubble:
 *   const { sessionMemory, saveMessage, saveSubject, finalizeSession } = useSessionMemory(userProfile);
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_PREFIX = 'nw_session_';
const MAX_HISTORY = 10; // message pairs to keep in context
const SUMMARIZE_AFTER = 6; // messages before triggering a summary

function getKey(userProfile) {
  // Key by email if signed in, otherwise by gradeId, otherwise generic
  const id = userProfile?.email || userProfile?.gradeId || 'guest';
  return `${STORAGE_KEY_PREFIX}${id}`;
}

const EMPTY_MEMORY = {
  sessionSummary: '',
  conversationHistory: [],
  weakTopics: [],
  recentMistakes: [],
  currentSubject: '',
  totalSessions: 0,
  lastSeen: null,
};


/**
 * detectAndSaveMistake
 * Call after every Starky reply. Analyses the exchange for correction
 * signals and auto-saves the mistake if one is detected.
 *
 * @param {string} userText       - what the student said
 * @param {string} starkyReply    - what Starky replied
 * @param {string} subject        - current subject (e.g. "Biology")
 * @param {function} addMistake   - from useSessionMemory
 * @param {function} addWeakTopic - from useSessionMemory
 */
export function detectAndSaveMistake(userText, starkyReply, subject, addMistake, addWeakTopic) {
  if (!userText || !starkyReply || !addMistake) return;

  const reply = starkyReply.toLowerCase();

  // Signals that Starky is correcting the student
  const correctionSignals = [
    'not quite',
    'close, but',
    'close but',
    'almost — ',
    'almost, but',
    'actually,',
    'actually —',
    'careful here',
    'common mistake',
    'lot of students get this wrong',
    'easy to confuse',
    'the correct answer',
    'the right answer',
    'not exactly',
    'let me show you a different way',
    'interesting — let me',
    "that's not quite right",
    'not quite right',
    "you've mixed up",
    'you mixed up',
    "don't confuse",
    'be careful not to confuse',
  ];

  const hasCorrectionSignal = correctionSignals.some(s => reply.includes(s));
  if (!hasCorrectionSignal) return;

  // Try to extract what topic the mistake is about
  // 1. Use the subject if we have it
  // 2. Try to pull a noun phrase from the user's question
  let topic = subject || 'General';
  let description = '';

  // Pull the first meaningful noun phrase from user's message (up to 5 words)
  const userWords = userText.trim().replace(/[?!.]/g, '').split(' ');
  if (userWords.length >= 2 && userWords.length <= 12) {
    // If the user asked a short question, the topic IS the question
    topic = subject ? `${subject} — ${userText.trim().slice(0, 60)}` : userText.trim().slice(0, 60);
  }

  // Pull description from Starky's correction (first sentence that contains a signal)
  const sentences = starkyReply.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  for (const sentence of sentences) {
    if (correctionSignals.some(s => sentence.toLowerCase().includes(s))) {
      description = sentence.slice(0, 120);
      break;
    }
  }
  if (!description) description = starkyReply.slice(0, 120);

  addMistake(topic, description);
  if (addWeakTopic && subject) addWeakTopic(subject);
}

export function useSessionMemory(userProfile) {
  const [sessionMemory, setSessionMemory] = useState(EMPTY_MEMORY);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Load memory on mount / when userProfile changes
  useEffect(() => {
    (async () => {
    if (typeof window === 'undefined') return;
    try {
      const key = getKey(userProfile);
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw);
        setSessionMemory(prev => ({
          ...EMPTY_MEMORY,
          ...saved,
          conversationHistory: [],
        }));
      } else {
        setSessionMemory(EMPTY_MEMORY);
      }
      // Also load from KV if signed in (overrides localStorage with server truth)
      if (userProfile?.email) {
        try {
          const res = await fetch(`/api/student-memory?email=${encodeURIComponent(userProfile.email)}`);
          if (res.ok) {
            const { memory } = await res.json();
            if (memory) {
              setSessionMemory(prev => ({
                ...EMPTY_MEMORY,
                ...memory,
                conversationHistory: [],
              }));
              localStorage.setItem(key, JSON.stringify(memory));
            }
          }
        } catch {}
      }
    } catch {
      setSessionMemory(EMPTY_MEMORY);
    }
    })();
  }, [userProfile?.email, userProfile?.gradeId]);

  // Persist memory to localStorage whenever it changes
  const persist = useCallback((memory) => {
    if (typeof window === 'undefined') return;
    try {
      const key = getKey(userProfile);
      const toSave = { ...memory, lastSeen: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(toSave));
      // Sync to KV if signed in
      if (userProfile?.email) {
        fetch('/api/student-memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userProfile.email, memory: toSave }),
        }).catch(() => {});
      }
    } catch {}
  }, [userProfile]);

  /**
   * Call after each message pair (user + assistant).
   * Keeps the last MAX_HISTORY pairs in context.
   */
  const saveMessage = useCallback((userText, assistantText) => {
    setSessionMemory(prev => {
      const newHistory = [
        ...prev.conversationHistory,
        { role: 'user', content: userText },
        { role: 'assistant', content: assistantText },
      ].slice(-MAX_HISTORY * 2); // keep last N pairs

      const updated = { ...prev, conversationHistory: newHistory };
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Update the current subject being studied.
   */
  const saveSubject = useCallback((subject) => {
    if (!subject) return;
    setSessionMemory(prev => {
      const updated = { ...prev, currentSubject: subject };
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Add a weak topic detected during the session.
   */
  const addWeakTopic = useCallback((topic) => {
    if (!topic) return;
    setSessionMemory(prev => {
      const existing = prev.weakTopics || [];
      if (existing.includes(topic)) return prev;
      const updated = {
        ...prev,
        weakTopics: [...existing, topic].slice(-10), // keep last 10
      };
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Add a specific mistake detected.
   * @param {string} topic - e.g. "Moles calculation"
   * @param {string} description - e.g. "Confuses molar mass with Mr"
   */
  const addMistake = useCallback((topic, description) => {
    if (!topic) return;
    setSessionMemory(prev => {
      const existing = prev.recentMistakes || [];
      // Don't duplicate same topic
      const filtered = existing.filter(m => m.topic !== topic);
      const updated = {
        ...prev,
        recentMistakes: [...filtered, { topic, description, ts: Date.now() }].slice(-8),
      };
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Call when the chat closes or after SUMMARIZE_AFTER messages.
   * Calls /api/summarize to generate a plain-text summary.
   * Saves it so the next session starts with context.
   */
  const finalizeSession = useCallback(async (conversationHistory) => {
    if (!conversationHistory?.length || isSummarizing) return;
    const msgCount = conversationHistory.length;
    if (msgCount < 4) return; // not worth summarizing very short sessions

    setIsSummarizing(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: conversationHistory.slice(-20), // last 20 messages
          userProfile,
        }),
      });
      if (!res.ok) return;
      const { summary, weakTopics, currentSubject } = await res.json();

      setSessionMemory(prev => {
        const updated = {
          ...prev,
          sessionSummary: summary || prev.sessionSummary,
          weakTopics: weakTopics?.length ? weakTopics : prev.weakTopics,
          currentSubject: currentSubject || prev.currentSubject,
          totalSessions: (prev.totalSessions || 0) + 1,
          conversationHistory: [], // clear for next session
        };
        persist(updated);
        return updated;
      });
    } catch {
      // Silently fail — session still works without summary
    } finally {
      setIsSummarizing(false);
    }
  }, [userProfile, isSummarizing, persist]);

  /**
   * Clears all memory for this user (e.g. on sign out).
   */
  const clearMemory = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(getKey(userProfile));
    } catch {}
    setSessionMemory(EMPTY_MEMORY);
  }, [userProfile]);

  /**
   * Returns true if this student has a previous session to continue.
   */
  const hasPriorSession = Boolean(
    sessionMemory.sessionSummary ||
    sessionMemory.weakTopics?.length ||
    sessionMemory.currentSubject
  );

  /**
   * Returns a "continuing" greeting if there's prior context.
   */
  const getContinuationGreeting = useCallback((firstName) => {
    const name = firstName || 'there';
    if (!hasPriorSession) return null;

    const parts = [];
    if (sessionMemory.currentSubject) {
      parts.push(`last time we were working on ${sessionMemory.currentSubject}`);
    }
    if (sessionMemory.weakTopics?.length) {
      parts.push(`you were finding ${sessionMemory.weakTopics.slice(-2).join(' and ')} tricky`);
    }

    if (!parts.length) return null;
    return `Welcome back ${name}! ${parts.join(', ')}. Want to pick up where we left off?`;
  }, [sessionMemory, hasPriorSession]);

  return {
    sessionMemory,
    saveMessage,
    saveSubject,
    addWeakTopic,
    addMistake,
    finalizeSession,
    clearMemory,
    hasPriorSession,
    getContinuationGreeting,
    isSummarizing,
    SUMMARIZE_AFTER,
  };
}
