import { useQuery } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { api } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { useUsage } from '@/app/lib/hooks';
import { formatDate, STATUS_LABELS } from '@/app/lib/format';
import { Loading } from '@/app/components/ui';
import { homePathForRole } from '@/app/components/AppShell';

interface DashboardData {
  applications: { total: number; by_status: Record<string, number>; response_rate: number };
  resume: { ats_score: number | null; completeness_score: number | null };
  jobs: { saved_count: number; match_count: number; top_match_score: number | null };
}

interface AppItem {
  id: string; status: string; applied_at: string;
  job: { title: string; company: string; location: string } | null;
}

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

const FUNNEL: { key: string; label: string; color: string }[] = [
  { key: 'applied', label: 'Applied', color: 'var(--primary)' },
  { key: 'screening', label: 'Screening', color: 'var(--primary-bright)' },
  { key: 'interview', label: 'Interview', color: 'var(--tertiary)' },
  { key: 'offer', label: 'Offer', color: 'var(--success)' },
];

function statusChip(status: string) {
  const map: Record<string, [string, string]> = {
    applied: ['var(--primary-light)', 'var(--primary)'],
    screening: ['var(--warning-light)', 'var(--warning)'],
    interview: ['color-mix(in srgb, var(--tertiary) 16%, transparent)', 'var(--tertiary-ink)'],
    offer: ['var(--success-light)', 'var(--success)'],
    rejected: ['var(--danger-light)', 'var(--danger)'],
    withdrawn: ['var(--surface-low)', 'var(--text-muted)'],
  };
  const [background, color] = map[status] ?? map.withdrawn;
  return { background, color };
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
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
  const { data: appsData } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => (await api.get<{ applications: AppItem[] }>('/applications')).data,
  });

  const isPro = user?.subscription === 'pro';
  const trialEnded = !isPro && usage && !usage.is_trial;
  const first = user?.name?.split(' ')[0] || 'there';
  const apps = data?.applications;
  const total = apps?.total ?? 0;
  const recent = (appsData?.applications ?? []).slice(0, 4);

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
        <div className="pa-hero-sub">Here’s what’s happening with your job search today.</div>
      </div>

      {!isPro && (
        <Link to="/paywall" className="pa-card pa-tile" style={{ background: trialEnded ? 'var(--warning-light)' : 'var(--primary-light)', borderColor: 'transparent', textDecoration: 'none', color: 'inherit' }}>
          <span className="pa-icon-pill" style={{ background: 'rgba(255,255,255,.55)' }}><Icon name={trialEnded ? 'schedule' : 'auto_awesome'} /></span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>{trialEnded ? 'Your free trial has ended' : 'You’re on the free trial'}</div>
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
          {/* Metrics */}
          <div className="pa-bento pa-bento-4" style={{ marginTop: 20 }}>
            <Metric icon="send" accent="primary" label="Applications" value={total} />
            <Metric icon="record_voice_over" accent="cyan" label="Interviews" value={apps?.by_status.interview ?? 0} />
            <Metric icon="auto_awesome" accent="violet" label="Job Matches" value={data?.jobs.match_count ?? 0} />
            <Metric icon="verified" accent="primary" label="Resume Score"
              value={data?.resume.ats_score != null ? data.resume.ats_score : '—'}
              suffix={data?.resume.ats_score != null ? '/100' : undefined} />
          </div>

          {/* Funnel + AI */}
          <div className="pa-dash-mid" style={{ marginTop: 20 }}>
            <div className="pa-card">
              <div className="pa-between" style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 18 }}>Application Funnel</h3>
                <Link to="/applications" style={{ fontSize: 13, fontWeight: 700 }}>View all</Link>
              </div>
              {total === 0 ? (
                <p className="pa-muted" style={{ fontSize: 14 }}>No applications yet — log one to see your pipeline here.</p>
              ) : FUNNEL.map((s) => {
                const count = apps?.by_status[s.key] ?? 0;
                const pct = total > 0 ? Math.max((count / total) * 100, count > 0 ? 18 : 0) : 0;
                return (
                  <div key={s.key} className="pa-funnel-row">
                    <span className="pa-funnel-name">{s.label}</span>
                    <div className="pa-funnel-track">
                      <div className="pa-funnel-fill" style={{ width: `${pct}%`, background: s.color }}>
                        {count > 0 && `${Math.round((count / total) * 100)}% (${count})`}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pa-between" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <FunnelStat label="Response rate" value={apps?.response_rate != null ? `${apps.response_rate}%` : '—'} />
                <FunnelStat label="Saved jobs" value={data?.jobs.saved_count ?? 0} />
                <FunnelStat label="Top match" value={data?.jobs.top_match_score != null ? `${data.jobs.top_match_score}%` : '—'} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Link to="/coach" className="pa-card pa-ai-card" style={{ textDecoration: 'none', color: '#fff', display: 'block' }}>
                <div className="pa-tile" style={{ position: 'relative' }}>
                  <span className="pa-ai-avatar">✦</span>
                  <div>
                    <div className="pa-ai-title">AI Career Coach</div>
                    <div className="pa-ai-sub">Personalised guidance & interview prep</div>
                  </div>
                </div>
                <span className="pa-pill" style={{ position: 'relative', marginTop: 16, background: 'rgba(255,255,255,.14)', color: '#fff' }}>Ask anything →</span>
              </Link>
              <Link to="/jobs" className="pa-card pa-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="pa-icon-pill violet"><Icon name="target" fill /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>Job Matches</div>
                  <div className="pa-muted" style={{ fontSize: 13 }}>{data?.jobs.match_count ?? 0} roles matched to you</div>
                </div>
                <span className="pa-chevron-circle">›</span>
              </Link>
            </div>
          </div>

          {/* Active applications */}
          <div className="pa-between" style={{ marginTop: 30, marginBottom: 14 }}>
            <h3 style={{ fontSize: 18 }}>Active Applications</h3>
            <Link to="/applications" style={{ fontSize: 13, fontWeight: 700 }}>View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="pa-card"><p className="pa-muted" style={{ fontSize: 14 }}>Nothing here yet. Apply to jobs or log applications you made elsewhere.</p></div>
          ) : recent.map((a) => (
            <Link key={a.id} to="/applications" className="pa-app-row">
              <span className="pa-app-logo"><Icon name="domain" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>{a.job?.title || 'Untitled role'}</div>
                <div className="pa-muted" style={{ fontSize: 13 }}>{a.job?.company}{a.job?.location ? ` · ${a.job.location}` : ''}</div>
              </div>
              <span className="pa-muted" style={{ fontSize: 12, marginRight: 4 }}>{formatDate(a.applied_at)}</span>
              <span className="pa-status-chip" style={statusChip(a.status)}>{STATUS_LABELS[a.status] ?? a.status}</span>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

function Metric({ icon, accent, label, value, suffix }: {
  icon: string; accent: 'primary' | 'cyan' | 'violet' | 'danger'; label: string; value: number | string; suffix?: string;
}) {
  return (
    <div className="pa-metric">
      <div className="pa-metric-head">
        <span className={`pa-icon-pill ${accent}`}><Icon name={icon} fill /></span>
      </div>
      <div className="pa-metric-label">{label}</div>
      <div className="pa-metric-num">{value}{suffix && <small>{suffix}</small>}</div>
    </div>
  );
}

function FunnelStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
      <div className="pa-muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
