/**
 * pages/api/send-campaign.js — Send campaign emails to potential users
 * ─────────────────────────────────────────────────────────────────
 * POST /api/send-campaign
 * Body: { emails: [{email, name, type}], campaign: 'parent'|'student'|'school' }
 *
 * Sends personalized outreach emails with direct links to start studying.
 * No login required — links go straight to /try (zero-friction entry).
 */

import { Resend } from 'resend';
import { getSupabase } from '../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Campaign email templates
function parentCampaignEmail(name, spotsLeft) {
  const firstName = (name || 'there').split(' ')[0];
  const spots = spotsLeft || 97;
  return {
    subject: `${firstName} — your child is invited (only ${spots} spots left)`,
    html: `
<div style="font-family:'Sora',-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#080C18;color:#FAF6EB;padding:40px 28px;border-radius:16px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:14px;font-weight:900;color:#FAF6EB;">NewWorldEdu</span><span style="color:#C9A84C;margin-left:4px;">★</span>
  </div>

  <div style="text-align:center;margin-bottom:20px;">
    <span style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:100px;padding:6px 18px;font-size:13px;font-weight:700;color:#EF4444;">🔥 Only ${spots} spots left</span>
  </div>

  <h1 style="font-size:24px;font-weight:900;color:#FAF6EB;margin:0 0 16px;line-height:1.3;text-align:center;">
    ${firstName}, your child is invited to become a<br>
    <span style="color:#C9A84C;">Founding Student.</span>
  </h1>

  <p style="font-size:15px;color:rgba(250,246,235,0.6);line-height:1.8;margin:0 0 20px;text-align:center;">
    The first 100 students to join Pakistan's first AI Cambridge tutor receive a <strong style="color:#C9A84C;">mystery goody bag delivered to their door</strong> — plus 3 months of free premium access.
  </p>

  <div style="background:rgba(201,168,76,0.04);border:1px solid rgba(201,168,76,0.15);border-radius:14px;padding:20px;margin:0 0 20px;">
    <div style="font-size:12px;font-weight:700;color:#C9A84C;letter-spacing:1px;margin-bottom:12px;text-align:center;">FOUNDING STUDENTS GET</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🎁 Mystery Goody Bag — delivered free to your door</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">⭐ 3 months FREE premium — all 17 Cambridge subjects</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">📚 50,000+ verified past paper questions + revision notes</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🏆 Founding Student badge — forever on their profile</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🎯 Refer 3 friends → UPGRADED mystery box</div>
  </div>

  <div style="text-align:center;margin:0 0 24px;">
    <a href="https://www.newworld.education/founding" style="display:inline-block;background:#C9A84C;color:#080C18;font-size:16px;font-weight:900;padding:16px 40px;border-radius:12px;text-decoration:none;">
      🎁 Claim Their Spot — Free
    </a>
  </div>

  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;margin:0 0 4px;">
    No payment. No app. No commitment. Just an invitation.
  </p>
  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;margin:0;">
    ${spots <= 20 ? '⚠️ Spots are filling fast.' : `${spots} spots remaining.`} Once they're gone, they're gone.
  </p>

  <div style="border-top:1px solid rgba(250,246,235,0.06);margin-top:32px;padding-top:20px;text-align:center;">
    <p style="font-size:11px;color:rgba(250,246,235,0.2);margin:0;">
      NewWorldEdu · newworld.education · Karachi, Pakistan<br>
      AI-assisted learning platform. Not a replacement for school education.
    </p>
  </div>
</div>`
  };
}

function studentCampaignEmail(name, spotsLeft) {
  const firstName = (name || 'there').split(' ')[0];
  const spots = spotsLeft || 97;
  return {
    subject: `${firstName} — you're invited (goody bag + free access)`,
    html: `
<div style="font-family:'Sora',-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#080C18;color:#FAF6EB;padding:40px 28px;border-radius:16px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:14px;font-weight:900;color:#FAF6EB;">NewWorldEdu</span><span style="color:#C9A84C;margin-left:4px;">★</span>
  </div>

  <div style="text-align:center;margin-bottom:20px;">
    <span style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:100px;padding:6px 18px;font-size:13px;font-weight:700;color:#EF4444;">🔥 Only ${spots} spots left</span>
  </div>

  <h1 style="font-size:24px;font-weight:900;color:#FAF6EB;margin:0 0 16px;line-height:1.3;text-align:center;">
    ${firstName}, become a<br>
    <span style="color:#C9A84C;">Founding Student.</span>
  </h1>

  <p style="font-size:15px;color:rgba(250,246,235,0.6);line-height:1.8;margin:0 0 20px;text-align:center;">
    We're picking the first 100 Cambridge students in Pakistan to try something nobody's built before — a personal AI tutor that knows the mark scheme.
  </p>

  <div style="background:rgba(201,168,76,0.04);border:1px solid rgba(201,168,76,0.15);border-radius:14px;padding:20px;margin:0 0 20px;">
    <div style="font-size:12px;font-weight:700;color:#C9A84C;letter-spacing:1px;margin-bottom:12px;text-align:center;">YOU GET</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🎁 Mystery Goody Bag — delivered to your door (yes, really)</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">⭐ 3 months FREE premium — every subject, every chapter</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">📝 Revision notes that replace Rs 2,000 worth of printed notes</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🏆 Founding Student badge — you were here first</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🎯 Refer 3 friends → your goody bag gets UPGRADED</div>
  </div>

  <div style="text-align:center;margin:0 0 24px;">
    <a href="https://www.newworld.education/founding" style="display:inline-block;background:#C9A84C;color:#080C18;font-size:16px;font-weight:900;padding:16px 40px;border-radius:12px;text-decoration:none;">
      🎁 Claim My Spot
    </a>
  </div>

  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;margin:0;">
    No payment. No app. ${spots <= 20 ? 'Almost full.' : `${spots} spots remaining.`}
  </p>

  <div style="border-top:1px solid rgba(250,246,235,0.06);margin-top:32px;padding-top:20px;text-align:center;">
    <p style="font-size:11px;color:rgba(250,246,235,0.2);margin:0;">
      NewWorldEdu · newworld.education · Pakistan's first AI Cambridge tutor<br>
      Not affiliated with Cambridge Assessment International Education.
    </p>
  </div>
</div>`
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const password = req.headers['x-admin-password'] || req.query.password;
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { emails, campaign = 'parent' } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'emails array required' });
  }

  const supabase = getSupabase();
  let sent = 0, failed = 0, skipped = 0;
  const results = [];

  for (const entry of emails) {
    const email = (typeof entry === 'string' ? entry : entry.email || '').trim().toLowerCase();
    const name = (typeof entry === 'string' ? '' : entry.name || '').trim();
    const type = typeof entry === 'string' ? campaign : (entry.type || campaign);

    if (!email || !email.includes('@')) { skipped++; continue; }

    try {
      // Get email template
      const template = type === 'student' ? studentCampaignEmail(name) : parentCampaignEmail(name);

      // Send via Resend
      await resend.emails.send({
        from: 'Starky at NewWorld <starky@newworld.education>',
        to: [email],
        subject: template.subject,
        html: template.html,
      });

      // Save as subscriber if not already
      if (supabase) {
        await supabase.from('subscribers').upsert({
          email,
          name: name || null,
          source: `campaign_${type}`,
          subscribed_at: new Date().toISOString(),
        }, { onConflict: 'email' }).catch(() => {});
      }

      sent++;
      results.push({ email, status: 'sent' });

      // Rate limit: max 2 per second for Resend
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      failed++;
      results.push({ email, status: 'failed', error: err.message });
    }
  }

  return res.status(200).json({ sent, failed, skipped, total: emails.length, results });
}
