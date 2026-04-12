/**
 * utils/useVoice.js
 * Shared voice hooks for SEN pages — voice input + text-to-speech.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// Young learner detection — KG to Grade 5 get kid mode voice (slower + higher pitch).
// Reads from explicit gradeId arg, else falls back to localStorage nw_user.grade.id.
const YOUNG_GRADES = ['kg', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5'];
export function isYoungLearner(gradeId) {
  if (gradeId) return YOUNG_GRADES.includes(String(gradeId).toLowerCase());
  if (typeof window === 'undefined') return false;
  try {
    const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
    const gId = user?.grade?.id;
    return gId ? YOUNG_GRADES.includes(String(gId).toLowerCase()) : false;
  } catch {
    return false;
  }
}

/**
 * Voice INPUT — SpeechRecognition for children who can't type.
 * @param {function} setInput — React state setter for the text input
 * @returns {{ listening, supported, toggle }}
 */
export function useVoiceInput(setInput) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) setSupported(true);
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) setInput(prev => (prev ? prev + ' ' : '') + t);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, setInput]);

  return { listening, supported, toggle };
}

/**
 * Text-to-speech OUTPUT — Starky speaks responses aloud.
 * @returns {{ speak, stop, speaking, supported }}
 */
export function useSpeakText() {
  const synthRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
    }
  }, []);

  const speak = useCallback((text, opts = {}) => {
    if (!synthRef.current || !text) return;
    synthRef.current.cancel();
    const clean = text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')  // strip ALL emojis
      .replace(/[\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')  // variation selectors, joiners, tags
      .replace(/[★*_`#]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 500);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'en-US'; // Always English for SEN pages — never accented
    // Kid mode: young learners (KG–Grade 5) and SEN callers get slower + higher pitch.
    // SEN pages are the original callers and should always stay in kid mode by default.
    const kid = opts.kidMode != null ? !!opts.kidMode : (opts.gradeId ? isYoungLearner(opts.gradeId) : true);
    utt.rate = kid ? 0.85 : 0.95;
    utt.pitch = kid ? 1.2 : 1.05;
    utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.name.includes('Google US English'))
      || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
    if (v) utt.voice = v;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    synthRef.current.speak(utt);
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
