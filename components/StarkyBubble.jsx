import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSessionMemory } from '../utils/useSessionMemory';

export default function StarkyBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Session memory ──────────────────────────────────────────────────────────
  const {
    sessionMemory,
    saveMessage,
    finalizeSession,
    hasPriorSession,
    getContinuationGreeting,
    SUMMARIZE_AFTER,
  } = useSessionMemory(userProfile);

  // Track raw conversation for summarization (user+assistant pairs, no greeting)
  const conversationRef = useRef([]);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem('nw_user');
      if (s) setUserProfile(JSON.parse(s));
    } catch {}
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceSupported(true);
    }
  }, []);

  // ── Greeting — uses prior session context if available ──────────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      const firstName = userProfile?.name?.split(' ')[0];

      // Try continuation greeting first
      const continuation = getContinuationGreeting(firstName);
      const greeting = continuation || (
        firstName
          ? `Hi ${firstName}! I'm Starky ★ — ask me anything about any subject, grade or topic. I'm here to help!`
          : `Hi! I'm Starky ★ — your personal AI tutor. Ask me anything — any subject, any grade!`
      );

      setMessages([{ role: 'assistant', content: greeting }]);
      if (voiceSupported) setTimeout(() => speakText(greeting), 400);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Finalize session when chat closes ───────────────────────────────────────
  const handleClose = useCallback(() => {
    setOpen(false);
    stopSpeaking();
    // Only summarize if there was a real conversation (more than just greeting)
    if (conversationRef.current.length >= 4) {
      finalizeSession(conversationRef.current);
    }
  }, [finalizeSession]);

  // ── Voice ───────────────────────────────────────────────────────────────────
  const speakText = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[★*_`#]/g, '').replace(/\n+/g, ' ').substring(0, 250);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.95; utt.pitch = 1.05; utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) utt.voice = v;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  }, []);

  const stopSpeaking = () => { synthRef.current?.cancel(); setIsSpeaking(false); };

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile,
          sessionMemory: {
            ...sessionMemory,
            // Pass the live conversation from this session (not stored history)
            conversationHistory: conversationRef.current.slice(-10),
          },
        }),
      });

      const data = await res.json();
      const reply = data.response || data.content || 'Something went wrong. Try again!';

      const finalMsgs = [...newMsgs, { role: 'assistant', content: reply }];
      setMessages(finalMsgs);
      if (voiceSupported) speakText(reply);

      // Save this exchange to conversation ref (for summarization)
      conversationRef.current = [
        ...conversationRef.current,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ];

      // Save to persistent memory hook
      saveMessage(text, reply);

      // Auto-summarize mid-session after SUMMARIZE_AFTER messages
      // (so next open already has context even if they don't close properly)
      if (conversationRef.current.length === SUMMARIZE_AFTER * 2) {
        finalizeSession(conversationRef.current);
      }

    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Something went wrong. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style jsx global>{`
        .starky-bubble-wrap {
          position: fixed;
          bottom: 20px;
          right: 16px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .starky-chat {
          width: 320px;
          max-width: calc(100vw - 32px);
          height: 420px;
          background: #0D1221;
          border: 1px solid rgba(79,142,247,.25);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp .25s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .starky-chat-head {
          padding: 12px 14px;
          background: linear-gradient(135deg, rgba(79,142,247,.15), rgba(124,92,191,.15));
          border-bottom: 1px solid rgba(255,255,255,.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .starky-chat-head-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .starky-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }
        .starky-chat-name {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .starky-chat-status {
          font-size: 11px;
          color: #4ade80;
          margin-top: 1px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .starky-chat-status::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
        }
        .starky-chat-actions {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .starky-action-btn {
          background: rgba(255,255,255,.08);
          border: none;
          color: rgba(255,255,255,.5);
          border-radius: 6px;
          padding: 5px 8px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
        }
        .starky-action-btn:hover { color: #fff; background: rgba(255,255,255,.12); }
        .starky-close-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,.4);
          cursor: pointer;
          font-size: 16px;
          padding: 2px 4px;
          line-height: 1;
        }
        .starky-close-btn:hover { color: #fff; }

        .starky-prior-badge {
          font-size: 10px;
          background: rgba(79,142,247,.2);
          border: 1px solid rgba(79,142,247,.3);
          color: rgba(79,142,247,.9);
          border-radius: 4px;
          padding: 2px 6px;
          margin-left: 6px;
          vertical-align: middle;
        }

        .starky-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .starky-msg {
          max-width: 85%;
          font-size: 13px;
          line-height: 1.6;
          padding: 9px 12px;
          border-radius: 14px;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .starky-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #4F8EF7, #6366F1);
          color: #fff;
          border-bottom-right-radius: 3px;
        }
        .starky-msg.assistant {
          align-self: flex-start;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.85);
          border-bottom-left-radius: 3px;
        }
        .starky-msg.typing {
          opacity: .5;
          font-style: italic;
        }

        .starky-input-row {
          padding: 8px 10px 10px;
          border-top: 1px solid rgba(255,255,255,.07);
          display: flex;
          gap: 6px;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .starky-input {
          flex: 1;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          color: #fff;
          padding: 9px 11px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          resize: none;
          max-height: 70px;
          -webkit-appearance: none;
        }
        .starky-input::placeholder { color: rgba(255,255,255,.25); }
        .starky-input:focus { border-color: rgba(79,142,247,.4); }
        .starky-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4F8EF7, #6366F1);
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .starky-send-btn:disabled { opacity: .35; cursor: not-allowed; }

        .starky-fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,.4);
          transition: transform .15s, box-shadow .15s;
          position: relative;
          -webkit-tap-highlight-color: transparent;
        }
        .starky-fab:active { transform: scale(.93); }
        .starky-fab.pulse {
          animation: fabPulse 1.5s ease-in-out infinite;
        }
        @keyframes fabPulse {
          0% { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,.4); }
          70% { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 14px rgba(79,142,247,0); }
          100% { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,0); }
        }

        .starky-fab-label {
          position: absolute;
          right: 66px;
          bottom: 50%;
          transform: translateY(50%);
          background: #0D1221;
          border: 1px solid rgba(79,142,247,.3);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 100px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
          animation: labelPop 6s ease forwards;
        }
        @keyframes labelPop {
          0% { opacity: 0; transform: translateY(50%) translateX(6px); }
          10% { opacity: 1; transform: translateY(50%) translateX(0); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .starky-fab-label::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 6px solid rgba(79,142,247,.3);
        }
      `}</style>

      <div className="starky-bubble-wrap">
        {open && (
          <div className="starky-chat">
            <div className="starky-chat-head">
              <div className="starky-chat-head-left">
                <div className="starky-avatar-small">★</div>
                <div>
                  <div className="starky-chat-name">
                    Starky
                    {hasPriorSession && <span className="starky-prior-badge">continuing</span>}
                  </div>
                  <div className="starky-chat-status">Online now</div>
                </div>
              </div>
              <div className="starky-chat-actions">
                {isSpeaking && (
                  <button className="starky-action-btn" onClick={stopSpeaking}>🔊 Stop</button>
                )}
                <Link href="/"><a className="starky-action-btn">Full Session →</a></Link>
                <button className="starky-close-btn" onClick={handleClose}>✕</button>
              </div>
            </div>
            <div className="starky-messages">
              {messages.map((m, i) => (
                <div key={i} className={`starky-msg ${m.role}`}>
                  {m.content}
                </div>
              ))}
              {loading && <div className="starky-msg assistant typing">Starky is thinking…</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="starky-input-row">
              <textarea
                ref={inputRef}
                className="starky-input"
                placeholder="Ask Starky anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <button className="starky-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>↑</button>
            </div>
          </div>
        )}

        <button
          className={`starky-fab ${pulse && !open ? 'pulse' : ''}`}
          onClick={() => { setOpen(o => !o); setPulse(false); stopSpeaking(); }}
          aria-label="Chat with Starky"
        >
          {open ? '✕' : '★'}
          {pulse && !open && <span className="starky-fab-label">Ask Starky anything!</span>}
        </button>
      </div>
    </>
  );
}
