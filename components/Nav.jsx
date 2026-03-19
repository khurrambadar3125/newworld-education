import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../pages/_app';

const MENU_GROUPS = [
  {
    title: 'Learn',
    items: [
      { href: '/drill',        label: '🎯 Practice Drill' },
      { href: '/past-papers',  label: '📚 Past Papers' },
      { href: '/homework',     label: '📝 Homework Help' },
      { href: '/essay',        label: '✍️ Essay Marking' },
      { href: '/textbooks',    label: '📖 Textbooks' },
      { href: '/languages',   label: '🌍 Languages' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { href: '/countdown',    label: '⏱️ Exam Countdown' },
      { href: '/subscribe',    label: '📬 Daily Questions' },
      { href: '/leaderboard',  label: '🏆 Leaderboard' },
    ],
  },
  {
    title: 'Creative',
    items: [
      { href: '/arts',         label: '🎨 Arts' },
      { href: '/music',        label: '🎵 Music' },
      { href: '/reading',      label: '📚 Reading' },
    ],
  },
  {
    title: 'Parents & Schools',
    items: [
      { href: '/parent',       label: '👨‍👩‍👧 Parent Portal' },
      { href: '/special-needs',label: '💜 Special Needs' },
      { href: '/dashboard',    label: '📊 Teacher Dashboard' },
      { href: '/school',       label: '🏫 For Schools' },
    ],
  },
];

export default function Nav({ current, accent }) {
  const [open, setOpen] = useState(false);
  const toggleMenu = (val) => {
    const next = val !== undefined ? val : !open;
    setOpen(next);
    if (typeof document !== 'undefined') document.body.style.overflow = next ? 'hidden' : '';
  };
  const { theme, toggleTheme } = useTheme();
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
          width: 44px; height: 44px; border-radius: 8px; cursor: pointer;
          font-size: 17px; display: flex; align-items: center; justify-content: center;
        }
        .nw-nav-menu {
          position: fixed; top: 52px; left: 0; right: 0; bottom: 0;
          background: rgba(8,12,24,0.98); z-index: 99;
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0));
          overflow-y: auto; -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .nw-nav-group-title {
          font-size: 11px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          padding: 16px 12px 6px; margin: 0;
        }
        .nw-nav-group-title:first-child { padding-top: 8px; }
        .nw-nav-menu a {
          display: block; padding: 12px 12px 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75); text-decoration: none;
          font-size: 15px; font-weight: 500;
        }
        .nw-nav-menu a:hover { color: #fff; background: rgba(255,255,255,0.03); }
        .nw-nav-menu a.nw-active { color: ${color}; font-weight: 700; }
        .nw-nav-home {
          display: block; padding: 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: #fff; text-decoration: none;
          font-size: 16px; font-weight: 700;
        }
        .nw-nav-bottom {
          padding: 12px; border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 8px;
        }
        .nw-nav-bottom a {
          display: block; padding: 12px; border-bottom: none;
          font-weight: 700; color: #4F8EF7;
        }
      `}</style>

      <nav className="nw-nav">
        <Link href="/"><a className="nw-nav-logo">NewWorldEdu<span>★</span></a></Link>
        <div className="nw-nav-right">
          <button className="nw-nav-burger" onClick={toggleTheme} aria-label="Toggle light/dark mode" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link href="/pricing"><a className="nw-nav-plans">Plans</a></Link>
          <button className="nw-nav-burger" onClick={() => toggleMenu()} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="nw-nav-menu" onClick={() => toggleMenu(false)}>
          <Link href="/"><a className="nw-nav-home">🏠 Home</a></Link>
          {MENU_GROUPS.map(group => (
            <div key={group.title}>
              <div className="nw-nav-group-title">{group.title}</div>
              {group.items.map(item => (
                <Link key={item.href} href={item.href}>
                  <a className={current === item.href ? 'nw-active' : ''}>{item.label}</a>
                </Link>
              ))}
            </div>
          ))}
          <div className="nw-nav-bottom">
            <Link href="/pricing"><a>💳 Plans & Pricing</a></Link>
          </div>
        </div>
      )}
    </>
  );
}
