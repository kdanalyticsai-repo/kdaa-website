import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { STATUS_LABELS, STATUS_ORDER } from '@/app/lib/format';
import { Loading, ErrorState } from '@/app/components/ui';

interface Dashboard {
  applications: { total: number; by_status: Record<string, number>; response_rate: number };
  resume: { ats_score: number | null; completeness_score: number | null };
  jobs: { saved_count: number; match_count: number; top_match_score: number | null };
  career_readiness?: number;
  market_percentile?: number | null;
}

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

const STAGE_COLOR: Record<string, string> = {
  applied: 'var(--primary)',
  screening: 'var(--primary-bright)',
  interview: 'var(--tertiary)',
  offer: 'var(--success)',
  rejected: 'var(--danger)',
  withdrawn: 'var(--text-muted)',
};

export default function Insights() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => (await api.get<Dashboard>('/analytics/dashboard')).data,
  });

  if (isLoading) return <div className="pa-content"><Loading /></div>;
  if (isError || !data) return <div className="pa-content"><ErrorState message="Could not load insights." onRetry={refetch} /></div>;

  const total = data.applications.total;
  const maxStatus = Math.max(1, ...STATUS_ORDER.map((s) => data.applications.by_status?.[s] ?? 0));
  const match = data.jobs.top_match_score;

  return (
    <div className="pa-content">
      <div className="pa-breadcrumb"><span>Dashboard</span><Icon name="chevron_right" /><span className="cur">Insights</span></div>
      <h1 className="pa-page-title">Application Insights</h1>
      <p className="pa-page-sub">Analyze your search performance and optimize your strategy.</p>

      <div className="pa-bento pa-bento-4" style={{ marginTop: 20 }}>
        <Metric icon="send" accent="primary" label="Total Applications" value={total} sub="Active search cycle" />
        <Metric icon="forum" accent="cyan" label="Response Rate" value={`${Math.round(data.applications.response_rate)}%`} sub="Replies from employers" />
        <Metric icon="bookmark" accent="violet" label="Saved Jobs" value={data.jobs.saved_count} sub="Pending tailoring" />
        <Metric icon="auto_awesome" accent="primary" label="Job Matches" value={data.jobs.match_count} sub="Matched to your CV" />
      </div>

      <div className="pa-dash-mid" style={{ marginTop: 20 }}>
        <div className="pa-card">
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Applications by Stage</h3>
          {total === 0 ? (
            <p className="pa-muted" style={{ fontSize: 14 }}>No applications tracked yet.</p>
          ) : STATUS_ORDER.map((s) => {
            const n = data.applications.by_status?.[s] ?? 0;
            return (
              <div key={s} style={{ marginBottom: 16 }}>
                <div className="pa-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{STATUS_LABELS[s]}</span>
                  <span className="pa-muted" style={{ fontSize: 13, fontWeight: 600 }}>{n} / {total}</span>
                </div>
                <div className="pa-funnel-track" style={{ height: 12 }}>
                  <div className="pa-funnel-fill" style={{ height: 12, width: `${(n / maxStatus) * 100}%`, background: STAGE_COLOR[s] }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Career Readiness — composite score (career_readiness) */}
          {data.career_readiness != null && (
            <div className="pa-card pa-ai-card" style={{ color: '#fff' }}>
              <div className="pa-metric-label" style={{ color: 'rgba(255,255,255,.75)', position: 'relative' }}>Career Readiness</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6, position: 'relative' }}>
                <span style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>{data.career_readiness}</span>
                <span style={{ fontSize: 20, fontWeight: 700, opacity: .7 }}>%</span>
              </div>
              <div className="pa-bar-track" style={{ position: 'relative', marginTop: 14, background: 'rgba(255,255,255,.18)' }}>
                <div className="pa-bar-fill" style={{ width: `${data.career_readiness}%`, background: 'var(--tertiary)' }} />
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 12, position: 'relative' }}>
                Blends your resume score, completeness, response rate and activity.
              </p>
            </div>
          )}

          {/* Market Competitiveness — percentile (market_percentile) */}
          <div className="pa-card">
            <h4 style={{ fontSize: 16 }}>Market Competitiveness</h4>
            <p className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>Your resume vs the candidate pool.</p>
            {match != null && (
              <div className="pa-chip-row" style={{ marginTop: 12 }}>
                {match >= 70 && <span className="pa-badge pa-badge-primary">High Potential</span>}
                {data.resume.ats_score != null && data.resume.ats_score >= 70 && <span className="pa-badge pa-badge-success">Optimized Resume</span>}
              </div>
            )}
            {data.market_percentile != null ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 14 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>Top {Math.max(1, 100 - data.market_percentile)}%</span>
                </div>
                <p className="pa-muted" style={{ fontSize: 13, marginTop: 6 }}>
                  You score above {data.market_percentile}% of candidates.
                </p>
              </>
            ) : (
              <p className="pa-muted" style={{ fontSize: 14, marginTop: 14 }}>Upload a resume to see how you rank.</p>
            )}
          </div>

          <div className="pa-card pa-bento" style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: 14 }}>
            <MiniStat label="Resume ATS" value={data.resume.ats_score != null ? `${data.resume.ats_score}` : '—'} />
            <MiniStat label="Top Match" value={match != null ? `${match}%` : '—'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, accent, label, value, sub }: {
  icon: string; accent: 'primary' | 'cyan' | 'violet'; label: string; value: number | string; sub: string;
}) {
  return (
    <div className="pa-metric">
      <span className={`pa-icon-pill ${accent}`}><Icon name={icon} fill /></span>
      <div className="pa-metric-label">{label}</div>
      <div className="pa-metric-num">{value}</div>
      <div className="pa-muted" style={{ fontSize: 13, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="pa-muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}
