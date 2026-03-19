/**
 * utils/useVoice.js
 * Shared voice hooks for SEN pages — voice input + text-to-speech.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

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

  const speak = useCallback((text) => {
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
    utt.rate = 0.85;
    utt.pitch = 1.1;
    utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith('en')) || voices[0];
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
