#!/usr/bin/env node
/**
 * scripts/fix-tags.mjs — Fix ALL mistagged questions in one run
 */
import { config } from 'dotenv';
config({ path: '.env.vercel' });
config({ path: '.env.local' });

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;

async function batchPatch(filter, updates) {
  let total = 0;
  while (true) {
    const res = await fetch(`${URL}/rest/v1/question_bank?${filter}&select=id&limit=500`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
    });
    const ids = (await res.json()).map(r => r.id);
    if (!ids.length) break;

    await fetch(`${URL}/rest/v1/question_bank?id=in.(${ids.join(',')})`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=minimal' },
      body: JSON.stringify(updates)
    });
    total += ids.length;
    process.stdout.write(`  ${total}...\r`);
  }
  return total;
}

async function getCount(filter) {
  const res = await fetch(`${URL}/rest/v1/question_bank?${filter}&select=id`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'count=exact', Range: '0-0' }
  });
  return parseInt((res.headers.get('content-range') || '0/0').split('/')[1]) || 0;
}

async function main() {
  console.log('=== FIXING ALL MISTAGGED QUESTIONS ===\n');

  // 1. SAT curriculum tag — ensure all SAT questions have curriculum: 'sat'
  console.log('1. SAT curriculum tag...');
  let n = await batchPatch('source=eq.sat_book&curriculum=neq.edexcel&curriculum=neq.sat', { curriculum: 'sat' });
  console.log(`  SAT curriculum fixed: ${n}`);

  // 2. 11+ papers — find by subject patterns
  console.log('\n2. 11+ papers...');
  n = await batchPatch('source=eq.sat_book&subject=ilike.*11+*', { curriculum: '11_plus', level: 'Year 6', source: 'past_paper' });
  console.log(`  11+ by subject name: ${n}`);
  // Also by topic
  n = await batchPatch('source=eq.sat_book&topic=ilike.*verbal%20reasoning*', { curriculum: '11_plus', level: 'Year 6', source: 'past_paper' });
  console.log(`  11+ verbal reasoning: ${n}`);
  n = await batchPatch('source=eq.sat_book&topic=ilike.*non-verbal*', { curriculum: '11_plus', level: 'Year 6', source: 'past_paper' });
  console.log(`  11+ non-verbal: ${n}`);

  // 3. SEN — ensure functional_skills curriculum
  console.log('\n3. SEN...');
  n = await batchPatch('source=eq.sen_paper&curriculum=is.null', { curriculum: 'functional_skills' });
  console.log(`  SEN null curriculum fixed: ${n}`);

  // 4. Remaining Edexcel science topics still tagged SAT
  console.log('\n4. Remaining Edexcel in SAT...');
  const edexcelTopics = [
    'Electrolysis', 'Metallic Bonding', 'Extraction', 'Reactivity',
    'Alkanes', 'Alkenes', 'Polymers', 'Chromatography', 'Distillation',
    'Combustion', 'Oxidation', 'Reduction', 'Titration', 'Moles',
    'Diffusion', 'Osmosis', 'Enzymes', 'Hormones', 'Homeostasis',
    'Nervous System', 'Reflex Arc', 'DNA', 'Mitosis', 'Meiosis',
    'Natural Selection', 'Vaccination', 'Antibiotics',
    'Momentum', 'Density', 'Pressure', 'Specific Heat',
    'Half-life', 'Nuclear', 'Lens', 'Reflection', 'Refraction',
    'Transformer', 'Generator', 'Motor Effect', 'Electromagnetic'
  ];

  for (const topic of edexcelTopics) {
    const chem = ['Electrolysis','Metallic Bonding','Extraction','Reactivity','Alkanes','Alkenes','Polymers','Chromatography','Distillation','Combustion','Oxidation','Reduction','Titration','Moles'];
    const bio = ['Diffusion','Osmosis','Enzymes','Hormones','Homeostasis','Nervous System','Reflex Arc','DNA','Mitosis','Meiosis','Natural Selection','Vaccination','Antibiotics'];
    const subj = chem.includes(topic) ? 'Chemistry' : bio.includes(topic) ? 'Biology' : 'Physics';

    const count = await getCount(`source=eq.sat_book&topic=ilike.*${encodeURIComponent(topic)}*`);
    if (count > 0) {
      const updated = await batchPatch(`source=eq.sat_book&topic=ilike.*${encodeURIComponent(topic)}*`,
        { curriculum: 'edexcel', level: 'O Level', subject: subj, source: 'past_paper' });
      if (updated > 0) console.log(`  ${topic} -> Edexcel ${subj}: ${updated}`);
    }
  }

  // 5. Final audit
  console.log('\n=== FINAL AUDIT ===');
  for (const curr of ['cambridge', 'edexcel', 'sat', 'functional_skills', '11_plus']) {
    console.log(`  ${curr}: ${await getCount('curriculum=eq.' + curr)}`);
  }
  console.log(`  Still sat_book source: ${await getCount('source=eq.sat_book')}`);
  console.log(`  TOTAL: ${await getCount('')}`);

  // Edexcel breakdown
  console.log('\n=== EDEXCEL BREAKDOWN ===');
  for (const subj of ['Chemistry', 'Physics', 'Biology', 'Economics', 'English Language', 'Mathematics', 'General']) {
    const c = await getCount('curriculum=eq.edexcel&subject=eq.' + encodeURIComponent(subj));
    if (c > 0) console.log(`  ${subj}: ${c}`);
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
