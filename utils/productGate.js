/**
 * productGate.js
 * Standalone product session limits and paywall for Languages and Spelling Bee.
 *
 * Each product has its own:
 *   - 7-day free trial (5 rounds/day)
 *   - Paid subscription: Rs 3,499/mo (unlimited)
 *   - JazzCash WhatsApp payment
 *
 * Usage:
 *   import { useProductGate, ProductPaywall } from '../utils/productGate';
 *   const gate = useProductGate('spelling-bee');
 *   if (gate.blocked) return <ProductPaywall product={gate} />;
 *   gate.recordRound(); // call after each round/exercise set
 */

import { useState, useEffect, useCallback } from 'react';
import { isExemptEmail } from './useSessionLimit';

const FREE_DAILY_ROUNDS = 5;
const TRIAL_DAYS = 7;

const PRODUCTS = {
  'spelling-bee': {
    name: 'Spelling Bee',
    emoji: '🐝',
    description: 'Interactive spelling games with 4 modes, 210 words, audio & pronunciation practice',
    pricePKR: 3499,
    priceUSD: 12.99,
    color: '#F59E0B',
    whatsappMsg: 'Hi, I want to subscribe to NewWorldEdu Spelling Bee (Rs 3,499/month). Please activate my account.\n\nName: \nEmail: \nChild\'s Grade: ',
  },
  'languages': {
    name: 'Learn Languages',
    emoji: '🌍',
    description: '9 languages, 1000+ words, pronunciation practice, mother tongue support, hearts system',
    pricePKR: 3499,
    priceUSD: 12.99,
    color: '#4F8EF7',
    whatsappMsg: 'Hi, I want to subscribe to NewWorldEdu Languages (Rs 3,499/month). Please activate my account.\n\nName: \nEmail: \nLanguage: ',
  },
};

const WHATSAPP_NUMBER = '923262266682';

function getStorageKey(productId) { return `nw_${productId.replace(/-/g, '_')}_gate`; }

function readGate(productId) {
  try {
    const raw = localStorage.getItem(getStorageKey(productId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function writeGate(productId, data) {
  try {
    localStorage.setItem(getStorageKey(productId), JSON.stringify(data));
  } catch {}
}

/**
 * Hook: useProductGate
 * Returns { roundsUsed, roundsLeft, blocked, trialActive, trialDaysLeft, isPaid, recordRound, product }
 */
export function useProductGate(productId) {
  const [state, setState] = useState({
    roundsUsed: 0, trialStart: null, paid: false,
  });

  useEffect(() => {
    let gate = readGate(productId);
    if (!gate) {
      gate = { trialStart: new Date().toISOString(), paid: false, daily: {} };
      writeGate(productId, gate);
    }

    // Check if exempt (founder/family) or paid
    let exempt = false;
    try {
      const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (isExemptEmail(profile.email)) exempt = true;
      if (profile[`${productId}_paid`] || profile.plan === productId || profile.subscriptionActive) {
        gate.paid = true;
      }
    } catch {}

    const today = new Date().toISOString().split('T')[0];
    const todayRounds = gate.daily?.[today] || 0;

    setState({ roundsUsed: todayRounds, trialStart: gate.trialStart, paid: gate.paid || exempt });
  }, [productId]);

  const trialStart = state.trialStart ? new Date(state.trialStart) : new Date();
  const daysPassed = Math.floor((new Date() - trialStart) / 86400000);
  const trialActive = daysPassed < TRIAL_DAYS;
  const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysPassed);
  const trialExpired = !trialActive && !state.paid;

  const roundsLeft = state.paid ? 999 : Math.max(0, FREE_DAILY_ROUNDS - state.roundsUsed);
  const blocked = !state.paid && (trialExpired || state.roundsUsed >= FREE_DAILY_ROUNDS);

  const recordRound = useCallback(() => {
    const gate = readGate(productId) || { trialStart: new Date().toISOString(), paid: false, daily: {} };
    const today = new Date().toISOString().split('T')[0];
    gate.daily = gate.daily || {};
    gate.daily[today] = (gate.daily[today] || 0) + 1;
    // Clean old days (keep last 7)
    const keys = Object.keys(gate.daily).sort();
    if (keys.length > 7) {
      for (const k of keys.slice(0, keys.length - 7)) delete gate.daily[k];
    }
    writeGate(productId, gate);
    setState(s => ({ ...s, roundsUsed: gate.daily[today] }));
  }, [productId]);

  const product = PRODUCTS[productId] || PRODUCTS['spelling-bee'];

  return {
    roundsUsed: state.roundsUsed,
    roundsLeft,
    blocked,
    trialActive,
    trialDaysLeft,
    trialExpired,
    isPaid: state.paid,
    recordRound,
    product,
    FREE_DAILY_ROUNDS,
  };
}

/**
 * Component: ProductPaywall
 * Full-screen paywall shown when rounds are exhausted or trial expired.
 */
export function ProductPaywall({ gate, onClose, T }) {
  const { product, trialExpired, trialDaysLeft, roundsUsed, FREE_DAILY_ROUNDS: limit } = gate;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMsg)}`;

  const bg = T?.n0 || '#0D1221';
  const text = T?.n700 || '#fff';
  const muted = T?.n400 || 'rgba(255,255,255,0.45)';
  const border = T?.n100 || 'rgba(255,255,255,0.08)';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'Sora', sans-serif",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: bg, border: `1px solid ${product.color}33`,
        borderRadius: 28, padding: '36px 24px', width: '100%', maxWidth: 420, textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{product.emoji}</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: text, margin: '0 0 8px' }}>
          {trialExpired ? `Your ${product.name} trial has ended` : `Daily rounds used up!`}
        </h2>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, marginBottom: 20 }}>
          {trialExpired
            ? `Your 7-day free trial is over. Subscribe to continue ${product.name} — your progress is saved.`
            : `You've used ${roundsUsed}/${limit} rounds today. Come back tomorrow or subscribe for unlimited.`
          }
        </p>

        {/* Pricing card */}
        <div style={{
          background: `${product.color}10`, border: `1px solid ${product.color}30`,
          borderRadius: 16, padding: 18, marginBottom: 20, textAlign: 'left',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: product.color, marginBottom: 6 }}>
            {product.name.toUpperCase()} — UNLIMITED
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: text }}>Rs 3,499</span>
            <span style={{ fontSize: 13, color: muted }}>/month</span>
          </div>
          <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
            {product.description}
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff', borderRadius: 14, padding: '15px 20px',
            fontSize: 15, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
          }}>
            Subscribe via WhatsApp — Rs 3,499/mo
          </a>
          <a href="/pricing" style={{
            display: 'block', background: `${product.color}20`, border: `1px solid ${product.color}40`,
            borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 700,
            color: product.color, textDecoration: 'none', textAlign: 'center',
          }}>
            See All Plans
          </a>
          {!trialExpired && (
            <button onClick={onClose} style={{
              background: 'transparent', border: `1px solid ${border}`,
              borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 600,
              color: muted, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
            }}>
              Close — come back tomorrow
            </button>
          )}
          {trialExpired && (
            <button onClick={onClose} style={{
              background: 'transparent', border: `1px solid ${border}`,
              borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 600,
              color: muted, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
            }}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Component: ProductTrialBadge
 * Small badge showing trial status / rounds remaining.
 */
export function ProductTrialBadge({ gate, T }) {
  const { trialActive, trialDaysLeft, isPaid, roundsUsed, roundsLeft, FREE_DAILY_ROUNDS: limit } = gate;
  const muted = T?.n400 || 'rgba(255,255,255,0.45)';

  if (isPaid) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'rgba(43,181,90,0.12)', border: '1px solid rgba(43,181,90,0.3)',
        borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800, color: '#2BB55A',
      }}>
        Subscribed
      </span>
    );
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.3)',
      borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800,
      color: roundsLeft <= 1 ? '#F59E0B' : '#4F8EF7',
    }}>
      {trialActive ? `Trial · ${trialDaysLeft}d left` : ''} {roundsLeft}/{limit} rounds
    </span>
  );
}
