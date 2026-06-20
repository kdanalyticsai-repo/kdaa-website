import { useQuery } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { useUsage } from '@/app/lib/hooks';
import { formatDate } from '@/app/lib/format';
import { Loading } from '@/app/components/ui';
import { homePathForRole } from '@/app/components/AppShell';

interface DashboardData {
  applications: { total: number; by_status: Record<string, number>; response_rate: number };
  resume: { ats_score: number | null; completeness_score: number | null };
  jobs: { saved_count: number; match_count: number; top_match_score: number | null };
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  // The seeker dashboard is job-seeker-only; route others to their own home.
  if (user && user.role !== 'job_seeker') {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  return <SeekerDashboard />;
}

function SeekerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: usage } = useUsage();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get<DashboardData>('/analytics/dashboard')).data,
  });

  const isPro = user?.subscription === 'pro';
  const trialEnded = !isPro && usage && !usage.is_trial;

  const first = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="pa-content">
      <div className="pa-hero">
        <div className="pa-hero-row">
          <div>
            <div className="pa-hero-greet">{greeting()},</div>
            <div className="pa-hero-title">{first} {isPro ? '✦' : '👋'}</div>
          </div>
          {isPro && <span className="pa-hero-pro">PRO</span>}
        </div>
        <div className="pa-hero-sub">Here’s your career overview</div>
      </div>

      {!isPro && (
        <Link to="/paywall" className="pa-card pa-tile" style={{ background: trialEnded ? 'var(--warning-light)' : 'var(--primary-light)', borderColor: 'transparent', textDecoration: 'none', color: 'inherit' }}>
          <span style={{ fontSize: 22 }}>{trialEnded ? '⏰' : '✦'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>
              {trialEnded ? 'Your free trial has ended' : 'You’re on the free trial'}
            </div>
            <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
              {trialEnded
                ? 'Upgrade to Pro to unlock AI coaching, tailoring, cover letters & interview prep.'
                : usage?.trial_ends_at ? `Full access until ${formatDate(usage.trial_ends_at)}.` : 'Enjoy full access during your trial.'}
            </div>
          </div>
          <span className="pa-chevron-circle">›</span>
        </Link>
      )}

      {isLoading ? <Loading /> : (
        <>
          <div className="pa-grid pa-grid-3" style={{ marginTop: 18 }}>
            <Stat to="/applications" num={data?.applications.total ?? 0} label="Applications" />
            <Stat to="/applications" num={data?.applications.by_status.interview ?? 0} label="Interviews" />
            <Stat to="/jobs" num={data?.jobs.saved_count ?? 0} label="Saved jobs" />
            <Stat to="/jobs" num={data?.jobs.match_count ?? 0} label="Job matches" />
            <Stat num={data?.resume.ats_score != null ? `${data.resume.ats_score}` : '—'} label="Resume ATS score" />
            <Stat num={data?.applications.response_rate != null ? `${data.applications.response_rate}%` : '—'} label="Response rate" />
          </div>

          {/* AI Coach — spotlight card */}
          <Link to="/coach" className="pa-card pa-ai-card pa-tile" style={{ marginTop: 16, textDecoration: 'none', color: '#fff' }}>
            <span className="pa-ai-avatar">✦</span>
            <div style={{ minWidth: 0 }}>
              <div className="pa-ai-title">AI Career Coach</div>
              <div className="pa-ai-sub">Get personalized career guidance</div>
            </div>
            <span className="pa-chevron-circle">›</span>
          </Link>

          <h3 style={{ marginTop: 28, marginBottom: 12, fontSize: 17 }}>Quick actions</h3>
          <div className="pa-grid pa-grid-2">
            <QuickLink to="/jobs" icon="💼" title="Find jobs" sub="Search & match openings" />
            <QuickLink to="/resume" icon="📄" title="Resume" sub="Upload & tailor your CV" tint="tertiary" />
            <QuickLink to="/applications" icon="📋" title="Track applications" sub="Manage your pipeline" />
            <QuickLink to="/insights" icon="📊" title="Insights" sub="Your search performance" tint="tertiary" />
          </div>
        </>
      )}
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function Stat({ num, label, to }: { num: number | string; label: string; to?: string }) {
  const body = (
    <div className="pa-card" style={{ cursor: to ? 'pointer' : 'default' }}>
      <div className="pa-stat-num">{num}</div>
      <div className="pa-stat-label">{label}</div>
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{body}</Link> : body;
}

function QuickLink({ to, icon, title, sub, tint }: { to: string; icon: string; title: string; sub: string; tint?: 'tertiary' }) {
  return (
    <Link to={to} className="pa-card pa-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className={`pa-icon-tile${tint === 'tertiary' ? ' tertiary' : ''}`}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div className="pa-muted" style={{ fontSize: 13 }}>{sub}</div>
      </div>
      <span className="pa-chevron-circle">›</span>
    </Link>
  );
}
