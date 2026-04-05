/**
 * utils/journeyTracker.js — User Journey GPS
 * ─────────────────────────────────────────────────────────────────
 * Tracks where the user IS, WAS, SHOULD go, and WANTS to go.
 * Persists in localStorage. Used by all pages to provide context.
 *
 * Usage:
 *   import { useJourney } from '../utils/journeyTracker';
 *   const journey = useJourney();
 *   journey.enter('nano-teach', { subject: 'Chemistry', topic: 'Bonding', step: 2 });
 *   journey.getLastPosition(); // { page: 'nano-teach', subject: 'Chemistry', topic: 'Bonding', step: 2 }
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nw_journey';

function getJourneyData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveJourneyData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useJourney() {
  const [journey, setJourney] = useState({});

  useEffect(() => {
    setJourney(getJourneyData());
    // Auto-track page visit
    if (typeof window !== 'undefined') {
      const page = window.location.pathname.replace('/', '') || 'home';
      const params = Object.fromEntries(new URLSearchParams(window.location.search));
      const data = getJourneyData();
      data.current = { page, ...params, timestamp: Date.now() };
      data.lastVisited = data.lastVisited || {};
      data.lastVisited[page] = { ...params, timestamp: Date.now() };
      saveJourneyData(data);
    }
  }, []);

  // Record entering a page/step
  const enter = useCallback((page, context = {}) => {
    const data = getJourneyData();
    data.current = { page, ...context, timestamp: Date.now() };
    data.history = data.history || [];
    data.history.push(data.current);
    if (data.history.length > 20) data.history = data.history.slice(-20);
    // Track last position per page type
    data.positions = data.positions || {};
    data.positions[page] = { ...context, timestamp: Date.now() };
    saveJourneyData(data);
    setJourney(data);
  }, []);

  // Get where the user was last
  const getLastPosition = useCallback(() => {
    const data = getJourneyData();
    return data.current || null;
  }, []);

  // Get last position on a specific page
  const getPagePosition = useCallback((page) => {
    const data = getJourneyData();
    return data.positions?.[page] || null;
  }, []);

  // Get the recommended next action
  const getNextAction = useCallback(() => {
    const data = getJourneyData();
    const last = data.current;
    if (!last) return { action: 'start', label: 'Start Learning', href: '/learn' };

    // If they were in a teaching session, continue it
    if (last.page === 'nano-teach' && last.step < 4) {
      return {
        action: 'continue',
        label: `Continue: ${last.topic || last.subject} (Step ${last.step}/4)`,
        href: `/nano-teach?subject=${encodeURIComponent(last.subject || '')}&topic=${encodeURIComponent(last.topic || '')}&level=${encodeURIComponent(last.level || 'O Level')}`,
      };
    }

    // If they finished a topic, suggest next
    if (last.page === 'nano-teach' && last.step === 4 && last.nextTopic) {
      return {
        action: 'next',
        label: `Next Topic: ${last.nextTopic}`,
        href: `/nano-teach?subject=${encodeURIComponent(last.subject || '')}&topic=${encodeURIComponent(last.nextTopic)}&level=${encodeURIComponent(last.level || 'O Level')}`,
      };
    }

    // If they were drilling, continue
    if (last.page === 'drill') {
      return {
        action: 'continue',
        label: `Continue Drill: ${last.subject}`,
        href: `/drill?subject=${encodeURIComponent(last.subject || '')}&level=${encodeURIComponent(last.level || 'O Level')}`,
      };
    }

    // Default: go to learn
    return { action: 'learn', label: 'Today\'s Plan', href: '/learn' };
  }, []);

  // Set the user's goal
  const setGoal = useCallback((goal) => {
    const data = getJourneyData();
    data.goal = { ...goal, setAt: Date.now() };
    saveJourneyData(data);
    setJourney(data);
  }, []);

  const getGoal = useCallback(() => {
    return getJourneyData().goal || null;
  }, []);

  return {
    journey,
    enter,
    getLastPosition,
    getPagePosition,
    getNextAction,
    setGoal,
    getGoal,
  };
}
