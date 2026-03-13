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

export function useSessionMemory(userProfile) {
  const [sessionMemory, setSessionMemory] = useState(EMPTY_MEMORY);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Load memory on mount / when userProfile changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = getKey(userProfile);
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw);
        setSessionMemory(prev => ({
          ...EMPTY_MEMORY,
          ...saved,
          // Always start new session with fresh conversation history
          conversationHistory: [],
        }));
      } else {
        setSessionMemory(EMPTY_MEMORY);
      }
    } catch {
      setSessionMemory(EMPTY_MEMORY);
    }
  }, [userProfile?.email, userProfile?.gradeId]);

  // Persist memory to localStorage whenever it changes
  const persist = useCallback((memory) => {
    if (typeof window === 'undefined') return;
    try {
      const key = getKey(userProfile);
      localStorage.setItem(key, JSON.stringify({
        ...memory,
        lastSeen: new Date().toISOString(),
      }));
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
