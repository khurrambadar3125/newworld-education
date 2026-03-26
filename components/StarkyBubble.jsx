import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSessionMemory, detectAndSaveMistake } from '../utils/useSessionMemory';
import { useTheme } from '../pages/_app';
import { useSessionLimit, LimitReachedModal } from '../utils/useSessionLimit';
import { recordMessageSignal, recordMoodSignal, recordDropoffSignal, recordStrategySignal, detectSentiment } from '../utils/signalCollector';
import { checkContentViolation } from '../utils/contentProtection';

// Format Starky's messages — lightweight markdown rendering for mobile readability
function formatStarkyMsg(text) {
  if (!text) return '<span style="opacity:0.4">...</span>';
  if (text === '...') return '<span style="opacity:0.4;animation:pulse 1.5s ease-in-out infinite">Starky is typing...</span>';
  let html = text
    // Escape HTML entities first (prevent XSS)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Headings: # text → bold large text (strip the #)
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong style="font-size:1.1em">$1</strong>')
    // Bold: **text** → <strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em> (but not inside **)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    // Inline code: `text` → styled span
    .replace(/`([^`]+)`/g, '<code style="background:rgba(79,142,247,0.15);padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
    // Numbered lists: "1. " at start of line
    .replace(/^(\d+)\.\s+/gm, '<span style="color:#4F8EF7;font-weight:700">$1.</span> ')
    // Bullet points: "- " at start of line
    .replace(/^[-•]\s+/gm, '<span style="color:#4F8EF7">•</span> ')
    // Line breaks
    .replace(/\n/g, '<br>');
  return html;
}

export default function StarkyBubble() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(true); // Always open fullscreen by default
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [kidMode, setKidMode] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const micRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { limitReached, recordCall } = useSessionLimit(userProfile?.email);
  const loadingRef = useRef(false);
  const messagesRef = useRef([]);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pendingVoiceRef = useRef(null);
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
    // Listen for voice transcript from VoiceChatBar
    const onVoice = (e) => {
      const text = e.detail?.text;
      if (!text) return;
      // Store the voice text in a ref so sendMessage can pick it up
      pendingVoiceRef.current = text;
      setOpen(true); setPulse(false);
      setInput(text);
    };
    window.addEventListener('starky-voice', onVoice);
    return () => { clearTimeout(t); window.removeEventListener('starky-scan', onScan); window.removeEventListener('starky-voice', onVoice); };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceSupported(true);
    }
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSttSupported(true);
    }
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      (async () => {
      const firstName = userProfile?.name?.split(' ')[0];
      const name = firstName || 'there';

      // Check if parent set an assignment or feedback (KV cross-device + localStorage fallback)
      let assignment = null;
      let parentFeedback = null;
      try {
        // Try KV first (cross-device — parent at office, child at home)
        if (userProfile?.email) {
          const res = await fetch(`/api/assignment?email=${encodeURIComponent(userProfile.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.assignment) assignment = data.assignment;
            if (data.feedback) parentFeedback = data.feedback;
          }
        }
        // Fallback: localStorage (same-device parent portal)
        if (!assignment) {
          const activeChild = JSON.parse(localStorage.getItem('nw_active_child') || 'null');
          const childId = activeChild?.id || userProfile?.email || 'guest';
          const raw = localStorage.getItem(`nw_assignment_${childId}`);
          if (raw) {
            assignment = JSON.parse(raw);
            localStorage.removeItem(`nw_assignment_${childId}`);
          }
        }
      } catch {}

      // Read streak data for richer greetings
      let streakDays = 0;
      try {
        const streakRaw = localStorage.getItem('nw_streak');
        if (streakRaw) {
          const sd = JSON.parse(streakRaw);
          streakDays = sd?.current || 0;
        }
      } catch {}
      const streakMsg = streakDays >= 7 ? `\n\n🔥 **${streakDays} day streak!** You're on fire — keep it going!`
        : streakDays >= 3 ? `\n\n🔥 ${streakDays} day streak! Keep it up!`
        : '';

      // Build proactive greeting based on memory
      let greeting = null;

      if (assignment && parentFeedback) {
        greeting = `Welcome back ${name}! ★\n\n💬 **Message from ${parentFeedback.from}:** "${parentFeedback.feedback}"\n\n📋 **Today's assignment:** ${assignment.topic}\n\nLet's tackle this together! Say "start" and I'll begin teaching you step by step.`;
      } else if (assignment) {
        greeting = `Welcome back ${name}! ★ ${assignment.setBy || 'Your parent'} asked you to work on: **${assignment.topic}**\n\nLet's tackle this together! Ask me anything about it, or say "start" and I'll begin teaching you step by step.`;
      } else if (parentFeedback) {
        greeting = `Welcome back ${name}! ★\n\n💬 **Message from ${parentFeedback.from}:** "${parentFeedback.feedback}"\n\nWhat would you like to work on today?`;
      } else if (sessionMemory?.nextGoals?.length) {
        // AI-recommended next steps from last session analysis
        greeting = `Welcome back ${name}! ★ Based on our last session, I'd recommend working on: **${sessionMemory.nextGoals[0]}**\n\nWant to start there, or something else?${streakMsg}`;
      } else if (sessionMemory?.recentMistakes?.length) {
        const latest = sessionMemory.recentMistakes[sessionMemory.recentMistakes.length - 1];
        greeting = `Welcome back ${name}! ★ Last time you found **${latest.topic}** tricky. Want to tackle that first? I have a new way to explain it.${streakMsg}`;
      } else if (sessionMemory?.weakTopics?.length) {
        const topic = sessionMemory.weakTopics[sessionMemory.weakTopics.length - 1];
        greeting = `Hey ${name}! ★ You've been working on **${topic}** — want to do a quick drill to sharpen it up today?${streakMsg}`;
      } else if (sessionMemory?.currentSubject) {
        greeting = `Welcome back ${name}! ★ We were working on **${sessionMemory.currentSubject}**. Ready to pick up where we left off?${streakMsg}`;
      } else if (sessionMemory?.totalSessions > 0) {
        greeting = getContinuationGreeting(firstName) || `Welcome back ${name}! ★ Great to see you again. What are we studying today?`;
        greeting += streakMsg;
      } else {
        // First time or guest — explain what Starky is
        const isParentUser = userProfile?.role === 'parent';
        const urduLine = isParentUser ? '\n\nاردو میں بھی پوچھ سکتے ہو 🇵🇰' : '';
        // Tailor the greeting to the student's grade — don't mention Cambridge to a Grade 6 student
        const gradeId = (userProfile?.gradeId || '').toLowerCase();
        const isYoung = ['kg','grade1','grade2','grade3','grade4','grade5'].includes(gradeId);
        const isMiddle = ['grade6','grade7','grade8','grade9','grade10'].includes(gradeId);
        const isOLevel = gradeId.includes('olevel');
        const isALevel = gradeId.includes('alevel') || gradeId === 'grade11' || gradeId === 'grade12';

        if (isYoung) {
          greeting = firstName
            ? `Hi ${firstName}! 👋🌟\n\nI'm Starky — your learning star! What do you want to learn? Tap one! 👇`
            : `Hi! 👋🌟\n\nI'm Starky — your learning star! What do you want to learn? Tap one! 👇`;
        } else if (isMiddle) {
          const isMatricGrade = ['grade9','grade10'].includes(gradeId);
          greeting = isMatricGrade
            ? (firstName
              ? `Hey ${firstName}! Starky here ★\n\nI know your board syllabus — every numerical, every definition, every diagram pattern. Ask me anything or photograph your notes.\n\nRoman Urdu mein bhi pooch sakte ho 🇵🇰`
              : `Hey! Starky here ★\n\nI know your entire board syllabus. Ask me anything, photograph your notes, or say "quiz me".\n\nRoman Urdu mein bhi pooch sakte ho 🇵🇰`)
            : (firstName
              ? `Hey ${firstName}! I'm Starky ★\n\nI know your syllabus inside out. Ask me anything, photograph your textbook, or say "quiz me".\n\nاردو میں بھی پوچھ سکتے ہو 🇵🇰`
              : `Hey! I'm Starky ★\n\nI know every syllabus — ask me anything or photograph your homework!\n\nاردو میں بھی پوچھ سکتے ہو 🇵🇰`);
        } else {
          // O Level, A Level, or unknown — Cambridge-focused
          greeting = firstName
            ? `Hey ${firstName}! Starky here ★\n\nEvery Cambridge past paper, mark scheme, and examiner report — 1994 to 2024. I know what gets A*s.\n\nAsk me anything, photograph your notes, or say "quiz me".${urduLine}`
            : `Hey! Starky here ★\n\nEvery Cambridge past paper from 1994 to 2024. Mark schemes, examiner reports, command words — all of it.\n\nAsk me anything or photograph your homework.${urduLine}`;
        }
      }
      setMessages([{ role: 'assistant', content: greeting }]);
      })(); // end async IIFE
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messagesRef.current = messages;
    // Auto-send voice text once chat is open and greeting has loaded
    if (pendingVoiceRef.current && messages.length > 0 && !loading && !loadingRef.current) {
      setTimeout(() => sendMessage(), 100);
    }
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
    const clean = text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')  // strip ALL emojis
      .replace(/[\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')  // variation selectors, joiners, tags
      .replace(/[★*_`#]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 250);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'en-US'; // ALWAYS English for Starky main chat — never accented
    utt.rate = 0.95; utt.pitch = kidMode ? 1.2 : 1.05; utt.volume = 1;
    const voices = synthRef.current.getVoices();
    // Prefer Google/Microsoft English neural voices, then any en-US, then any English
    const v = voices.find(v => v.name.includes('Google US English'))
      || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('en'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
    if (v) utt.voice = v;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  }, [kidMode]);

  const stopSpeaking = () => { synthRef.current?.cancel(); setIsSpeaking(false); };

  const pendingImageRef = useRef(null);

  // Resize image using createImageBitmap (iOS 15+, all modern browsers)
  // Falls back to direct FileReader if not supported
  const processImage = async (file) => {
    try {
      // createImageBitmap works on iOS 15+ and doesn't need Image() or createObjectURL
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(file);
        const MAX = 800;
        let w = bitmap.width, h = bitmap.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
        bitmap.close();
        const b64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        if (b64 && b64.length > 100) {
          return { base64: b64, type: 'image/jpeg', name: 'photo.jpg' };
        }
      }
    } catch (e) {
      console.warn('[StarkyBubble] createImageBitmap failed, using FileReader:', e.message);
    }
    // Fallback: Image() → canvas conversion (handles HEIC → JPEG properly)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        // Try canvas conversion to ensure valid JPEG output
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX = 800;
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
              if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
              else { w = Math.round(w * MAX / h); h = MAX; }
            }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const b64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
            if (b64 && b64.length > 100) {
              resolve({ base64: b64, type: 'image/jpeg', name: 'photo.jpg' });
              return;
            }
          } catch {}
          // Final fallback — use raw base64 (only for supported types)
          const b64 = dataUrl.split(',')[1];
          if (!b64 || b64.length < 50) { resolve(null); return; }
          let type = file.type || 'image/jpeg';
          if (!['image/jpeg','image/png','image/gif','image/webp'].includes(type)) type = 'image/jpeg';
          resolve({ base64: b64, type, name: file.name || 'photo.jpg' });
        };
        img.onerror = () => {
          // Image couldn't load (truly unsupported format) — try raw
          const b64 = dataUrl.split(',')[1];
          if (!b64 || b64.length < 50) { resolve(null); return; }
          resolve({ base64: b64, type: 'image/jpeg', name: file.name || 'photo.jpg' });
        };
        img.src = dataUrl;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file, autoSend) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Image too large (max 8MB). Try taking a closer photo.');
      return;
    }
    const data = await processImage(file);
    if (!data) { alert('Could not read that image. Please try again.'); return; }
    setImageData(data);
    if (autoSend) {
      pendingImageRef.current = data;
      setTimeout(() => sendWithImage(data), 500);
    }
  };

  const handleImageSelect = (e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, false); };
  const handleCameraSelect = (e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, true); };
  const clearImage = () => {
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Direct image send — used by camera auto-capture
  const sendWithImage = async (imgData) => {
    if (limitReached) { setShowLimitModal(true); return; }
    if (loadingRef.current) return;
    const img = imgData || imageData;
    if (!img) return;

    loadingRef.current = true;
    const displayText = `📷 ${img.name}`;
    const userMsg = { role: 'user', content: displayText };
    const currentMsgs = messagesRef.current;
    const newMsgs = [...currentMsgs, userMsg];
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

      const jsonBody = JSON.stringify(body);
      console.log('[StarkyBubble] Sending image:', { size: Math.round(jsonBody.length / 1024) + 'KB', type: img.type, b64Len: img.base64?.length });

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
      });

      let data;
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        console.error('[StarkyBubble] API error:', res.status, data);
        throw new Error(data.error || `API returned ${res.status}`);
      }

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
      try { recordCall(); } catch {}
      try { detectAndSaveMistake(displayText, reply, sessionMemory?.currentSubject, addMistake, addWeakTopic); } catch {}
    } catch (err) {
      console.error('[StarkyBubble sendWithImage ERROR]', err?.message || err);
      // Show specific error if available
      const errMsg = err?.message?.includes('413') || err?.message?.includes('too large')
        ? 'That photo is too large. Try taking a closer shot of just the part you need help with.'
        : err?.message?.includes('429')
        ? 'Starky is a bit busy right now. Please try again in a moment.'
        : 'Something went wrong reading your photo. Please try taking another photo.';
      setMessages([...newMsgs, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = async () => {
    // Check session limit before allowing message
    if (limitReached) { setShowLimitModal(true); return; }

    // Check for pending voice text (from VoiceChatBar) — takes priority over input state
    const voiceText = pendingVoiceRef.current;
    if (voiceText) pendingVoiceRef.current = null;
    const text = (voiceText || input).trim();
    if ((!text && !imageData) || loading || loadingRef.current) return;

    // Client-side profanity check — block before sending to API
    if (text) {
      const violation = checkContentViolation(text);
      if (violation.violation) {
        setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: violation.response }]);
        setInput('');
        loadingRef.current = false;
        return;
      }
    }

    if (voiceText) setInput(''); // Clear the input field if voice-sent

    loadingRef.current = true;
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
        stream: !imageData, // Stream text-only messages, non-stream for images
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

      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch {}
        throw new Error(data.error || `API returned ${res.status}`);
      }

      let reply = '';

      // ── Streaming path — tokens appear in real time ─────────────────────
      if (res.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let lastChunkTime = Date.now();

        // Add placeholder assistant message with typing indicator
        const streamMsgIndex = newMsgs.length;
        setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
        setLoading(false); // Hide "thinking" since text is now appearing

        while (true) {
          // Timeout: if no data for 30 seconds, break the stream
          const readPromise = reader.read();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Stream timeout')), 30000));
          let result;
          try { result = await Promise.race([readPromise, timeoutPromise]); } catch { break; }
          const { done, value } = result;
          if (done) break;
          lastChunkTime = Date.now();
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events from buffer
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === 'text') {
                reply += event.text;
                // Update the assistant message in-place as tokens arrive
                setMessages(prev => {
                  const updated = [...prev];
                  updated[streamMsgIndex] = { role: 'assistant', content: reply };
                  return updated;
                });
              } else if (event.type === 'error') {
                throw new Error(event.error);
              }
            } catch (parseErr) {
              if (parseErr.message !== 'Unexpected end of JSON input') throw parseErr;
            }
          }
        }
      } else {
        // ── Non-streaming path (images, fallback) ────────────────────────
        let data;
        try { data = await res.json(); } catch { data = {}; }
        reply = data.response || data.content || 'Something went wrong. Try again!';
        setMessages([...newMsgs, { role: 'assistant', content: reply }]);
      }

      if (!reply) {
        reply = 'Something went wrong. Try again!';
        // Update the streaming message if it was left empty
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant' && !last.content) {
            updated[updated.length - 1] = { role: 'assistant', content: reply };
          }
          return updated;
        });
      }

      setImageData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (voiceSupported && reply.length < 300) speakText(reply);

      conversationRef.current = [
        ...conversationRef.current,
        { role: 'user', content: displayText },
        { role: 'assistant', content: reply },
      ];

      saveMessage(displayText, reply);
      try { recordCall(); } catch {}
      try { detectAndSaveMistake(displayText, reply, sessionMemory?.currentSubject, addMistake, addWeakTopic); } catch {}

      // ── Signal collection (async, non-blocking) ──
      try {
        const prevUserMsg = conversationRef.current.length >= 4 ? conversationRef.current[conversationRef.current.length - 4]?.content : null;
        const prevStarkyMsg = conversationRef.current.length >= 3 ? conversationRef.current[conversationRef.current.length - 3]?.content : null;
        recordMessageSignal({
          email: userProfile?.email,
          subject: sessionMemory?.currentSubject,
          grade: userProfile?.grade,
          userMessage: displayText,
          starkyResponse: reply,
          sessionNumber: sessionMemory?.totalSessions || 1,
          previousUserMessage: prevUserMsg,
          previousStarkyResponse: prevStarkyMsg,
          isFirstMessage: conversationRef.current.length <= 2,
        });
        const mood = detectSentiment(displayText);
        if (mood === 'frustrated' || mood === 'confused') {
          recordMoodSignal({ email: userProfile?.email, mood, subject: sessionMemory?.currentSubject, message: displayText });
        }
        // Record teaching strategy signal — captures what Starky did and how user responded
        recordStrategySignal({
          email: userProfile?.email,
          subject: sessionMemory?.currentSubject,
          grade: userProfile?.grade,
          starkyResponse: reply,
          userResponse: displayText,
          sessionNumber: sessionMemory?.totalSessions || 1,
          messageIndex: Math.floor(conversationRef.current.length / 2),
        });
      } catch {}

      if (conversationRef.current.length === SUMMARIZE_AFTER * 2) {
        finalizeSession(conversationRef.current);
      }

      // Send parent session report after 5 user messages, and again every 10 messages for long sessions
      const userMsgCount = conversationRef.current.filter(m => m.role === 'user').length;
      if ((userMsgCount === 5 || (userMsgCount > 5 && userMsgCount % 10 === 0)) && userProfile?.email) {
        fetch('/api/session-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: userProfile.email,
            studentName: userProfile.name,
            parentEmail: userMsgCount === 5 ? (userProfile.parentEmail || userProfile.email) : null, // Only email parent on first report
            parentName: userProfile.name,
            grade: userProfile.grade,
            subject: sessionMemory?.currentSubject || 'General',
            messages: conversationRef.current.slice(-20), // Send more context for deeper analysis
            isSEN: !!userProfile.senFlag,
            senType: userProfile.senType || null,
            sessionCount: sessionMemory?.totalSessions || 0,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      const errMsg = err?.message?.includes('429') || err?.message?.includes('busy')
        ? 'Starky is very busy right now. Please try again in a moment.'
        : err?.message?.includes('breather')
        ? 'Starky is taking a quick breather. Try again in a minute!'
        : 'Something went wrong. Please try again!';
      setMessages(prev => {
        // If we already added a streaming message, update it; otherwise append
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: errMsg };
          return updated;
        }
        return [...prev, { role: 'assistant', content: errMsg }];
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
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
          bottom: 80px;
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
          padding-top: env(safe-area-inset-top);
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
        .starky-msg.assistant strong { color: #4F8EF7; font-weight: 700; }
        .starky-msg.assistant em { color: rgba(255,255,255,.7); font-style: italic; }
        .starky-msg.typing { opacity: .5; font-style: italic; }
        .starky-msg.assistant:has(> br:only-child), .starky-msg.assistant:empty { min-height: 24px; }
        .starky-input-row {
          padding: 8px 10px calc(10px + env(safe-area-inset-bottom));
          border-top: 1px solid rgba(255,255,255,.07);
          display: flex; flex-wrap: wrap; gap: 6px;
          align-items: flex-end; flex-shrink: 0;
        }
        .starky-chat.fullscreen .starky-input-row {
          padding: 12px 16px calc(16px + env(safe-area-inset-bottom)); max-width: 700px; width: 100%; margin: 0 auto;
        }
        .starky-input {
          flex: 1; min-width: 0;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px; color: #fff;
          padding: 9px 11px; font-size: 16px;
          font-family: inherit; outline: none;
          resize: none; max-height: 80px; -webkit-appearance: none;
        }
        .starky-chat.fullscreen .starky-input { font-size: 16px; padding: 12px 14px; }
        .starky-input::placeholder { color: rgba(255,255,255,.25); }
        .starky-input:focus { border-color: rgba(79,142,247,.4); }
        .starky-send-btn {
          width: 44px; height: 44px; border-radius: 10px;
          background: linear-gradient(135deg, #4F8EF7, #6366F1);
          border: none; color: #fff; cursor: pointer; font-size: 20px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .starky-send-btn:disabled { opacity: .35; cursor: not-allowed; }
        .starky-icon-btn {
          width: 44px; height: 44px; border-radius: 10px;
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
          width: 50px; height: 50px; border-radius: 50%;
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 16px rgba(79,142,247,.35);
          opacity: 0.9;
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
                <button className="starky-close-btn" onClick={handleClose} style={{ padding:'6px 10px', fontSize:18, minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
            </div>

            <div className="starky-messages" role="log" aria-label="Chat with Starky" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`starky-msg ${m.role}`} aria-label={m.role === 'assistant' ? 'Starky says' : 'You said'}
                  dangerouslySetInnerHTML={m.role === 'assistant' ? { __html: formatStarkyMsg(m.content) } : undefined}
                >{m.role === 'user' ? m.content : undefined}</div>
              ))}

              {/* Quick-tap subject buttons for young kids (KG-Grade 5) */}
              {(() => {
                const gId = (userProfile?.gradeId || '').toLowerCase();
                const isKid = ['kg','grade1','grade2','grade3','grade4','grade5'].includes(gId);
                if (!isKid || loading || messages.length > 2) return null;
                const kidSubjects = [
                  { emoji: '🔢', label: 'Maths', msg: 'I want to learn Maths!' },
                  { emoji: '📖', label: 'English', msg: 'I want to learn English!' },
                  { emoji: '🔬', label: 'Science', msg: 'I want to learn Science!' },
                  { emoji: '✏️', label: 'Urdu', msg: 'I want to learn Urdu!' },
                  { emoji: '🌍', label: 'GK', msg: 'Tell me something fun about the world!' },
                  { emoji: '🎯', label: 'Quiz Me!', msg: 'Quiz me on something fun!' },
                ];
                return (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'8px 4px', maxWidth:400, margin:'0 auto' }}>
                    {kidSubjects.map(s => (
                      <button key={s.label} onClick={() => { pendingVoiceRef.current = s.msg; sendMessage(); }}
                        style={{ background:'rgba(79,142,247,0.12)', border:'2px solid rgba(79,142,247,0.3)', borderRadius:16, padding:'16px 8px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, WebkitTapHighlightColor:'transparent', transition:'all 0.15s' }}>
                        <span style={{ fontSize:32 }}>{s.emoji}</span>
                        <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:'#fff' }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}

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
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/*" style={{display:'none'}} onChange={handleImageSelect} />
              <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/*" capture="environment" style={{display:'none'}} onChange={handleCameraSelect} />
              {/* 🎤 Voice */}
              {sttSupported && (
                <button className={`starky-icon-btn${isMicActive ? ' starky-mic-active' : ''}`}
                  onClick={() => {
                    if (isMicActive) {
                      micRef.current?.stop();
                      setIsMicActive(false);
                      return;
                    }
                    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (!SR) return;
                    const r = new SR();
                    r.lang = (navigator.language || '').startsWith('ur') ? 'ur-PK' : 'en-US';
                    r.interimResults = false;
                    r.onresult = (e) => {
                      const t = e.results?.[0]?.[0]?.transcript;
                      if (t) { pendingVoiceRef.current = t; sendMessage(); }
                      setIsMicActive(false);
                    };
                    r.onerror = () => setIsMicActive(false);
                    r.onend = () => setIsMicActive(false);
                    micRef.current = r;
                    r.start();
                    setIsMicActive(true);
                  }}
                  title={isMicActive ? 'Stop listening' : 'Speak your message'}
                  style={isMicActive ? { background:'rgba(239,68,68,0.2)', borderColor:'rgba(239,68,68,0.4)' } : {}}
                >
                  {isMicActive ? '⏹' : '🎤'}
                </button>
              )}
              {/* 📎 Gallery */}
              <button className="starky-icon-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">📎</button>
              {/* 📷 Camera */}
              <button className="starky-icon-btn" onClick={() => cameraInputRef.current?.click()} title="Take photo">📷</button>
              <textarea
                ref={inputRef}
                className="starky-input"
                placeholder={['kg','grade1','grade2','grade3','grade4','grade5'].includes((userProfile?.gradeId||'').toLowerCase()) ? 'Talk to Starky! 🌟' : 'Ask Starky anything…'}
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

        {(!open || !fullscreen) && (
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
      {showLimitModal && <LimitReachedModal onClose={() => setShowLimitModal(false)} />}
    </>
  );
}
