import { useState } from 'react';
import Link from 'next/link';

const MENU_ITEMS = [
  { href: '/',               label: '🏠 Home' },
  { href: '/drill',          label: '🎯 Practice Drill' },
  { href: '/past-papers',    label: '📚 Past Papers' },
  { href: '/special-needs',  label: '💜 Special Needs' },
  { href: '/parent',         label: '👨‍👩‍👧 Parent Portal' },
  { href: '/homework',       label: '🏠 Homework Help' },
  { href: '/essay',          label: '✍️ Essay Marking' },
  { href: '/countdown',      label: '⏱️ Exam Countdown' },
  { href: '/subscribe',      label: '📬 Daily Questions' },
  { href: '/leaderboard',    label: '🏆 Leaderboard' },
  { href: '/dashboard',      label: '📊 Teacher Dashboard' },
  { href: '/textbooks',      label: '📖 Textbooks' },
  { href: '/arts',           label: '🎨 Learn Arts' },
  { href: '/music',          label: '🎵 Learn Music' },
  { href: '/reading',        label: '📚 Learn Reading' },
  { href: '/school',         label: '🏫 For Schools' },
  { href: '/pricing',        label: '💳 Plans & Pricing' },
];

export default function Nav({ current, accent }) {
  const [open, setOpen] = useState(false);
  const color = accent || '#4F8EF7';

  return (
    <>
      <style jsx>{`
        .nw-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(8,12,24,0.96); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0 16px; display: flex; align-items: center;
          justify-content: space-between; height: 52px;
          font-family: 'Sora', -apple-system, sans-serif;
        }
        .nw-nav-logo {
          font-weight: 800; font-size: 15px; color: #fff;
          text-decoration: none; display: flex; align-items: center; gap: 4px;
        }
        .nw-nav-logo span { color: #4F8EF7; }
        .nw-nav-right { display: flex; align-items: center; gap: 8px; }
        .nw-nav-plans {
          background: linear-gradient(135deg, #4F8EF7, #7C5CBF);
          color: #fff; border: none; padding: 7px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 700; text-decoration: none; white-space: nowrap;
        }
        .nw-nav-burger {
          background: rgba(255,255,255,0.07); border: none; color: #fff;
          width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
          font-size: 17px; display: flex; align-items: center; justify-content: center;
        }
        .nw-nav-menu {
          position: fixed; top: 52px; left: 0; right: 0; bottom: 0;
          background: rgba(8,12,24,0.98); z-index: 99; padding: 12px 16px;
          overflow-y: auto; -webkit-overflow-scrolling: touch;
        }
        .nw-nav-menu a {
          display: block; padding: 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8); text-decoration: none;
          font-size: 16px; font-weight: 500;
        }
        .nw-nav-menu a:hover { color: #fff; background: rgba(255,255,255,0.03); }
        .nw-nav-menu a.nw-active { color: ${color}; font-weight: 700; }
      `}</style>

      <nav className="nw-nav">
        <Link href="/"><a className="nw-nav-logo">NewWorldEdu<span>★</span></a></Link>
        <div className="nw-nav-right">
          <Link href="/pricing"><a className="nw-nav-plans">Plans</a></Link>
          <button className="nw-nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="nw-nav-menu" onClick={() => setOpen(false)}>
          {MENU_ITEMS.map(item => (
            <Link key={item.href} href={item.href}>
              <a className={current === item.href ? 'nw-active' : ''}>{item.label}</a>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
