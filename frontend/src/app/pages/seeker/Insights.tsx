import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { STATUS_LABELS, STATUS_ORDER } from '@/app/lib/format';
import { Loading, ErrorState } from '@/app/components/ui';

interface Dashboard {
  applications: {
    total: number;
    by_status: Record<string, number>;
    response_rate: number;
  };
  resume: { ats_score: number | null; completeness_score: number | null };
  jobs: { saved_count: number; match_count: number; top_match_score: number | null };
}

export default function Insights() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => (await api.get<Dashboard>('/analytics/dashboard')).data,
  });

  if (isLoading) return <div className="pa-content"><Loading /></div>;
  if (isError || !data) return <div className="pa-content"><ErrorState message="Could not load insights." onRetry={refetch} /></div>;

  const maxStatus = Math.max(1, ...STATUS_ORDER.map((s) => data.applications.by_status?.[s] ?? 0));

  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Insights</h1>
      <p className="pa-page-sub">Your job-search performance at a glance</p>

      <div className="pa-grid pa-grid-4" style={{ marginTop: 16 }}>
        <Stat label="Applications" value={data.applications.total} />
        <Stat label="Response rate" value={`${Math.round(data.applications.response_rate)}%`} />
        <Stat label="Saved jobs" value={data.jobs.saved_count} />
        <Stat label="Job matches" value={data.jobs.match_count} />
      </div>

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Applications by stage</h3>
        {STATUS_ORDER.map((s) => {
          const n = data.applications.by_status?.[s] ?? 0;
          return (
            <div key={s} style={{ marginBottom: 12 }}>
              <div className="pa-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{STATUS_LABELS[s]}</span>
                <span className="pa-muted" style={{ fontSize: 13 }}>{n}</span>
              </div>
              <div className="pa-bar-track"><div className="pa-bar-fill" style={{ width: `${(n / maxStatus) * 100}%` }} /></div>
            </div>
          );
        })}
      </div>

      <div className="pa-grid pa-grid-3">
        <div className="pa-card pa-card-stat">
          <div className="pa-label">Resume ATS score</div>
          <div className="pa-stat-num" style={{ color: 'var(--primary)' }}>{data.resume.ats_score ?? '—'}</div>
        </div>
        <div className="pa-card pa-card-stat">
          <div className="pa-label">Resume completeness</div>
          <div className="pa-stat-num">{data.resume.completeness_score != null ? `${data.resume.completeness_score}%` : '—'}</div>
        </div>
        <div className="pa-card pa-card-stat">
          <div className="pa-label">Top match score</div>
          <div className="pa-stat-num">{data.jobs.top_match_score != null ? `${data.jobs.top_match_score}%` : '—'}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="pa-card pa-card-stat">
      <div className="pa-stat-num">{value}</div>
      <div className="pa-label" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}
