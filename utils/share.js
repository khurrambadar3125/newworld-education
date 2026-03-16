/**
 * utils/share.js
 * Client-side share helper — creates a link and triggers native share or clipboard.
 *
 * Usage:
 *   import { shareLink } from '../utils/share';
 *   await shareLink('drill', { subject: 'Chemistry', pct: 85, correct: 8, total: 10 }, 'I scored 85% on Chemistry!');
 */

export async function shareLink(type, data, shareText) {
  try {
    // Create the share link via API
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
    const { url } = await res.json();
    if (!url) throw new Error('No URL returned');

    const text = shareText ? `${shareText}\n${url}` : url;

    // Try native share (mobile — WhatsApp, SMS, etc)
    if (navigator.share) {
      await navigator.share({ text, url });
      return { shared: true, method: 'native' };
    }

    // Fallback: clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return { shared: true, method: 'clipboard' };
    }

    // Last resort: prompt
    window.prompt('Copy this link:', text);
    return { shared: true, method: 'prompt' };
  } catch (e) {
    if (e.name === 'AbortError') return { shared: false, method: 'cancelled' };
    console.error('[Share]', e);
    return { shared: false, method: 'error' };
  }
}
