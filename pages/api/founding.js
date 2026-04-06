/**
 * pages/api/founding.js — Founding Students Campaign Backend
 * ─────────────────────────────────────────────────────────────────
 * GET  ?action=spots — returns spots remaining
 * POST — register a founding student
 */

import { getSupabase } from '../../utils/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_FOUNDING = 100;

export default async function handler(req, res) {
  const supabase = getSupabase();

  // GET: spots remaining
  if (req.method === 'GET') {
    const { action } = req.query;
    if (action === 'spots') {
      let count = 0;
      if (supabase) {
        const { count: c } = await supabase
          .from('founding_students')
          .select('*', { count: 'exact', head: true });
        count = c || 0;
      }
      return res.status(200).json({ spotsLeft: Math.max(0, MAX_FOUNDING - count), total: MAX_FOUNDING, claimed: count });
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  // POST: register
  if (req.method !== 'POST') return res.status(405).json({ error: 'GET or POST only' });

  const { name, email, phone, school, grade, city, role, referredBy } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Check spots
    let currentCount = 0;
    if (supabase) {
      // Check if already registered
      const { data: existing } = await supabase
        .from('founding_students')
        .select('id, referral_code')
        .eq('email', cleanEmail)
        .single();

      if (existing) {
        return res.status(200).json({
          message: 'Already registered!',
          referralCode: existing.referral_code,
          spotsLeft: Math.max(0, MAX_FOUNDING - currentCount),
        });
      }

      const { count: c } = await supabase
        .from('founding_students')
        .select('*', { count: 'exact', head: true });
      currentCount = c || 0;

      if (currentCount >= MAX_FOUNDING) {
        return res.status(200).json({ error: 'All founding spots are taken. Join the waitlist!', spotsLeft: 0 });
      }
    }

    // Generate referral code
    const referralCode = `NW${name.replace(/\s+/g, '').slice(0, 4).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;

    // Save founding student
    if (supabase) {
      const { error: insertError } = await supabase
        .from('founding_students')
        .insert({
          name,
          email: cleanEmail,
          phone: phone || null,
          school: school || null,
          grade: grade || null,
          city: city || 'Karachi',
          role: role || 'student',
          referral_code: referralCode,
          referred_by: referredBy || null,
          tier: 'founding',
          referral_count: 0,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        // Table might not exist — create SQL
        if (insertError.message?.includes('founding_students')) {
          console.error('founding_students table missing. Run this SQL:');
          console.error(`
CREATE TABLE founding_students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  school TEXT,
  grade TEXT,
  city TEXT DEFAULT 'Karachi',
  role TEXT DEFAULT 'student',
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  tier TEXT DEFAULT 'founding',
  referral_count INT DEFAULT 0,
  goody_bag_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE founding_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage" ON founding_students FOR ALL USING (true);
          `);
        }
        console.error('Insert error:', insertError.message);
      }

      // Credit the referrer
      if (referredBy) {
        await supabase
          .from('founding_students')
          .update({ referral_count: supabase.rpc ? undefined : 0 })
          .eq('referral_code', referredBy)
          .then(() => {
            // Increment referral count
            return supabase.rpc('increment_referral', { ref_code: referredBy });
          })
          .catch(() => {
            // Fallback: just log it
            console.log(`Referral credit pending for ${referredBy}`);
          });
      }
    }

    // Also save as platform subscriber
    if (supabase) {
      await supabase.from('subscribers').upsert({
        email: cleanEmail,
        name,
        source: 'founding_campaign',
        subscribed_at: new Date().toISOString(),
      }, { onConflict: 'email' }).catch(() => {});
    }

    // Send confirmation email
    try {
      const studentNum = currentCount + 1;
      await resend.emails.send({
        from: 'Starky at NewWorld <starky@newworld.education>',
        to: [cleanEmail],
        subject: `🎉 You're Founding Student #${studentNum} — Goody bag incoming!`,
        html: `
<div style="font-family:'Sora',-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#080C18;color:#FAF6EB;padding:40px 28px;border-radius:16px;">
  <div style="text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">🎉</div>
    <h1 style="font-size:24px;font-weight:900;margin:0 0 8px;">
      Welcome, <span style="color:#C9A84C;">${name}!</span>
    </h1>
    <p style="font-size:16px;color:rgba(250,246,235,0.5);margin:0 0 24px;">
      You are Founding Student <strong style="color:#C9A84C;">#${studentNum}</strong> of 100.
    </p>
  </div>

  <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.15);border-radius:14px;padding:20px;margin-bottom:20px;">
    <div style="font-size:13px;font-weight:700;color:#C9A84C;letter-spacing:1px;margin-bottom:10px;">WHAT'S COMING YOUR WAY</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🎁 Mystery Goody Bag — delivered to your door</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">⭐ 3 months FREE premium access (all 17 subjects)</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">🏆 Founding Student badge — forever</div>
    <div style="padding:6px 0;font-size:14px;color:rgba(250,246,235,0.7);">📜 Your name on the Founders Wall</div>
  </div>

  <div style="background:rgba(250,246,235,0.03);border:1px solid rgba(250,246,235,0.06);border-radius:14px;padding:20px;margin-bottom:20px;text-align:center;">
    <div style="font-size:13px;font-weight:700;color:rgba(250,246,235,0.4);letter-spacing:1px;margin-bottom:8px;">UPGRADE YOUR GOODY BAG</div>
    <p style="font-size:14px;color:rgba(250,246,235,0.6);margin:0 0 12px;">Share your link. Every friend who joins upgrades YOUR rewards.</p>
    <div style="background:rgba(201,168,76,0.1);border-radius:8px;padding:10px;font-size:13px;color:#C9A84C;word-break:break-all;">
      https://www.newworld.education/founding?ref=${referralCode}
    </div>
    <div style="margin-top:12px;">
      <a href="https://wa.me/?text=${encodeURIComponent(`I just became Founding Student #${studentNum} at NewWorldEdu! 🎁 Goody bag coming to my door. Only ${MAX_FOUNDING - studentNum} spots left!\n\nhttps://www.newworld.education/founding?ref=${referralCode}`)}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">💬 Share on WhatsApp</a>
    </div>
  </div>

  <div style="text-align:center;">
    <a href="https://www.newworld.education/try" style="display:inline-block;background:#C9A84C;color:#080C18;font-size:16px;font-weight:900;padding:16px 40px;border-radius:12px;text-decoration:none;">
      Start Learning Now →
    </a>
    <p style="font-size:12px;color:rgba(250,246,235,0.3);margin-top:12px;">Your 3 months of free premium access are active.</p>
  </div>
</div>`,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    // Notify Khurram
    try {
      await resend.emails.send({
        from: 'NewWorld System <starky@newworld.education>',
        to: ['khurrambadar@gmail.com'],
        subject: `🎓 Founding Student #${currentCount + 1}: ${name} (${school || city})`,
        html: `<p><strong>${name}</strong> (${cleanEmail}) just became Founding Student #${currentCount + 1}.</p><p>School: ${school || 'N/A'} · Grade: ${grade || 'N/A'} · City: ${city} · Role: ${role}</p><p>Phone: ${phone || 'N/A'}</p><p>Referred by: ${referredBy || 'Direct'}</p>`,
      });
    } catch {}

    return res.status(200).json({
      message: `Welcome, ${name}! You're Founding Student #${currentCount + 1}`,
      studentNumber: currentCount + 1,
      referralCode,
      spotsLeft: Math.max(0, MAX_FOUNDING - currentCount - 1),
    });

  } catch (err) {
    console.error('[founding] Error:', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
