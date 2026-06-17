import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { useUsage } from '@/app/lib/hooks';
import { formatDate } from '@/app/lib/format';
import { Loading } from '@/app/components/ui';

interface DashboardData {
  applications: { total: number; by_status: Record<string, number>; response_rate: number };
  resume: { ats_score: number | null; completeness_score: number | null };
  jobs: { saved_count: number; match_count: number; top_match_score: number | null };
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: usage } = useUsage();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get<DashboardData>('/analytics/dashboard')).data,
  });

  const isPro = user?.subscription === 'pro';
  const trialEnded = !isPro && usage && !usage.is_trial;

  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Dashboard</h1>
      <p className="pa-page-sub">Your job search at a glance</p>

      {!isPro && (
        <div className="pa-card" style={{ marginTop: 18, background: trialEnded ? '#fdf2dd' : 'var(--primary-light)', borderColor: 'transparent' }}>
          <div className="pa-between">
            <div>
              <div style={{ fontWeight: 700 }}>
                {trialEnded ? 'Your free trial has ended' : 'You’re on the free trial'}
              </div>
              <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                {trialEnded
                  ? 'Upgrade to Pro to unlock AI coaching, tailoring, cover letters & interview prep.'
                  : usage?.trial_ends_at ? `Full access until ${formatDate(usage.trial_ends_at)}.` : 'Enjoy full access during your trial.'}
              </div>
            </div>
            <Link to="/paywall" className="pa-btn pa-btn-primary pa-btn-sm">Upgrade</Link>
          </div>
        </div>
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

          <h3 style={{ marginTop: 28, marginBottom: 12, fontSize: 17 }}>Quick actions</h3>
          <div className="pa-grid pa-grid-2">
            <QuickLink to="/jobs" icon="💼" title="Find jobs" sub="Search & match openings" />
            <QuickLink to="/coach" icon="✨" title="AI Career Coach" sub="Ask anything about your search" />
            <QuickLink to="/resume" icon="📄" title="Resume" sub="Upload & tailor your CV" />
            <QuickLink to="/applications" icon="📋" title="Track applications" sub="Manage your pipeline" />
          </div>
        </>
      )}
    </div>
  );
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

function QuickLink({ to, icon, title, sub }: { to: string; icon: string; title: string; sub: string }) {
  return (
    <Link to={to} className="pa-card" style={{ display: 'flex', gap: 14, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div className="pa-muted" style={{ fontSize: 13 }}>{sub}</div>
      </div>
    </Link>
  );
}
