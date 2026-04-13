// components/SchoolPicker.jsx
// Reusable search + autocomplete picker for the 31-school KB.
// Emits the full school object via onSelect so the caller can map it to a profile.

import { useState, useMemo } from 'react';
import { getAllSchools } from '../utils/schoolProfileMap';

export default function SchoolPicker({ onSelect, country = 'all' }) {
  const [query, setQuery] = useState('');
  const allSchools = useMemo(() => getAllSchools(), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = allSchools;
    if (country !== 'all') list = list.filter((s) => s.country === country);
    if (q) {
      list = list.filter((s) => {
        const curr = (s.curriculumOffered || []).map(String).join(' ').toLowerCase();
        const boards = (s.examBoards || []).map(String).join(' ').toLowerCase();
        return (
          (s.name || '').toLowerCase().includes(q) ||
          (s.shortName || '').toLowerCase().includes(q) ||
          (s.city || '').toLowerCase().includes(q) ||
          curr.includes(q) ||
          boards.includes(q)
        );
      });
    }
    return list.slice(0, 20);
  }, [query, country, allSchools]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', color: '#fff' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your school name (e.g. Karachi Grammar, GEMS Wellington, Beaconhouse)..."
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: 16,
          background: 'rgba(255,255,255,0.07)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12,
          outline: 'none',
          marginBottom: 12,
        }}
        autoFocus
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 500, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            No schools match. Try a different search term, or scroll to the manual grade selector below.
          </div>
        )}
        {filtered.map((s) => (
          <button
            key={`${s.country}-${s.slug}`}
            onClick={() => onSelect(s)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '14px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79,142,247,0.1)';
              e.currentTarget.style.borderColor = 'rgba(79,142,247,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <span style={{ fontSize: 28 }}>{s.country === 'UAE' ? '🇦🇪' : '🇵🇰'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {s.city}
                {(s.curriculumOffered || []).length > 0 && ` · ${(s.curriculumOffered || []).join(' · ')}`}
              </div>
            </div>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
