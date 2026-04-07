/**
 * components/GarageNav.jsx — Dedicated bottom nav for Garage School / Sindh Board students
 * Only shows pages relevant to Sindh Board students. No Cambridge links.
 */

import { useRouter } from 'next/router';

const TABS = [
  { path: '/sindh-board', label: 'Study', icon: '📚', activeIcon: '📖' },
  { path: '/skills', label: 'Skills', icon: '💰', activeIcon: '💰' },
  { path: '/books', label: 'Books', icon: '📕', activeIcon: '📕' },
  { path: '/sindh-dashboard', label: 'Progress', icon: '📊', activeIcon: '📊' },
];

const SHOW_ON = ['/sindh-board', '/bootcamp-sindh', '/sindh-dashboard', '/garageschool', '/books', '/skills'];

export default function GarageNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  if (!SHOW_ON.some(p => currentPath.startsWith(p))) return null;

  return (
    <>
      <div style={{ height: 70 }} />
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 64, background: 'rgba(10,10,10,.95)',
        borderTop: '1px solid rgba(255,255,255,.06)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 8px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 1000,
      }}>
        {TABS.map(tab => {
          const active = currentPath === tab.path;
          return (
            <button key={tab.path} onClick={() => router.push(tab.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 12px', borderRadius: 10,
                WebkitTapHighlightColor: 'transparent',
              }}>
              <span style={{ fontSize: 22, filter: active ? 'none' : 'grayscale(0.5) opacity(0.5)' }}>
                {active ? tab.activeIcon : tab.icon}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: active ? '#C9A84C' : 'rgba(255,255,255,.35)',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
