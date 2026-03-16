/**
 * AccessibilityToolbar — SEN accessibility controls.
 * Voice, auto-speak, dyslexia font, cream theme, large buttons, print.
 * Shared across music-for-all, reading-for-all, arts-for-all, special-needs.
 */
import { useState, useEffect } from 'react';

export default function AccessibilityToolbar({ onAutoSpeakChange, conditionId }) {
  const [open, setOpen] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [creamTheme, setCreamTheme] = useState(false);
  const [largeMode, setLargeMode] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Load preferences
  useEffect(() => {
    try {
      if (localStorage.getItem('nw_sen_dyslexia_font') === 'true') setDyslexicFont(true);
      if (localStorage.getItem('nw_sen_cream_theme') === 'true') setCreamTheme(true);
      if (localStorage.getItem('nw_sen_large_mode') === 'true') setLargeMode(true);
      if (localStorage.getItem('nw_sen_autospeak') === 'true') setAutoSpeak(true);
    } catch {}
    // Auto-enable for specific conditions
    if (conditionId === 'dyslexia') {
      if (!localStorage.getItem('nw_sen_dyslexia_font')) { setDyslexicFont(true); localStorage.setItem('nw_sen_dyslexia_font', 'true'); }
      if (!localStorage.getItem('nw_sen_cream_theme')) { setCreamTheme(true); localStorage.setItem('nw_sen_cream_theme', 'true'); }
    }
    if (conditionId === 'vi') {
      if (!localStorage.getItem('nw_sen_autospeak')) { setAutoSpeak(true); localStorage.setItem('nw_sen_autospeak', 'true'); }
      if (!localStorage.getItem('nw_sen_large_mode')) { setLargeMode(true); localStorage.setItem('nw_sen_large_mode', 'true'); }
    }
    if (conditionId === 'cp') {
      if (!localStorage.getItem('nw_sen_large_mode')) { setLargeMode(true); localStorage.setItem('nw_sen_large_mode', 'true'); }
    }
  }, [conditionId]);

  // Apply preferences to DOM
  useEffect(() => {
    const root = document.documentElement;
    // Dyslexic font
    if (dyslexicFont) {
      root.setAttribute('data-font', 'dyslexic');
      // Load font if not already loaded
      if (!document.getElementById('opendyslexic-font')) {
        const link = document.createElement('link');
        link.id = 'opendyslexic-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/opendyslexic';
        document.head.appendChild(link);
      }
    } else {
      root.removeAttribute('data-font');
    }
    // Cream theme
    if (creamTheme) {
      root.setAttribute('data-theme', 'cream');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
    // Large mode (AAC)
    if (largeMode) {
      root.setAttribute('data-access', 'aac');
    } else {
      root.removeAttribute('data-access');
    }
  }, [dyslexicFont, creamTheme, largeMode]);

  // Notify parent of auto-speak changes
  useEffect(() => {
    onAutoSpeakChange?.(autoSpeak);
  }, [autoSpeak, onAutoSpeakChange]);

  const toggle = (key, val, setter) => {
    const next = !val;
    setter(next);
    try { localStorage.setItem(key, String(next)); } catch {}
  };

  const S = {
    bar: { display:'flex', gap:6, flexWrap:'wrap', padding:'8px 0' },
    btn: (active) => ({
      background: active ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${active ? 'rgba(79,142,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
      color: active ? '#4F8EF7' : 'rgba(255,255,255,0.6)',
      fontSize: 12, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap',
    }),
    trigger: {
      background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)',
      borderRadius: 10, padding: '6px 14px', cursor: 'pointer',
      color: '#A78BFA', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
    },
  };

  return (
    <div>
      <button style={S.trigger} onClick={() => setOpen(!open)} aria-label="Accessibility options">
        ♿ {open ? 'Hide' : 'Accessibility'}
      </button>
      {open && (
        <div style={S.bar}>
          <button style={S.btn(autoSpeak)} onClick={() => toggle('nw_sen_autospeak', autoSpeak, setAutoSpeak)} aria-label="Toggle auto-speak">
            {autoSpeak ? '🔊 Auto-speak ON' : '🔇 Auto-speak'}
          </button>
          <button style={S.btn(dyslexicFont)} onClick={() => toggle('nw_sen_dyslexia_font', dyslexicFont, setDyslexicFont)} aria-label="Toggle dyslexia-friendly font">
            Aa {dyslexicFont ? 'Dyslexia Font ✓' : 'Dyslexia Font'}
          </button>
          <button style={S.btn(creamTheme)} onClick={() => toggle('nw_sen_cream_theme', creamTheme, setCreamTheme)} aria-label="Toggle cream background">
            {creamTheme ? '🌾 Cream BG ✓' : '🌾 Cream BG'}
          </button>
          <button style={S.btn(largeMode)} onClick={() => toggle('nw_sen_large_mode', largeMode, setLargeMode)} aria-label="Toggle large buttons mode">
            {largeMode ? '♿ Large ✓' : '♿ Large Buttons'}
          </button>
        </div>
      )}
    </div>
  );
}
