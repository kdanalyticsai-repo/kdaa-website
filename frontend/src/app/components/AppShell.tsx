import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';

interface NavItem { to: string; label: string; icon: string; end?: boolean }

const SEEKER_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/jobs', label: 'Jobs', icon: '💼' },
  { to: '/applications', label: 'Apply', icon: '📋' },
  { to: '/resume', label: 'Resume', icon: '📄' },
  { to: '/coach', label: 'Coach', icon: '✨' },
  { to: '/insights', label: 'Insights', icon: '📊' },
];

const PROVIDER_NAV: NavItem[] = [
  { to: '/provider', label: 'Home', icon: '🏢', end: true },
  { to: '/provider/listings', label: 'Listings', icon: '📑' },
  { to: '/provider/post', label: 'Post Job', icon: '➕' },
  { to: '/provider/applicants', label: 'Applicants', icon: '👥' },
  { to: '/provider/profile', label: 'Company', icon: '⚙️' },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', label: 'Admin', icon: '🛡️', end: true },
  { to: '/jobs', label: 'Jobs', icon: '💼' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const nav = user?.role === 'job_provider' ? PROVIDER_NAV
    : user?.role === 'admin' ? ADMIN_NAV
    : SEEKER_NAV;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const isPro = user?.subscription === 'pro';

  return (
    <div className="pa-shell">
      <aside className="pa-sidebar">
        <NavLink to="/" className="pa-brand">
          <span className="pa-brand-logo">P</span>
          <span className="pa-brand-name">ProAICV</span>
        </NavLink>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `pa-nav-link${isActive ? ' active' : ''}`}
          >
            <span className="pa-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="pa-nav-spacer" />
        <NavLink to="/profile" className={({ isActive }) => `pa-nav-link${isActive ? ' active' : ''}`}>
          <span className="pa-nav-icon">👤</span><span>Profile</span>
        </NavLink>
        <button className="pa-nav-link" onClick={handleLogout}>
          <span className="pa-nav-icon">↩️</span><span>Sign out</span>
        </button>
      </aside>

      <div className="pa-main">
        <header className="pa-topbar">
          <div className="pa-row">
            <span style={{ fontWeight: 700 }}>{greeting()}, {user?.name?.split(' ')[0] || 'there'}</span>
          </div>
          <div className="pa-row">
            {!isPro && user?.role !== 'admin' && (
              <NavLink to="/paywall" className="pa-btn pa-btn-outline pa-btn-sm">Upgrade to Pro</NavLink>
            )}
            {isPro && <span className="pa-badge pa-badge-primary">PRO</span>}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
