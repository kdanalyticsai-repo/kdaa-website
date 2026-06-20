import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { formatSalary, timeAgo } from '@/app/lib/format';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface JobItem {
  id: string; title: string; company: string; location: string;
  salary_min: number | null; salary_max: number | null; currency: string;
  job_type: string; experience_level: string; remote_type: string;
  external_url: string | null; posted_at: string; match_score: number | null;
  is_saved: boolean; is_applied: boolean;
}

const REMOTE_FILTERS = [
  { id: '', label: 'All' },
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'onsite', label: 'On-site' },
];
const POSTED_FILTERS = [
  { id: 0, label: 'Any time' },
  { id: 1, label: '24h' },
  { id: 7, label: '7 days' },
  { id: 30, label: '30 days' },
];
const QUICK_COMPANIES = ['TCS', 'HCL', 'IBM', 'Havells', 'Tata Power'];

export default function Jobs() {
  const qc = useQueryClient();
  const toast = useToast();
  const [params] = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const [search, setSearch] = useState(initialQ);
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState('');
  const [postedDays, setPostedDays] = useState(0);
  const [applied, setApplied] = useState({ q: initialQ, location: '', remote: '', postedDays: 0 });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['jobs', applied],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (applied.q) params.set('q', applied.q);
      if (applied.location) params.set('location', applied.location);
      if (applied.remote) params.set('remote_type', applied.remote);
      if (applied.postedDays) params.set('posted_within_days', String(applied.postedDays));
      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data as { jobs: JobItem[]; total: number };
    },
  });

  const saveToggle = useMutation({
    mutationFn: async (job: JobItem) => {
      if (job.is_saved) await api.delete(`/jobs/${job.id}/save`);
      else await api.post(`/jobs/${job.id}/save`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
    onError: () => toast('Could not update saved jobs.'),
  });

  const runSearch = () => setApplied({ q: search.trim(), location: location.trim(), remote, postedDays });

  const jobs = data?.jobs ?? [];
  const webTerm = [applied.q, applied.location].filter(Boolean).join(' ').trim();
  const webQuery = webTerm ? `${webTerm} jobs` : 'jobs in India';
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(webQuery)}`;
  const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(webQuery)}`;

  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Find jobs</h1>
      <p className="pa-page-sub">{data ? `${data.total} openings` : 'Search live openings'}</p>

      <div className="pa-card" style={{ marginTop: 16 }}>
        <div className="pa-row" style={{ flexWrap: 'wrap' }}>
          <input className="pa-input" style={{ flex: 2, minWidth: 200 }} placeholder="Job title, skill or company"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()} />
          <input className="pa-input" style={{ flex: 1, minWidth: 140 }} placeholder="Location"
            value={location} onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()} />
          <Button onClick={runSearch}>Search</Button>
        </div>

        <div className="pa-chip-row" style={{ marginTop: 12 }}>
          {QUICK_COMPANIES.map((c) => (
            <button key={c} className="pa-chip" onClick={() => { setSearch(c); setApplied((a) => ({ ...a, q: c })); }}>{c}</button>
          ))}
        </div>

        <div className="pa-row" style={{ marginTop: 12, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="pa-label" style={{ marginBottom: 6 }}>Work style</div>
            <div className="pa-chip-row">
              {REMOTE_FILTERS.map((r) => (
                <button key={r.id} className={`pa-chip${remote === r.id ? ' active' : ''}`}
                  onClick={() => { setRemote(r.id); setApplied((a) => ({ ...a, remote: r.id })); }}>{r.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="pa-label" style={{ marginBottom: 6 }}>Posted</div>
            <div className="pa-chip-row">
              {POSTED_FILTERS.map((p) => (
                <button key={p.id} className={`pa-chip${postedDays === p.id ? ' active' : ''}`}
                  onClick={() => { setPostedDays(p.id); setApplied((a) => ({ ...a, postedDays: p.id })); }}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {isLoading ? <Loading label="Finding jobs…" />
          : isError ? <ErrorState message="Could not load jobs." onRetry={refetch} />
          : jobs.length === 0 ? (
            <EmptyState icon="🔍" title="No jobs found"
              sub="Try a broader search or different filters — or look on the web and log what you find from Applications."
              action={<WebSearch google={googleUrl} ddg={ddgUrl} />} />
          ) : (
            <div style={{ opacity: isFetching ? 0.6 : 1 }}>
              {jobs.map((job) => (
                <div key={job.id} className="pa-job-card">
                  <span className="pa-app-logo"><span className="material-symbols-outlined">domain</span></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="pa-between" style={{ gap: 12 }}>
                      <Link to={`/jobs/${job.id}`} className="pa-job-title">{job.title}</Link>
                      {job.match_score != null && (
                        <span className="pa-match-pill"><span className="material-symbols-outlined">target</span>{job.match_score}%</span>
                      )}
                    </div>
                    <div className="pa-muted" style={{ fontSize: 14, marginTop: 2 }}>
                      {job.company}{job.location ? ` · ${job.location}` : ''}
                    </div>

                    <div className="pa-chip-row" style={{ marginTop: 10 }}>
                      {job.remote_type && <span className="pa-badge pa-badge-neutral">{job.remote_type}</span>}
                      {job.job_type && <span className="pa-badge pa-badge-neutral">{job.job_type}</span>}
                      {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                        <span className="pa-badge pa-badge-neutral">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                      )}
                      {job.posted_at && <span className="pa-badge pa-badge-neutral">{timeAgo(job.posted_at)}</span>}
                    </div>

                    <div className="pa-row" style={{ marginTop: 14 }}>
                      <Link to={`/jobs/${job.id}`} className="pa-btn pa-btn-primary pa-btn-sm">View details</Link>
                      <Button size="sm" variant={job.is_saved ? 'outline' : 'ghost'}
                        loading={saveToggle.isPending && saveToggle.variables?.id === job.id}
                        onClick={() => saveToggle.mutate(job)}>
                        {job.is_saved ? '★ Saved' : '☆ Save'}
                      </Button>
                      {job.is_applied && <span className="pa-badge pa-badge-success">Applied</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

function WebSearch({ google, ddg }: { google: string; ddg: string }) {
  return (
    <div className="pa-row" style={{ flexWrap: 'wrap', gap: 10 }}>
      <a className="pa-btn pa-btn-ghost pa-btn-sm" href={google} target="_blank" rel="noreferrer">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>travel_explore</span> Google
      </a>
      <a className="pa-btn pa-btn-ghost pa-btn-sm" href={ddg} target="_blank" rel="noreferrer">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>travel_explore</span> DuckDuckGo
      </a>
    </div>
  );
}
