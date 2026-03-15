import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSessionMemory, detectAndSaveMistake } from '../utils/useSessionMemory';

export default function StarkyBubble() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [kidMode, setKidMode] = useState(false);
  const [imageData, setImageData] = useState(null);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const {
    sessionMemory,
    saveMessage,
    addMistake,
    addWeakTopic,
    finalizeSession,
    hasPriorSession,
    getContinuationGreeting,
    SUMMARIZE_AFTER,
  } = useSessionMemory(userProfile);

  const conversationRef = useRef([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('nw_user');
      if (s) setUserProfile(JSON.parse(s));
    } catch {}
    const t = setTimeout(() => setPulse(false), 6000);
    // Listen for scan event from homepage
    const onScan = () => {
      setOpen(true); setFullscreen(true); setPulse(false);
      setTimeout(() => { if (cameraInputRef.current) cameraInputRef.current.click(); }, 400);
    };
    window.addEventListener('starky-scan', onScan);
    return () => { clearTimeout(t); window.removeEventListener('starky-scan', onScan); };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceSupported(true);
    }
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      const firstName = userProfile?.name?.split(' ')[0];
      const name = firstName || 'there';

      // Build proactive greeting based on memory
      let greeting = null;

      if (sessionMemory?.recentMistakes?.length) {
        // Student has known mistakes — lead with targeted help
        const latest = sessionMemory.recentMistakes[sessionMemory.recentMistakes.length - 1];
        greeting = `Welcome back ${name}! ★ Last time you found **${latest.topic}** tricky. Want to tackle that first? I have a new way to explain it.`;
      } else if (sessionMemory?.weakTopics?.length) {
        // Student has weak topics — suggest the most recent
        const topic = sessionMemory.weakTopics[sessionMemory.weakTopics.length - 1];
        greeting = `Hey ${name}! ★ You've been working on **${topic}** — want to do a quick drill to sharpen it up today?`;
      } else if (sessionMemory?.currentSubject) {
        // Student has a subject in progress — continue it
        greeting = `Welcome back ${name}! ★ We were working on **${sessionMemory.currentSubject}**. Ready to pick up where we left off?`;
      } else if (sessionMemory?.totalSessions > 0) {
        // Returning student but no specific memory
        greeting = getContinuationGreeting(firstName) || `Welcome back ${name}! ★ Great to see you again. What are we studying today?`;
      } else {
        // First time or guest
        greeting = firstName
          ? `Hi ${firstName}! I'm Starky ★ — ask me anything about any subject, grade or topic. I'm here to help!`
          : `Hi! I'm Starky ★ — your personal tutor. Ask me anything — any subject, any grade!`;
      }
      setMessages([{ role: 'assistant', content: greeting }]);
      if (voiceSupported) setTimeout(() => speakText(greeting), 400);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFullscreen(false);
    stopSpeaking();
    if (conversationRef.current.length >= 4) {
      finalizeSession(conversationRef.current);
    }
  }, [finalizeSession]);

  const speakText = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[★*_`#]/g, '').replace(/\n+/g, ' ').substring(0, 250);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.95; utt.pitch = kidMode ? 1.2 : 1.05; utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) utt.voice = v;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  }, [kidMode]);

  const stopSpeaking = () => { synthRef.current?.cancel(); setIsSpeaking(false); };

  const pendingImageRef = useRef(null);

  const handleImageFile = (file, autoSend = false) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = {
        base64: ev.target.result.split(',')[1],
        type: file.type,
        name: file.name,
      };
      setImageData(data);
      // Auto-send: camera captures should immediately trigger Starky to read the image
      if (autoSend) {
        pendingImageRef.current = data;
        // Use setTimeout to let state update, then trigger send
        setTimeout(() => sendWithImage(data), 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e) => handleImageFile(e.target.files?.[0], false);  // gallery = manual send
  const handleCameraSelect = (e) => handleImageFile(e.target.files?.[0], true);  // camera = auto-send
  const clearImage = () => {
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Direct image send — used by camera auto-capture
  const sendWithImage = async (imgData) => {
    if (loading) return;
    const img = imgData || imageData;
    if (!img) return;

    const displayText = `📷 ${img.name}`;
    const userMsg = { role: 'user', content: displayText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    stopSpeaking();

    try {
      const body = {
        message: `The student just took a photo of something from their studies. Read this image thoroughly and comprehensively. Identify EXACTLY what it shows — the subject, topic, chapter, specific concepts, any questions visible, any handwriting or text. Then respond with:
1. A clear statement of what you see: "I can see [specific content]"
2. The subject and topic it belongs to
3. Immediately offer to help — suggest 2-3 things you can do with this (explain the concept, quiz them, solve a visible question, create practice questions on this topic, or help them understand their notes better)
Be specific and knowledgeable — show you deeply understand the content, not just that you see an image.`,
        userProfile,
        kidMode,
        sessionMemory: {
          ...sessionMemory,
          conversationHistory: conversationRef.current.slice(-10),
        },
        imageBase64: img.base64,
        imageMediaType: img.type,
      };

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const reply = data.response || data.content || 'Something went wrong. Try again!';

      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
      setImageData(null);
      pendingImageRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (voiceSupported) speakText(reply);

      conversationRef.current = [
        ...conversationRef.current,
        { role: 'user', content: displayText },
        { role: 'assistant', content: reply },
      ];
      saveMessage(displayText, reply);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Something went wrong. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && !imageData) || loading) return;

    const displayText = text || (imageData ? `📷 ${imageData.name}` : '');
    const userMsg = { role: 'user', content: displayText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    stopSpeaking();

    try {
      const body = {
        message: text || `The student sent an image. Read it thoroughly and comprehensively. Identify what it shows — subject, topic, concepts, any questions or text visible. Then offer to help with it.`,
        userProfile,
        kidMode,
        sessionMemory: {
          ...sessionMemory,
          conversationHistory: conversationRef.current.slice(-10),
        },
      };
      if (imageData) {
        body.imageBase64 = imageData.base64;
        body.imageMediaType = imageData.type;
      }

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const reply = data.response || data.content || 'Something went wrong. Try again!';

      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
      setImageData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (voiceSupported) speakText(reply);

      conversationRef.current = [
        ...conversationRef.current,
        { role: 'user', content: displayText },
        { role: 'assistant', content: reply },
      ];

      saveMessage(displayText, reply);

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
          width: 340px;
          max-width: calc(100vw - 32px);
          height: 460px;
          background: #0D1221;
          border: 1px solid rgba(79,142,247,.25);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp .25s ease;
          transition: all 0.3s ease;
        }

        .starky-chat.fullscreen {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw;
          height: 100dvh;
          max-width: 100vw;
          border-radius: 0;
          z-index: 10000;
          animation: none;
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
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .starky-chat-name {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; color: #fff;
        }
        .starky-chat-status {
          font-size: 11px; color: #4ade80; margin-top: 1px;
          display: flex; align-items: center; gap: 4px;
        }
        .starky-chat-status::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; display: inline-block;
        }
        .starky-chat-actions {
          display: flex; gap: 6px; align-items: center;
        }
        .starky-action-btn {
          background: rgba(255,255,255,.08); border: none;
          color: rgba(255,255,255,.5); border-radius: 6px;
          padding: 5px 8px; font-size: 12px; cursor: pointer;
          white-space: nowrap; text-decoration: none; display: inline-block;
        }
        .starky-action-btn:hover { color: #fff; background: rgba(255,255,255,.12); }
        .starky-action-btn.kid-on { background: rgba(255,200,0,.15); color: #FFC800; border: 1px solid rgba(255,200,0,.3); }
        .starky-close-btn {
          background: none; border: none; color: rgba(255,255,255,.4);
          cursor: pointer; font-size: 16px; padding: 2px 4px; line-height: 1;
        }
        .starky-close-btn:hover { color: #fff; }
        .starky-prior-badge {
          font-size: 10px; background: rgba(79,142,247,.2);
          border: 1px solid rgba(79,142,247,.3); color: rgba(79,142,247,.9);
          border-radius: 4px; padding: 2px 6px; margin-left: 6px; vertical-align: middle;
        }
        .starky-messages {
          flex: 1; overflow-y: auto; padding: 12px;
          display: flex; flex-direction: column; gap: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .starky-chat.fullscreen .starky-messages {
          padding: 16px; max-width: 700px; width: 100%; margin: 0 auto;
        }
        .starky-msg {
          max-width: 85%; font-size: 15px; line-height: 1.7;
          padding: 10px 13px; border-radius: 14px;
          word-break: break-word; white-space: pre-wrap;
          letter-spacing: 0.01em;
        }
        .starky-chat.fullscreen .starky-msg { font-size: 17px; padding: 12px 16px; max-width: 75%; }
        .starky-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #4F8EF7, #6366F1);
          color: #fff; border-bottom-right-radius: 3px;
        }
        .starky-msg.assistant {
          align-self: flex-start;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.92); border-bottom-left-radius: 3px;
        }
        .starky-msg.typing { opacity: .5; font-style: italic; }
        .starky-input-row {
          padding: 8px 10px 10px;
          border-top: 1px solid rgba(255,255,255,.07);
          display: flex; flex-wrap: wrap; gap: 6px;
          align-items: flex-end; flex-shrink: 0;
        }
        .starky-chat.fullscreen .starky-input-row {
          padding: 12px 16px 16px; max-width: 700px; width: 100%; margin: 0 auto;
        }
        .starky-input {
          flex: 1; min-width: 0;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px; color: #fff;
          padding: 9px 11px; font-size: 14px;
          font-family: inherit; outline: none;
          resize: none; max-height: 80px; -webkit-appearance: none;
        }
        .starky-chat.fullscreen .starky-input { font-size: 16px; padding: 12px 14px; }
        .starky-input::placeholder { color: rgba(255,255,255,.25); }
        .starky-input:focus { border-color: rgba(79,142,247,.4); }
        .starky-send-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #4F8EF7, #6366F1);
          border: none; color: #fff; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .starky-send-btn:disabled { opacity: .35; cursor: not-allowed; }
        .starky-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,.08); border: none;
          color: rgba(255,255,255,.7); font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .starky-icon-btn:hover { background: rgba(255,255,255,.15); color: #fff; }
        .starky-img-preview {
          width: 100%; font-size: 12px; color: rgba(255,255,255,.7);
          padding: 4px 8px; background: rgba(255,255,255,.1);
          border-radius: 6px; display: flex; align-items: center; gap: 8px;
        }
        .starky-img-preview button {
          background: none; border: none; color: rgba(255,255,255,.6);
          cursor: pointer; font-size: 14px; margin-left: auto;
        }
        .starky-fab {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,.4);
          transition: transform .15s, box-shadow .15s;
          position: relative; -webkit-tap-highlight-color: transparent;
        }
        .starky-fab:active { transform: scale(.93); }
        .starky-fab.pulse { animation: fabPulse 1.5s ease-in-out infinite; }
        @keyframes fabPulse {
          0%   { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,.4); }
          70%  { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 14px rgba(79,142,247,0); }
          100% { box-shadow: 0 4px 20px rgba(79,142,247,.45), 0 0 0 0 rgba(79,142,247,0); }
        }
        .starky-fab-label {
          position: absolute; right: 66px; bottom: 50%;
          transform: translateY(50%);
          background: #0D1221; border: 1px solid rgba(79,142,247,.3);
          color: #fff; font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 700; padding: 6px 12px;
          border-radius: 100px; white-space: nowrap; pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
          animation: labelPop 6s ease forwards;
        }
        @keyframes labelPop {
          0%   { opacity: 0; transform: translateY(50%) translateX(6px); }
          10%  { opacity: 1; transform: translateY(50%) translateX(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .starky-fab-label::after {
          content: ''; position: absolute; right: -6px; top: 50%;
          transform: translateY(-50%); width: 0; height: 0;
          border-top: 5px solid transparent; border-bottom: 5px solid transparent;
          border-left: 6px solid rgba(79,142,247,.3);
        }
        /* Accessibility: reduce motion for vestibular/seizure sensitivity */
        @media (prefers-reduced-motion: reduce) {
          .starky-fab.pulse { animation: none; }
          .starky-fab-label { animation: none; opacity: 1; }
          .starky-chat { animation: none; }
          .starky-msg, .starky-fab, .starky-chat { transition: none; }
        }
      `}</style>

      <div className="starky-bubble-wrap">
        {open && (
          <div className={`starky-chat${fullscreen ? ' fullscreen' : ''}`}>
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
                <button
                  className={`starky-action-btn${kidMode ? ' kid-on' : ''}`}
                  onClick={() => setKidMode(k => !k)}
                  title="Kid mode — simpler language"
                >👦 {kidMode ? 'Kid ON' : 'Kid'}</button>
                <button
                  className="starky-action-btn"
                  onClick={() => setFullscreen(f => !f)}
                  title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >{fullscreen ? '⊠' : '⤢'}</button>
                <Link href="/"><a className="starky-action-btn">Full Session →</a></Link>
                <button className="starky-close-btn" onClick={handleClose}>✕</button>
              </div>
            </div>

            <div className="starky-messages" role="log" aria-label="Chat with Starky" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`starky-msg ${m.role}`} aria-label={m.role === 'assistant' ? 'Starky says' : 'You said'}>{m.content}</div>
              ))}
              {loading && <div className="starky-msg assistant typing" aria-live="assertive">Starky is thinking…</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="starky-input-row">
              {imageData && (
                <div className="starky-img-preview">
                  <span>📎 {imageData.name}</span>
                  <button onClick={clearImage}>✕</button>
                </div>
              )}
              {/* Hidden file inputs */}
              <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageSelect} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={handleCameraSelect} />
              {/* 📎 Gallery */}
              <button className="starky-icon-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">📎</button>
              {/* 📷 Camera */}
              <button className="starky-icon-btn" onClick={() => cameraInputRef.current?.click()} title="Take photo">📷</button>
              <textarea
                ref={inputRef}
                className="starky-input"
                placeholder="Ask Starky anything…"
                aria-label="Type your message to Starky"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <button className="starky-send-btn" onClick={sendMessage} disabled={loading || (!input.trim() && !imageData)}>↑</button>
            </div>
          </div>
        )}

        {!fullscreen && (
          <button
            className={`starky-fab ${pulse && !open ? 'pulse' : ''}`}
            onClick={() => { setOpen(o => !o); setFullscreen(true); setPulse(false); stopSpeaking(); }}
            aria-label="Chat with Starky"
          >
            {open ? '✕' : '★'}
            {pulse && !open && <span className="starky-fab-label">Ask Starky anything!</span>}
          </button>
        )}
      </div>
    </>
  );
}
