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
function parentCampaignEmail(name) {
  const firstName = (name || 'there').split(' ')[0];
  return {
    subject: `${firstName}, your child's Cambridge tutor is ready — free`,
    html: `
<div style="font-family:'Sora',-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#080C18;color:#FAF6EB;padding:40px 28px;border-radius:16px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:14px;font-weight:900;color:#FAF6EB;">NewWorldEdu</span><span style="color:#C9A84C;margin-left:4px;">★</span>
  </div>

  <h1 style="font-size:24px;font-weight:900;color:#FAF6EB;margin:0 0 16px;line-height:1.3;text-align:center;">
    ${firstName}, your child deserves<br>
    <span style="color:#C9A84C;">a tutor who never sleeps.</span>
  </h1>

  <p style="font-size:15px;color:rgba(250,246,235,0.6);line-height:1.8;margin:0 0 20px;">
    Coaching centres charge Rs 25,000 per subject per month. Group classes. Fixed timings. Your child still comes home confused at 11pm.
  </p>

  <p style="font-size:15px;color:rgba(250,246,235,0.6);line-height:1.8;margin:0 0 20px;">
    <strong style="color:#FAF6EB;">We built something different.</strong> A personal AI tutor that:
  </p>

  <div style="margin:0 0 24px;">
    <div style="padding:8px 0;font-size:14px;color:rgba(250,246,235,0.7);">✓ Has <strong style="color:#C9A84C;">50,000+ real Cambridge past paper questions</strong> with mark scheme answers</div>
    <div style="padding:8px 0;font-size:14px;color:rgba(250,246,235,0.7);">✓ Teaches in <strong style="color:#C9A84C;">exact mark-scheme language</strong> — the phrases that earn marks</div>
    <div style="padding:8px 0;font-size:14px;color:rgba(250,246,235,0.7);">✓ Knows what <strong style="color:#C9A84C;">Cambridge examiners complain about</strong> and warns your child</div>
    <div style="padding:8px 0;font-size:14px;color:rgba(250,246,235,0.7);">✓ Available at <strong style="color:#C9A84C;">11pm, 2am, exam morning</strong> — whenever they need it</div>
    <div style="padding:8px 0;font-size:14px;color:rgba(250,246,235,0.7);">✓ Covers <strong style="color:#C9A84C;">17 subjects</strong> with exact textbook chapters</div>
  </div>

  <p style="font-size:15px;color:rgba(250,246,235,0.6);line-height:1.8;margin:0 0 24px;">
    <strong style="color:#C9A84C;">10 free sessions.</strong> No credit card. No commitment. Just let them try.
  </p>

  <div style="text-align:center;margin:0 0 24px;">
    <a href="https://www.newworld.education/try" style="display:inline-block;background:#C9A84C;color:#080C18;font-size:16px;font-weight:900;padding:16px 40px;border-radius:12px;text-decoration:none;">
      Let them try — it's free →
    </a>
  </div>

  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;margin:0 0 4px;">
    No app to download. Opens instantly in any browser.
  </p>
  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;margin:0;">
    Rs 2,850/month for ALL subjects after free sessions. That's less than ONE hour of tuition.
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

function studentCampaignEmail(name) {
  const firstName = (name || 'there').split(' ')[0];
  return {
    subject: `${firstName} — can you beat this Cambridge question?`,
    html: `
<div style="font-family:'Sora',-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#080C18;color:#FAF6EB;padding:40px 28px;border-radius:16px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:14px;font-weight:900;color:#FAF6EB;">NewWorldEdu</span><span style="color:#C9A84C;margin-left:4px;">★</span>
  </div>

  <h1 style="font-size:24px;font-weight:900;color:#FAF6EB;margin:0 0 16px;line-height:1.3;text-align:center;">
    ${firstName}, let's see if you can<br>
    <span style="color:#C9A84C;">score full marks.</span>
  </h1>

  <div style="background:rgba(250,246,235,0.03);border:1px solid rgba(250,246,235,0.06);border-radius:14px;padding:20px;margin:0 0 20px;">
    <div style="font-size:11px;font-weight:700;color:rgba(250,246,235,0.35);letter-spacing:1px;margin-bottom:8px;">CHEMISTRY · O LEVEL · 3 MARKS</div>
    <div style="font-size:15px;color:rgba(250,246,235,0.8);line-height:1.7;">
      Describe the arrangement and movement of particles in a solid. [3]
    </div>
  </div>

  <p style="font-size:14px;color:rgba(250,246,235,0.5);line-height:1.7;margin:0 0 4px;">
    Think you know? Most students lose 1 mark on this question.
  </p>
  <p style="font-size:14px;color:#C9A84C;font-weight:700;margin:0 0 24px;">
    The mark scheme requires EXACT phrases. Do you know them?
  </p>

  <div style="text-align:center;margin:0 0 24px;">
    <a href="https://www.newworld.education/try" style="display:inline-block;background:#C9A84C;color:#080C18;font-size:16px;font-weight:900;padding:16px 40px;border-radius:12px;text-decoration:none;">
      See the answer + study with Starky →
    </a>
  </div>

  <div style="margin:0 0 24px;">
    <div style="padding:6px 0;font-size:13px;color:rgba(250,246,235,0.5);">📚 50,000+ verified Cambridge past paper questions</div>
    <div style="padding:6px 0;font-size:13px;color:rgba(250,246,235,0.5);">📝 Revision notes for every chapter — saves Rs 1000s on printing</div>
    <div style="padding:6px 0;font-size:13px;color:rgba(250,246,235,0.5);">🎯 Nano learning: Notes → Worked Example → Practice → Master</div>
    <div style="padding:6px 0;font-size:13px;color:rgba(250,246,235,0.5);">🏆 Daily Challenge — same 5 questions for everyone. Can you top the leaderboard?</div>
  </div>

  <p style="font-size:13px;color:rgba(250,246,235,0.3);text-align:center;">
    10 free sessions. No app to download. Opens in your browser.
  </p>

  <div style="border-top:1px solid rgba(250,246,235,0.06);margin-top:32px;padding-top:20px;text-align:center;">
    <p style="font-size:11px;color:rgba(250,246,235,0.2);margin:0;">
      NewWorldEdu · newworld.education<br>
      AI-assisted learning. Not affiliated with Cambridge Assessment.
    </p>
  </div>
</div>`
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { password } = req.query;
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
