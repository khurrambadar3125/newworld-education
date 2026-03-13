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
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const activeInput = document.querySelector("input[type=text], textarea");
      if (activeInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(activeInput, activeInput.value + transcript);
        activeInput.dispatchEvent(new Event("input", { bubbles: true }));
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
      style={{
        position: "fixed",
        bottom: 90,
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
