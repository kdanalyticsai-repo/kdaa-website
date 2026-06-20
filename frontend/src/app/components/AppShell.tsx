import { ReactNode } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';

interface NavItem { to: string; label: string; icon: string; end?: boolean }

/** Landing route for a role — providers/admins must not land on the seeker dashboard. */
export function homePathForRole(role?: string): string {
  if (role === 'job_provider') return '/provider';
  if (role === 'admin') return '/admin';
  return '/';
}

const SEEKER_NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/jobs', label: 'Jobs', icon: 'work' },
  { to: '/applications', label: 'Applications', icon: 'assignment' },
  { to: '/resume', label: 'Resume', icon: 'description' },
  { to: '/coach', label: 'Coach', icon: 'psychology' },
  { to: '/insights', label: 'Insights', icon: 'analytics' },
];

const PROVIDER_NAV: NavItem[] = [
  { to: '/provider', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/provider/listings', label: 'Listings', icon: 'list_alt' },
  { to: '/provider/post', label: 'Post Job', icon: 'post_add' },
  { to: '/provider/applicants', label: 'Applicants', icon: 'groups' },
  { to: '/provider/profile', label: 'Company', icon: 'domain' },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', label: 'Admin', icon: 'shield', end: true },
  { to: '/jobs', label: 'Jobs', icon: 'work' },
];

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const nav = user?.role === 'job_provider' ? PROVIDER_NAV
    : user?.role === 'admin' ? ADMIN_NAV
    : SEEKER_NAV;

  const isPro = user?.subscription === 'pro';
  const isSeeker = user?.role === 'job_seeker';
  const initials = (user?.name || user?.email || '?').slice(0, 2).toUpperCase();
  const roleLabel = user?.role === 'job_provider' ? 'Employer'
    : user?.role === 'admin' ? 'Admin' : 'Job Seeker';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="pa-shell">
      <aside className="pa-sidebar">
        <NavLink to={homePathForRole(user?.role)} className="pa-brand">
          <span className="pa-brand-logo"><Icon name="rocket_launch" fill /></span>
          <span>
            <span className="pa-brand-name">ProAICV</span>
            <span className="pa-brand-tag">Career Intelligence</span>
          </span>
        </NavLink>

        <nav className="pa-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `pa-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pa-sidebar-foot">
          {isSeeker && !isPro && (
            <Link to="/paywall" className="pa-pro-card">
              <div className="pa-pro-eyebrow">PRO PLAN</div>
              <div className="pa-pro-title">Get 3× more interview invites</div>
              <span className="pa-pro-btn">Upgrade to Pro</span>
            </Link>
          )}
          <NavLink to="/settings" className={({ isActive }) => `pa-nav-link${isActive ? ' active' : ''}`}>
            <Icon name="settings" /><span>Settings</span>
          </NavLink>
          <button className="pa-nav-link pa-nav-danger" onClick={handleLogout}>
            <Icon name="logout" /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="pa-main">
        <header className="pa-topbar">
          <NavLink to={homePathForRole(user?.role)} className="pa-topbar-brand">
            <span className="pa-brand-logo"><Icon name="rocket_launch" fill /></span>
            <span className="pa-brand-name">ProAICV</span>
          </NavLink>
          <div className="pa-topbar-actions">
            {isSeeker && !isPro && (
              <Link to="/paywall" className="pa-btn pa-btn-primary pa-btn-sm">Upgrade to Pro</Link>
            )}
            {isSeeker && isPro && <span className="pa-badge pa-badge-primary">PRO</span>}
            <Link to="/profile" className="pa-topbar-user" title="Profile">
              <span className="pa-topbar-user-meta">
                <span className="pa-topbar-user-name">{user?.name || 'Your profile'}</span>
                <span className="pa-topbar-user-role">{roleLabel}</span>
              </span>
              <span className="pa-topbar-avatar">{initials}</span>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
