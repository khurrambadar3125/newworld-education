/**
 * pages/mite-papers.jsx — MiTE Past Papers Archive
 * Real exam papers from IBA, LUMS, FAST, LAT, NTS, GAT
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

const PAPER_SOURCES = [
  {
    name: 'IBA Karachi', icon: '🏛️', color: '#4F8EF7',
    desc: 'Official BBA, BSCS, MBA sample papers',
    papers: [
      { name: 'BBA Sample Paper III', url: 'https://www.iba.edu.pk/News/past_entry_test/BBA/BBA-Sample-paper-III.pdf' },
      { name: 'BBA Sample Paper V', url: 'https://www.iba.edu.pk/News/past_entry_test/BBA/Sample_Paper_BBA_V.pdf' },
      { name: 'BSCS Sample Paper III', url: 'https://www.iba.edu.pk/News/past_entry_test/BS/BSCS-Sample-Paper-III.pdf' },
      { name: 'BSCS/Eco Sample Paper 2013', url: 'https://www.iba.edu.pk/News/past_entry_test/BSCS-BSEcoMathSamplePapers13.pdf' },
      { name: 'MBA Sample Paper III', url: 'https://www.iba.edu.pk/News/past_entry_test/MBA/MBA-Sample-Paper-III.pdf' },
      { name: 'BBA/BS Accounting/Finance Test', url: 'https://www.iba.edu.pk/News/past_entry_test/BBA_BS_Accounting_Finance_BS_Social_Sciences_Test.pdf' },
      { name: 'Maths Sample Paper 10', url: 'https://www.iba.edu.pk/News/past_entry_test/sample_papers_10_maths.pdf' },
      { name: 'Maths Sample Paper 11', url: 'https://www.iba.edu.pk/News/past_entry_test/sample_papers_11_maths.pdf' },
      { name: 'Maths Sample Paper 12', url: 'https://www.iba.edu.pk/News/past_entry_test/sample_papers_12_maths.pdf' },
    ],
  },
  {
    name: 'LUMS (LCAT)', icon: '🎓', color: '#4ADE80',
    desc: 'LUMS Common Admission Test samples',
    papers: [
      { name: 'LCAT Sample 2025', url: 'https://lums.edu.pk/admissions', note: 'Via lums.edu.pk' },
    ],
  },
  {
    name: 'LAT (Law Admission Test)', icon: '⚖️', color: '#7C3AED',
    desc: '15 actual past papers (2020-2024)',
    papers: [
      { name: 'LAT Past Papers (2020-2024)', url: 'https://www.taleem360.com/lat-past-papers/', note: '15 papers via Taleem360' },
      { name: 'LAT Preparation Guide', url: 'https://www.taleem360.com/lat-past-papers/', note: 'Complete prep book' },
      { name: 'HEC LAW GAT Sample Paper', url: 'https://hec.gov.pk', note: 'Official HEC' },
    ],
  },
  {
    name: 'NTS / GAT', icon: '📋', color: '#F97316',
    desc: 'National Testing Service sample papers',
    papers: [
      { name: 'GAT Past Papers', url: 'https://www.taleem360.com/gat-past-papers/', note: 'Via Taleem360' },
      { name: 'NAT Sample Papers (All Groups)', url: 'https://nts.org.pk/nts/indexm.php', note: 'Official NTS' },
    ],
  },
  {
    name: 'FAST NUCES', icon: '💻', color: '#EAB308',
    desc: '520 semester exam papers across 8 semesters',
    papers: [
      { name: 'All FAST NUCES Past Papers', url: 'https://github.com/AhmedRaza-Attari/FAST-NUCES-PastPapers', note: '520 papers on GitHub' },
      { name: 'Programming Fundamentals', url: 'https://github.com/AhmedRaza-Attari/FAST-NUCES-PastPapers', note: '40+ papers' },
      { name: 'Data Structures', url: 'https://github.com/AhmedRaza-Attari/FAST-NUCES-PastPapers', note: '35+ papers' },
      { name: 'OOP, Databases, Algorithms, OS, Networks', url: 'https://github.com/AhmedRaza-Attari/FAST-NUCES-PastPapers', note: '200+ papers' },
    ],
  },
];

export default function MiTEPapers() {
  const [expanded, setExpanded] = useState(null);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '18px 16px', marginBottom: 10 },
  };

  return (
    <>
      <Head><title>Past Papers Archive — MiTE University | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>
          <a href="/mite-portal" style={{ fontSize: 13, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>← Back to Portal</a>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>PAST PAPERS ARCHIVE</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>Real Exam Papers</h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>IBA, LUMS, FAST, LAT, NTS — all in one place</p>
          </div>

          {PAPER_SOURCES.map(source => (
            <div key={source.name} style={{ ...S.card, borderColor: expanded === source.name ? `${source.color}44` : 'rgba(255,255,255,.1)' }}>
              <button onClick={() => setExpanded(expanded === source.name ? null : source.name)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: '#fff', textAlign: 'left' }}>
                <span style={{ fontSize: 24 }}>{source.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: source.color }}>{source.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{source.desc}</div>
                </div>
                <span style={{ color: 'rgba(255,255,255,.2)' }}>{expanded === source.name ? '▾' : '▸'}</span>
              </button>

              {expanded === source.name && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  {source.papers.map((paper, i) => (
                    <a key={i} href={paper.url !== '#' ? paper.url : undefined} target={paper.url !== '#' ? '_blank' : undefined} rel="noopener"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < source.papers.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', textDecoration: 'none', cursor: paper.url !== '#' ? 'pointer' : 'default' }}>
                      <div style={{ fontSize: 13, color: paper.url !== '#' ? '#4F8EF7' : 'rgba(255,255,255,.5)', fontWeight: 600 }}>
                        📄 {paper.name}
                      </div>
                      {paper.note && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>{paper.note}</span>}
                      {paper.url !== '#' && <span style={{ fontSize: 11, color: '#4F8EF7' }}>Open →</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ ...S.card, textAlign: 'center', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)', marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Want to practice from these papers?</div>
            <a href="/mite-prep" style={{ fontSize: 13, color: '#4F8EF7', textDecoration: 'none' }}>Go to Entrance Test Prep →</a>
          </div>
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
