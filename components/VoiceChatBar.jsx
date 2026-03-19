import { useState, useEffect, useRef } from "react";

export default function VoiceChatBar() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setSupported(true);
    }
  }, []);

  const toggleListen = () => {
    if (!supported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    // Detect user language — support English and Urdu
    const userLang = (navigator.language || '').toLowerCase();
    recognition.lang = userLang.startsWith('ur') ? 'ur-PK' : 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (transcript.trim()) {
        // Fire custom event — StarkyBubble listens for this and injects into React state
        window.dispatchEvent(new CustomEvent('starky-voice', { detail: { text: transcript.trim() } }));
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggleListen}
      title={listening ? "Stop listening" : "Speak your message"}
      aria-label={listening ? "Stop listening" : "Speak your message"}
      style={{
        position: "fixed",
        bottom: 148,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: listening ? "#ef4444" : "#4F8EF7",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        boxShadow: listening ? "0 0 0 6px rgba(239,68,68,0.3)" : "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9998,
        transition: "all 0.2s",
      }}
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}
