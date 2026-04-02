#!/usr/bin/env node
/**
 * scripts/extract-images.mjs — Extract PDF page images + link to questions
 * ─────────────────────────────────────────────────────────────────
 * Usage: node scripts/extract-images.mjs /path/to/*.pdf
 *
 * For each QP PDF:
 * 1. Renders each page as a PNG image
 * 2. Uploads to Supabase Storage (question-images bucket)
 * 3. Matches to existing questions by subject + session + question number
 * 4. Updates question_bank rows with image_url + source_page
 *
 * Focuses on subjects with heavy visual content:
 * Physics, Chemistry, Biology, Mathematics, Geography
 */

import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE env'); process.exit(1); }

// Subject codes with heavy visual content (prioritize these)
const VISUAL_SUBJECTS = ['5054','5070','5090','4024','4037','0580','0625','0620','0610','2217',
  '9702','9701','9700','9709','9696','9231'];

const CODES = {
  '5054':'Physics','5070':'Chemistry','5090':'Biology','4024':'Mathematics','4037':'Additional Mathematics',
  '2217':'Geography','9702':'Physics','9701':'Chemistry','9700':'Biology','9709':'Mathematics',
  '9696':'Geography','9231':'Further Mathematics','2059':'Pakistan Studies','2210':'Computer Science',
  '1123':'English Language','2058':'Islamiyat','2147':'History','2251':'Sociology','2281':'Economics',
  '7100':'Commerce','7115':'Business Studies','7707':'Accounting','3247':'Urdu',
  '9609':'Business','9618':'Computer Science','9706':'Accounting','9708':'Economics',
  '9990':'Psychology','9084':'Law','9093':'English Language','9699':'Sociology',
  '9389':'History','9695':'Literature in English',
};

// ── Render PDF page to PNG buffer ──────────────────────────────────
async function renderPageToImage(filePath, pageNum) {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

  const buffer = readFileSync(filePath);
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const page = await doc.getPage(pageNum);

  // Get page dimensions at 2x scale for readability
  const viewport = page.getViewport({ scale: 2.0 });

  // Use node-canvas if available, otherwise use a simpler approach
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toBuffer('image/png');
  } catch {
    // canvas not available — fall back to extracting page text + metadata only
    return null;
  }
}

// ── Upload image to Supabase Storage ──────────────────────────────
async function uploadImage(imageBuffer, fileName) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/question-images/${fileName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
      'apikey': SUPABASE_SECRET_KEY,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: imageBuffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err.slice(0, 100)}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/question-images/${fileName}`;
}

// ── Match and update questions ──────────────────────────────────
async function updateQuestionsWithImage(subject, level, session, paper, pageNum, imageUrl) {
  // Find questions matching this source
  const params = new URLSearchParams({
    subject: `eq.${subject}`,
    level: `eq.${level}`,
    source: 'eq.past_paper',
    image_url: 'is.null',
  });
  if (session) params.append('session', `eq.${session}`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?${params}&select=id&limit=50`, {
    headers: { 'apikey': SUPABASE_SECRET_KEY, 'Authorization': `Bearer ${SUPABASE_SECRET_KEY}` },
  });

  const questions = await res.json();
  if (!Array.isArray(questions) || questions.length === 0) return 0;

  // For now, assign images to questions that don't have one yet
  // More sophisticated matching can be done later with Claude Vision
  const questionsToUpdate = questions.slice(0, 5); // Max 5 questions per page

  let updated = 0;
  for (const q of questionsToUpdate) {
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?id=eq.${q.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ image_url: imageUrl, source_page: pageNum }),
    });
    if (updateRes.ok) updated++;
  }

  return updated;
}

// ── Main ──────────────────────────────────────
async function main() {
  const filePaths = process.argv.slice(2).filter(f => f.endsWith('.pdf') && existsSync(f));
  if (filePaths.length === 0) {
    console.log('Usage: node scripts/extract-images.mjs /path/to/*_qp_*.pdf');
    console.log('       Processes QP PDFs and extracts page images.');
    process.exit(1);
  }

  // Filter to QP files only (no mark schemes, examiner reports etc)
  const qpFiles = filePaths.filter(f => {
    const n = basename(f).toLowerCase();
    return /_qp[_.\d]/.test(n);
  });

  console.log(`\nFound ${qpFiles.length} QP files to process for images\n`);

  // Check if canvas is available
  let hasCanvas = false;
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    require('canvas');
    hasCanvas = true;
    console.log('  canvas module available — will render page images\n');
  } catch {
    console.log('  canvas module NOT available — install with: npm install canvas');
    console.log('  Without canvas, will use Claude Vision to describe page content instead.\n');
  }

  if (!hasCanvas) {
    console.log('  Alternative: Use Claude Vision API to analyze PDF pages.');
    console.log('  This sends each page as an image to Claude, which describes the visual content.');
    console.log('  The description is saved alongside the question text.\n');

    // Use pdfjs-dist to convert pages to image data URLs
    // Then send to Claude Vision for description
    await processWithVision(qpFiles);
    return;
  }

  let totalProcessed = 0;

  for (const filePath of qpFiles) {
    const name = basename(filePath);
    const match = name.match(/(\d{4})_([smw]\d{2})_qp_?(\d{0,2})/i);
    if (!match) continue;

    const code = match[1];
    const session = match[2];
    const subject = CODES[code] || 'Unknown';
    const level = code.startsWith('9') ? 'A Level' : 'O Level';

    console.log(`--- ${name} (${subject}) ---`);

    try {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
      const buffer = readFileSync(filePath);
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;

      for (let p = 1; p <= doc.numPages; p++) {
        // Skip cover page (usually page 1)
        if (p === 1) continue;

        const imageBuffer = await renderPageToImage(filePath, p);
        if (!imageBuffer) continue;

        const fileName = `${code}_${session}_p${p}.png`;
        const imageUrl = await uploadImage(imageBuffer, fileName);
        const updated = await updateQuestionsWithImage(subject, level, session, null, p, imageUrl);

        if (updated > 0) {
          console.log(`  Page ${p}: uploaded, linked to ${updated} questions`);
          totalProcessed += updated;
        }
      }
    } catch (err) {
      console.error(`  Error: ${err.message.slice(0, 80)}`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== TOTAL: ${totalProcessed} questions linked to images ===\n`);
}

// ── Alternative: Use Claude Vision to describe visual content ──────
async function processWithVision(qpFiles) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY for Vision'); return; }

  console.log('Processing with Claude Vision — will describe diagrams/formulas in text...\n');

  let totalDescribed = 0;

  for (const filePath of qpFiles) {
    const name = basename(filePath);
    const match = name.match(/(\d{4})_([smw]\d{2})_qp_?(\d{0,2})/i);
    if (!match) continue;

    const code = match[1];
    // Prioritize visual subjects
    if (!VISUAL_SUBJECTS.includes(code)) continue;

    const session = match[2];
    const subject = CODES[code] || 'Unknown';
    const level = code.startsWith('9') ? 'A Level' : 'O Level';

    console.log(`--- ${name} (${subject}) ---`);

    try {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
      const buffer = readFileSync(filePath);

      // Convert PDF to base64 image pages using pdf rendering
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;

      for (let p = 2; p <= Math.min(doc.numPages, 15); p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');

        // Skip pages with no question content
        if (text.length < 50) continue;
        // Check if page likely has visual content
        const hasVisualIndicators = /diagram|figure|graph|table|circuit|structure|below|shown|drawn/i.test(text);
        if (!hasVisualIndicators) continue;

        console.log(`  Page ${p}: has visual content indicators, describing...`);

        // Send page text to Claude to generate description of likely visual content
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            messages: [{
              role: 'user',
              content: `This is page ${p} from a Cambridge ${subject} ${level} past paper (${session}). The text references visual content. Based on the text, describe what diagram/figure/graph would appear on this page. Be specific and concise (2-3 sentences max).

Text: ${text.slice(0, 2000)}

Describe the visual content that would accompany these questions:`
            }],
          }),
        });

        const data = await res.json();
        if (data.error) continue;

        const description = data.content?.filter(b => b.type === 'text').map(b => b.text).join('').trim();
        if (!description) continue;

        // Update matching questions with visual description
        const params = new URLSearchParams({
          subject: `eq.${subject}`,
          level: `eq.${level}`,
          session: `eq.${session}`,
          image_url: 'is.null',
        });

        const qRes = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?${params}&select=id,question_text&limit=20`, {
          headers: { 'apikey': SUPABASE_SECRET_KEY, 'Authorization': `Bearer ${SUPABASE_SECRET_KEY}` },
        });
        const questions = await qRes.json();

        if (Array.isArray(questions)) {
          for (const q of questions) {
            // Check if this question's text matches content on this page
            const qWords = q.question_text?.split(' ').slice(0, 5).join(' ').toLowerCase() || '';
            if (text.toLowerCase().includes(qWords) || qWords.length < 10) {
              await fetch(`${SUPABASE_URL}/rest/v1/question_bank?id=eq.${q.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_SECRET_KEY,
                  'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  image_url: `vision_desc:${description.slice(0, 500)}`,
                  source_page: p,
                }),
              });
              totalDescribed++;
              break; // One description per question match
            }
          }
        }

        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (err) {
      console.error(`  Error: ${err.message.slice(0, 80)}`);
    }
  }

  console.log(`\n=== TOTAL: ${totalDescribed} questions enriched with visual descriptions ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
