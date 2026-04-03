/**
 * /api/cron/evolution-report.js
 * Daily evolution report — emailed to Khurram every day at 10am PKT (05:00 UTC).
 * Shows what the platform learned yesterday, what it improved, and action items.
 */

import { getSupabase } from '../../../utils/supabase';
import { Resend } from 'resend';
import { getAnthropicClient } from '../../../utils/anthropicClient';

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const sb = getSupabase();
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    const weekAgo = dayAgo; // Use 24h window for daily report

    // Gather last 24 hours of insights from Supabase
    let totalMessages = 0, totalConfusions = 0, totalDrills = 0;
    const allConfusionTopics = {};
    const allGrades = {};
    const allSubjects = {};
    const hourlyTotal = new Array(24).fill(0);
    const sentimentTotal = { positive: 0, neutral: 0, frustrated: 0, confused: 0 };
    const langTotal = { english: 0, roman_urdu: 0, urdu_script: 0 };

    if (sb) {
      const { data: dailyInsights } = await sb.from('platform_insights')
        .select('data')
        .eq('insight_type', 'daily')
        .gte('date', weekAgo.toISOString().split('T')[0])
        .limit(7);

      for (const row of (dailyInsights || [])) {
        const ins = row.data || {};
        totalMessages += ins.totalMessages || 0;
        totalConfusions += ins.totalConfusions || 0;
        totalDrills += ins.totalDrills || 0;
        for (const [g, c] of Object.entries(ins.gradeActivity || {})) allGrades[g] = (allGrades[g] || 0) + c;
        for (const [s, c] of Object.entries(ins.subjectActivity || {})) allSubjects[s] = (allSubjects[s] || 0) + c;
        for (const t of (ins.topConfusionTopics || [])) allConfusionTopics[t.topic] = (allConfusionTopics[t.topic] || 0) + t.confusionCount;
        for (const [s, c] of Object.entries(ins.sentimentBreakdown || {})) sentimentTotal[s] = (sentimentTotal[s] || 0) + c;
        for (const [l, c] of Object.entries(ins.languageBreakdown || {})) langTotal[l] = (langTotal[l] || 0) + c;
        (ins.hourlyActivity || []).forEach((c, h) => { hourlyTotal[h] += c; });
      }
    }

    // Get improvements from this week
    const improvements = [];
    if (sb) {
      const { data: impRows } = await sb.from('platform_insights')
        .select('data')
        .eq('insight_type', 'improvements')
        .gte('date', weekAgo.toISOString().split('T')[0])
        .limit(7);
      for (const row of (impRows || [])) {
        improvements.push(...(row.data?.improvements || []));
      }
    }

    // Top confusion topics
    const topConfusion = Object.entries(allConfusionTopics)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Top grades
    const topGrades = Object.entries(allGrades)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Peak hour (PKT = UTC+5)
    const peakHourUTC = hourlyTotal.indexOf(Math.max(...hourlyTotal));
    const peakHourPKT = (peakHourUTC + 5) % 24;

    // Top subjects
    const topSubjects = Object.entries(allSubjects)
      .sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Calculate satisfaction rate
    const totalSentiment = Object.values(sentimentTotal).reduce((a, b) => a + b, 0);
    const satisfactionRate = totalSentiment > 0 ? Math.round((sentimentTotal.positive / totalSentiment) * 100) : 0;

    // ── Teaching insights aggregation ──────────────────────────────────
    let teachingData = { totalSessions: 0, topStrategies: [], learningStyles: {}, peakEngagement: [] };
    if (sb) {
      try {
        const { data: insights } = await sb.from('teaching_insights')
          .select('what_worked, what_didnt_work, learning_style, engagement_peaks, engagement_level, grade')
          .gte('created_at', weekAgo.toISOString())
          .limit(1000);

        if (insights?.length) {
          teachingData.totalSessions = insights.length;
          const stratCount = {};
          const failCount = {};
          const peakExamples = [];
          for (const ins of insights) {
            for (const w of (ins.what_worked || [])) stratCount[w] = (stratCount[w] || 0) + 1;
            for (const f of (ins.what_didnt_work || [])) failCount[f] = (failCount[f] || 0) + 1;
            if (ins.learning_style) teachingData.learningStyles[ins.learning_style] = (teachingData.learningStyles[ins.learning_style] || 0) + 1;
            for (const p of (ins.engagement_peaks || [])) { if (peakExamples.length < 10) peakExamples.push(p); }
          }
          teachingData.topStrategies = Object.entries(stratCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
          teachingData.topFailures = Object.entries(failCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
          teachingData.peakEngagement = peakExamples;
        }
      } catch {}

      // Also get effective strategies discovered by auto-improver
      try {
        const { data: stratInsights } = await sb.from('platform_insights')
          .select('data')
          .eq('insight_type', 'effective_strategies')
          .gte('date', weekAgo.toISOString().split('T')[0])
          .limit(1);
        if (stratInsights?.[0]?.data?.strategies) {
          teachingData.discoveredStrategies = stratInsights[0].data.strategies;
        }
      } catch {}
    }

    // ── Claude-generated recommendations ─────────────────────────────
    let aiRecommendations = '';
    try {
      const anthropic = getAnthropicClient();
      const analysisPrompt = `You are the AI advisor for NewWorld Education, an AI tutoring platform in Pakistan (KG to A-Levels). Analyse this week's data and give me 3-5 SPECIFIC, ACTIONABLE recommendations to improve the platform. Be concrete — say exactly what to change in prompts, UI, or features.

WEEK DATA:
- ${totalMessages} messages, ${totalDrills} drills, ${satisfactionRate}% satisfaction
- Top confusion topics: ${topConfusion.map(([t, c]) => `${t} (${c}x)`).join(', ') || 'None'}
- Top subjects: ${topSubjects.map(([s, c]) => `${s} (${c})`).join(', ') || 'None'}
- Top grades: ${topGrades.map(([g, c]) => `${g} (${c})`).join(', ') || 'None'}
- Language breakdown: ${langTotal.english} English, ${langTotal.roman_urdu} Roman Urdu, ${langTotal.urdu_script} Urdu
- Peak hour: ${peakHourPKT}:00 PKT
- Confusion rate: ${totalMessages > 0 ? Math.round((totalConfusions / totalMessages) * 100) : 0}%
- Sessions analysed: ${teachingData.totalSessions}
- Top working strategies: ${teachingData.topStrategies.map(([s, c]) => `${s} (${c}x)`).join(', ') || 'None yet'}
- Strategies that failed: ${(teachingData.topFailures || []).map(([s, c]) => `${s} (${c}x)`).join(', ') || 'None yet'}
- Learning styles: ${JSON.stringify(teachingData.learningStyles)}
- Engagement peaks: ${teachingData.peakEngagement.slice(0, 5).join('; ') || 'None yet'}
- Auto-improvements applied: ${improvements.map(i => i.detail).join('; ') || 'None'}

Give recommendations as numbered bullet points. Focus on:
1. Specific prompt changes (what to add/modify in Starky's instructions)
2. Teaching approach adjustments per age group
3. New features that would directly improve learning outcomes
4. Gaps in the data that need better tracking
Keep each recommendation under 2 sentences. Be direct.`;

      const resp = await anthropic.messages.create({
        model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        max_tokens: 600,
        messages: [{ role: 'user', content: analysisPrompt }],
      });
      aiRecommendations = resp.content?.[0]?.text || '';
    } catch (err) {
      aiRecommendations = 'AI analysis unavailable this week.';
    }

    // Generate one action item
    let actionItem = 'No specific action needed this week.';
    if (topConfusion.length > 0) {
      actionItem = `${topConfusion[0][1]} students struggled with "${topConfusion[0][0]}" this week. Consider adding a dedicated visual explanation or diagram for this topic — it would immediately help the most students.`;
    }

    // Build email
    const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:auto;background:#0D1221;color:#fff;border-radius:20px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#4F8EF7,#7C5CBF);padding:28px 24px">
        <div style="font-size:24px;font-weight:800;font-family:'Sora',sans-serif">Daily Platform Report ★</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:6px">${new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} — Last 24 hours</div>
      </div>

      <div style="padding:24px">
        <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
          <div style="flex:1;min-width:120px;background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.2);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:800;color:#4F8EF7">${totalMessages.toLocaleString()}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4)">Messages</div>
          </div>
          <div style="flex:1;min-width:120px;background:rgba(168,224,99,0.1);border:1px solid rgba(168,224,99,0.2);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:800;color:#A8E063">${totalDrills.toLocaleString()}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4)">Drills</div>
          </div>
          <div style="flex:1;min-width:120px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:800;color:#A78BFA">${satisfactionRate}%</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4)">Satisfaction</div>
          </div>
        </div>

        <h3 style="font-size:14px;color:#4F8EF7;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">1. What Students Found Confusing</h3>
        ${topConfusion.length ? topConfusion.map(([topic, count]) => `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px"><span style="color:rgba(255,255,255,0.7)">${topic}</span> <span style="float:right;color:#F87171;font-weight:700">${count} confusions</span></div>`).join('') : '<div style="color:rgba(255,255,255,0.4);font-size:13px">No confusion data yet</div>'}

        <h3 style="font-size:14px;color:#A8E063;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">2. Most Active Grades</h3>
        ${topGrades.map(([grade, count]) => `<div style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.6)">${grade}: ${count} messages</div>`).join('') || '<div style="color:rgba(255,255,255,0.4);font-size:13px">No data yet</div>'}

        <h3 style="font-size:14px;color:#A78BFA;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">3. Autonomous Improvements This Week</h3>
        ${improvements.length ? improvements.map(imp => `<div style="padding:8px 12px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.15);border-radius:8px;margin-bottom:8px;font-size:13px;color:rgba(255,255,255,0.7)">✓ ${imp.detail}</div>`).join('') : '<div style="color:rgba(255,255,255,0.4);font-size:13px">No autonomous improvements yet — need more signal data</div>'}

        <h3 style="font-size:14px;color:#63D2FF;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">4. What's Working (Teaching Strategies)</h3>
        ${teachingData.topStrategies.length ? `<div style="margin-bottom:12px">${teachingData.topStrategies.map(([strat, count]) => `<span style="display:inline-block;background:rgba(99,210,255,0.1);border:1px solid rgba(99,210,255,0.2);border-radius:100px;padding:4px 12px;margin:3px 4px;font-size:12px;color:rgba(255,255,255,0.8)">${strat} <strong style="color:#63D2FF">${count}x</strong></span>`).join('')}</div>` : '<div style="color:rgba(255,255,255,0.4);font-size:13px">Need more session data to identify patterns</div>'}
        ${(teachingData.topFailures || []).length ? `<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:8px">Needs improvement: ${teachingData.topFailures.map(([s, c]) => `${s} (${c}x low engagement)`).join(', ')}</div>` : ''}
        ${teachingData.peakEngagement.length ? `<div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.5)"><strong style="color:rgba(255,255,255,0.7)">Engagement peaks:</strong> ${teachingData.peakEngagement.slice(0, 3).join(' | ')}</div>` : ''}

        <h3 style="font-size:14px;color:#FF8C69;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">5. AI Recommendations (Claude-Generated)</h3>
        <div style="padding:14px 16px;background:rgba(255,140,105,0.08);border:1px solid rgba(255,140,105,0.15);border-radius:12px;font-size:13px;color:rgba(255,255,255,0.8);line-height:1.8;white-space:pre-wrap">${aiRecommendations}</div>

        <h3 style="font-size:14px;color:#FFC300;margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">6. Priority Action</h3>
        <div style="padding:14px 16px;background:rgba(255,195,0,0.08);border:1px solid rgba(255,195,0,0.2);border-radius:12px;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7">${actionItem}</div>

        <h3 style="font-size:14px;color:rgba(255,255,255,0.3);margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.08em">7. Platform Health</h3>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);line-height:2">
          Peak study hour: ${peakHourPKT}:00 PKT<br>
          Language: ${langTotal.english} English, ${langTotal.roman_urdu} Roman Urdu, ${langTotal.urdu_script} Urdu<br>
          Top subject: ${topSubjects[0]?.[0] || 'N/A'}<br>
          Confusion rate: ${totalMessages > 0 ? Math.round((totalConfusions / totalMessages) * 100) : 0}%
        </div>
      </div>

      ${await (async () => {
        // Today's articles section
        try {
          const today = new Date().toISOString().split('T')[0];
          const { data: articles } = await sb.from('news_articles').select('title, category, body, id').eq('date', today).order('created_at', { ascending: false }).limit(3);
          if (articles?.length) {
            return `<div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08)">
              <h3 style="color:#FFC300;margin:0 0 12px">TODAY'S ARTICLES — ${today}</h3>
              ${articles.map((a, i) => `<div style="margin-bottom:12px">
                <div style="font-weight:700;color:#fff">${i+1}. ${a.title}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.5)">Category: ${a.category || 'General'} · Words: ${a.body?.split(/\\s+/).length || 0}</div>
                <div style="font-size:12px"><a href="https://www.newworld.education/news#${a.id}" style="color:#4F8EF7">Read →</a></div>
              </div>`).join('')}
            </div>`;
          }
          return `<div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08)">
            <h3 style="color:#FF6B6B;margin:0 0 8px">⚠️ No articles published today</h3>
            <p style="font-size:12px;color:rgba(255,255,255,0.5);margin:0">Check /api/cron/publish-news</p>
          </div>`;
        } catch { return ''; }
      })()}

      <div style="padding:16px 24px;background:rgba(79,142,247,0.05);border-top:1px solid rgba(79,142,247,0.15)">
        <div style="font-size:13px;font-weight:700;color:#4F8EF7;margin-bottom:8px">Platform Learning Engine</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6">
          The autonomous learning engine analyses every session to make Starky smarter.<br>
          5 loops: Content Gap Detection → Explanation Effectiveness → Success Patterns → Struggle Mapping → KB Auto-Enhancement.<br>
          View full learning report at /api/platform/learning-report
        </div>
      </div>
      <div style="padding:16px 24px;background:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(255,255,255,0.25);text-align:center">
        NWE Self-Improvement Engine — generated automatically at ${new Date().toISOString()}
      </div>
    </div>`;

    await resend.emails.send({
      from: 'Starky <starky@newworld.education>',
      to: 'khurrambadar@gmail.com',
      subject: `★ Daily Platform Report — ${new Date().toLocaleDateString('en-GB', {day:'numeric',month:'short'})} — ${totalMessages} messages, ${improvements.length} improvements`,
      html,
    });

    console.log('[EVOLUTION REPORT] Sent successfully.');
    return res.status(200).json({ ok: true, messages: totalMessages, improvements: improvements.length });
  } catch (err) {
    console.error('[EVOLUTION REPORT ERROR]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
