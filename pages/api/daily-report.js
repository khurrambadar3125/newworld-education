// pages/api/daily-report.js
// Autonomous platform intelligence engine
// Runs daily via Vercel cron, analyses user behaviour, emails Khurram
// with AI-generated diagnosis and specific actionable fixes

import { kv } from "@vercel/kv";
import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── EMAIL SENDER ──────────────────────────────────────────────────────────────
async function sendEmail(subject, htmlBody) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.REPORT_EMAIL_FROM,       // your Gmail
      pass: process.env.REPORT_EMAIL_APP_PASS,   // Gmail app password
    },
  });

  await transporter.sendMail({
    from: `"NewWorld Intelligence" <${process.env.REPORT_EMAIL_FROM}>`,
    to: "khurram@newworld.education",
    subject,
    html: htmlBody,
  });
}

// ── DATA COLLECTOR ────────────────────────────────────────────────────────────
async function collectLast7Days() {
  const days = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split("T")[0];
    const events = await kv.get(`events:${dayStr}`) || [];
    const counters = await kv.get(`counters:${dayStr}`) || {};
    days.push({ date: dayStr, events, counters });
  }

  return days;
}

// ── DATA SUMMARISER ───────────────────────────────────────────────────────────
function summariseData(days) {
  const totals = {
    pageViews: 0, messages: 0, errors: 0, abandonments: 0,
    limitReached: 0, mobileUsers: 0, desktopUsers: 0, tabletUsers: 0,
    subjects: {}, profiles: {}, avgSessionDepth: 0, sessionDepths: [],
    avgAbandonment: 0, abandonmentTimes: [], avgResponseMs: 0, responseTimes: [],
    startersUsed: 0, ctaClicks: {}, navClicks: {},
  };

  for (const day of days) {
    for (const e of day.events) {
      if (e.event === "page_view") totals.pageViews++;
      if (e.event === "message_sent") {
        totals.messages++;
        if (e.responseTimeMs) totals.responseTimes.push(e.responseTimeMs);
      }
      if (e.event === "api_error") totals.errors++;
      if (e.event === "session_abandoned") {
        totals.abandonments++;
        if (e.secondsOnPage) totals.abandonmentTimes.push(e.secondsOnPage);
      }
      if (e.event === "limit_reached") totals.limitReached++;
      if (e.device === "mobile") totals.mobileUsers++;
      if (e.device === "desktop") totals.desktopUsers++;
      if (e.device === "tablet") totals.tabletUsers++;
      if (e.event === "message_sent" && e.subject)
        totals.subjects[e.subject] = (totals.subjects[e.subject] || 0) + 1;
      if (e.event === "profile_selected" && e.profile)
        totals.profiles[e.profile] = (totals.profiles[e.profile] || 0) + 1;
      if (e.event === "session_depth" && e.messageCount)
        totals.sessionDepths.push(e.messageCount);
      if (e.event === "starter_used") totals.startersUsed++;
      if (e.event === "cta_clicked" && e.label)
        totals.ctaClicks[e.label] = (totals.ctaClicks[e.label] || 0) + 1;
      if (e.event === "nav_clicked" && e.label)
        totals.navClicks[e.label] = (totals.navClicks[e.label] || 0) + 1;
    }
  }

  totals.avgSessionDepth = totals.sessionDepths.length
    ? (totals.sessionDepths.reduce((a, b) => a + b, 0) / totals.sessionDepths.length).toFixed(1)
    : 0;
  totals.avgAbandonment = totals.abandonmentTimes.length
    ? Math.round(totals.abandonmentTimes.reduce((a, b) => a + b, 0) / totals.abandonmentTimes.length)
    : 0;
  totals.avgResponseMs = totals.responseTimes.length
    ? Math.round(totals.responseTimes.reduce((a, b) => a + b, 0) / totals.responseTimes.length)
    : 0;

  return totals;
}

// ── AI ANALYST ────────────────────────────────────────────────────────────────
async function analyseWithClaude(summary) {
  const prompt = `You are the autonomous product intelligence system for NewWorld Education — a free AI tutoring platform (Starky) for students KG to A Level in 16 languages, primarily used in Pakistan, UAE, and globally on mobile devices.

Here is the user behaviour data from the last 7 days:

TRAFFIC:
- Total page views: ${summary.pageViews}
- Messages sent to Starky: ${summary.messages}
- Mobile users: ${summary.mobileUsers} | Desktop: ${summary.desktopUsers} | Tablet: ${summary.tabletUsers}
- Mobile share: ${summary.pageViews > 0 ? Math.round(summary.mobileUsers / summary.pageViews * 100) : 0}%

ENGAGEMENT:
- Average session depth (messages per session): ${summary.avgSessionDepth}
- Starter questions used (vs typed): ${summary.startersUsed} of ${summary.messages} messages
- Sessions abandoned without messaging: ${summary.abandonments}
- Average time before abandonment: ${summary.avgAbandonment}s

PROBLEMS:
- API errors: ${summary.errors}
- Users who hit session limit: ${summary.limitReached}
- Average Starky response time: ${summary.avgResponseMs}ms

SUBJECT USAGE (most to least used):
${Object.entries(summary.subjects).sort((a,b) => b[1]-a[1]).map(([k,v]) => `  ${k}: ${v} messages`).join('\n') || '  No data yet'}

SPECIAL NEEDS PROFILES SELECTED:
${Object.entries(summary.profiles).sort((a,b) => b[1]-a[1]).map(([k,v]) => `  ${k}: ${v} selections`).join('\n') || '  No data yet'}

CTA PERFORMANCE:
${Object.entries(summary.ctaClicks).map(([k,v]) => `  "${k}": ${v} clicks`).join('\n') || '  No data yet'}

PLATFORM CONTEXT:
- Primary device: Mobile (most students in Pakistan/UAE use mobile)
- Platform goal: Free autonomous AI tutoring, fully self-serve
- Tech: Next.js on Vercel, Starky = Claude Haiku
- Pages: / (homepage), /demo (main chat), /special-needs, /parent, /past-papers

Your job: Analyse this data and produce a strategic report for Khurram (founder). 

Identify EXACTLY what is working well, what problems exist, and give SPECIFIC code-level or content-level suggestions Khurram can implement immediately.

Format your response as JSON with this structure:
{
  "headline": "One sentence summary of the week",
  "health_score": 1-10,
  "top_wins": ["win 1", "win 2", "win 3"],
  "problems": [
    {
      "title": "Short problem name",
      "severity": "critical|high|medium|low",
      "evidence": "What the data shows",
      "diagnosis": "Why this is happening",
      "fix": "Specific actionable solution — be precise, include what to change and where",
      "expected_impact": "What improvement this will cause"
    }
  ],
  "quick_wins": ["1 specific change that takes <1 hour and will have immediate impact", "..."],
  "strategic_recommendation": "2-3 sentences on the most important direction for next 2 weeks",
  "starky_quality_notes": "Assessment of AI response quality issues if any",
  "next_report_focus": "What to watch next week"
}`;

  const response = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── EMAIL BUILDER ─────────────────────────────────────────────────────────────
function buildEmail(analysis, summary, dateRange) {
  const severityColor = { critical: "#FF4444", high: "#FF8C00", medium: "#FFC300", low: "#A8E063" };
  const severityBg = { critical: "#2D0000", high: "#1A1000", medium: "#1A1400", low: "#0D1A0D" };

  const problemsHtml = analysis.problems.map(p => `
    <div style="background:${severityBg[p.severity] || "#111"};border-left:4px solid ${severityColor[p.severity] || "#666"};border-radius:8px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="background:${severityColor[p.severity]};color:#000;font-size:10px;font-weight:800;padding:3px 10px;border-radius:12px;text-transform:uppercase;">${p.severity}</span>
        <strong style="font-size:16px;color:#fff;">${p.title}</strong>
      </div>
      <p style="color:#aaa;font-size:13px;margin:0 0 8px;"><strong style="color:#ccc;">Evidence:</strong> ${p.evidence}</p>
      <p style="color:#aaa;font-size:13px;margin:0 0 8px;"><strong style="color:#ccc;">Diagnosis:</strong> ${p.diagnosis}</p>
      <div style="background:rgba(99,210,255,0.08);border:1px solid rgba(99,210,255,0.2);border-radius:6px;padding:14px;margin:10px 0;">
        <strong style="color:#63D2FF;font-size:12px;">🔧 THE FIX:</strong>
        <p style="color:#ddd;font-size:13px;margin:8px 0 0;line-height:1.6;">${p.fix}</p>
      </div>
      <p style="color:#888;font-size:12px;margin:8px 0 0;"><strong style="color:#aaa;">Expected impact:</strong> ${p.expected_impact}</p>
    </div>
  `).join("");

  const winsHtml = analysis.top_wins.map(w =>
    `<li style="padding:6px 0;color:#A8E063;font-size:14px;">✅ ${w}</li>`
  ).join("");

  const quickWinsHtml = analysis.quick_wins.map(w =>
    `<li style="padding:8px 0;color:#ddd;font-size:14px;border-bottom:1px solid #222;">⚡ ${w}</li>`
  ).join("");

  const healthColor = analysis.health_score >= 8 ? "#A8E063" : analysis.health_score >= 5 ? "#FFC300" : "#FF4444";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#060B20;color:#fff;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">
  <div style="max-width:680px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;padding:32px;background:linear-gradient(135deg,rgba(99,210,255,0.1),rgba(168,224,99,0.07));border:1px solid rgba(99,210,255,0.2);border-radius:16px;">
      <div style="font-size:40px;margin-bottom:8px;">🌍</div>
      <h1 style="font-size:22px;font-weight:900;margin:0 0 6px;color:#63D2FF;">NewWorld Intelligence Report</h1>
      <div style="font-size:13px;color:rgba(255,255,255,0.45);">${dateRange}</div>
      <div style="margin-top:16px;display:inline-block;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:8px 24px;">
        <span style="font-size:28px;font-weight:900;color:${healthColor};">${analysis.health_score}</span>
        <span style="font-size:14px;color:#888;">/10 Platform Health</span>
      </div>
    </div>

    <!-- Headline -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;font-size:16px;font-weight:600;color:#fff;line-height:1.6;">
      📋 ${analysis.headline}
    </div>

    <!-- Key Stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;">
      ${[
        { label: "Page Views", value: summary.pageViews },
        { label: "Starky Messages", value: summary.messages },
        { label: "Mobile Users", value: `${summary.mobileUsers}` },
        { label: "API Errors", value: summary.errors },
        { label: "Avg Session Depth", value: `${summary.avgSessionDepth} msgs` },
        { label: "Abandonments", value: summary.abandonments },
      ].map(s => `
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#63D2FF;">${s.value}</div>
          <div style="font-size:11px;color:#666;margin-top:4px;">${s.label}</div>
        </div>
      `).join("")}
    </div>

    <!-- Wins -->
    <div style="background:rgba(168,224,99,0.06);border:1px solid rgba(168,224,99,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <h2 style="font-size:15px;font-weight:800;color:#A8E063;margin:0 0 14px;">🏆 What's Working</h2>
      <ul style="margin:0;padding-left:0;list-style:none;">${winsHtml}</ul>
    </div>

    <!-- Problems -->
    <h2 style="font-size:18px;font-weight:900;margin:0 0 16px;">⚠️ Problems Found + Specific Fixes</h2>
    ${problemsHtml}

    <!-- Quick Wins -->
    <div style="background:rgba(99,210,255,0.06);border:1px solid rgba(99,210,255,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <h2 style="font-size:15px;font-weight:800;color:#63D2FF;margin:0 0 14px;">⚡ Quick Wins (implement today)</h2>
      <ul style="margin:0;padding-left:0;list-style:none;">${quickWinsHtml}</ul>
    </div>

    <!-- Starky Quality -->
    ${analysis.starky_quality_notes ? `
    <div style="background:rgba(255,140,0,0.06);border:1px solid rgba(255,140,0,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <h2 style="font-size:15px;font-weight:800;color:#FF8C00;margin:0 0 10px;">🤖 Starky AI Quality Assessment</h2>
      <p style="color:#ccc;font-size:14px;line-height:1.65;margin:0;">${analysis.starky_quality_notes}</p>
    </div>` : ""}

    <!-- Strategic Recommendation -->
    <div style="background:linear-gradient(135deg,rgba(99,210,255,0.1),rgba(168,224,99,0.07));border:1px solid rgba(99,210,255,0.25);border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="font-size:15px;font-weight:800;color:#fff;margin:0 0 12px;">🎯 Strategic Focus (Next 2 Weeks)</h2>
      <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0;">${analysis.strategic_recommendation}</p>
    </div>

    <!-- Next Report -->
    <div style="text-align:center;padding:20px;border-top:1px solid rgba(255,255,255,0.07);color:#555;font-size:12px;">
      <p style="margin:0 0 4px;">Next report focus: <em style="color:#888;">${analysis.next_report_focus}</em></p>
      <p style="margin:0;">NewWorld Education · Autonomous Intelligence System · khurram@newworld.education</p>
    </div>

  </div>
</body>
</html>`;
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Security: only Vercel cron or manual with secret key
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('[DAILY REPORT] CRON_SECRET env var is not set — rejecting request');
    return res.status(500).json({ error: "Server misconfiguration: CRON_SECRET not set" });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  try {
    console.log("🔍 Collecting data...");
    const days = await collectLast7Days();
    const summary = summariseData(days);

    // Skip if no meaningful data yet
    if (summary.pageViews < 5 && summary.messages < 2) {
      return res.status(200).json({
        status: "skipped",
        reason: "Insufficient data (less than 5 page views)",
        summary,
      });
    }

    console.log("🧠 Analysing with Claude...");
    const analysis = await analyseWithClaude(summary);

    const dateRange = `${days[6].date} → ${days[0].date}`;
    const emailHtml = buildEmail(analysis, summary, dateRange);

    console.log("📧 Sending email...");
    await sendEmail(
      `🌍 NewWorld Intelligence: ${analysis.headline} (Health: ${analysis.health_score}/10)`,
      emailHtml
    );

    // Store report in KV for reference
    await kv.set(`report:${days[0].date}`, { analysis, summary }, { ex: 60 * 60 * 24 * 90 });

    res.status(200).json({
      status: "sent",
      health_score: analysis.health_score,
      problems_found: analysis.problems.length,
      date_range: dateRange,
    });

  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: err.message });
  }
}
