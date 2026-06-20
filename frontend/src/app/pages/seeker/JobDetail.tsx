import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { formatSalary, timeAgo } from '@/app/lib/format';
import { Button, Loading, ErrorState, useToast } from '@/app/components/ui';

interface JobFull {
  id: string; title: string; company: string; location: string; description: string;
  requirements: string[]; skills_required: string[];
  salary_min: number | null; salary_max: number | null; currency: string;
  job_type: string; experience_level: string; remote_type: string;
  external_url: string | null; posted_at: string; match_score: number | null;
  is_saved: boolean; is_applied: boolean;
}

export default function JobDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  const { data: job, isLoading, isError, refetch } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => (await api.get<JobFull>(`/jobs/${id}`)).data,
    enabled: !!id,
  });

  const saveToggle = useMutation({
    mutationFn: async () => {
      if (job!.is_saved) await api.delete(`/jobs/${id}/save`);
      else await api.post(`/jobs/${id}/save`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job', id] }),
  });

  const track = useMutation({
    mutationFn: async () => api.post('/applications', { job_id: id, source: 'web' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job', id] });
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast('Added to your applications.');
    },
    onError: (e) => toast(apiError(e, 'Could not track this job.')),
  });

  if (isLoading) return <div className="pa-content"><Loading /></div>;
  if (isError || !job) return <div className="pa-content"><ErrorState message="Job not found." onRetry={refetch} /></div>;

  return (
    <div className="pa-content">
      <button className="pa-btn pa-btn-ghost pa-btn-sm" onClick={() => navigate(-1)}>← Back</button>

      <div className="pa-card" style={{ marginTop: 14 }}>
        <div className="pa-between">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>{job.title}</h1>
            <div className="pa-muted" style={{ marginTop: 4 }}>
              {job.company}{job.location ? ` · ${job.location}` : ''}{job.posted_at ? ` · ${timeAgo(job.posted_at)}` : ''}
            </div>
          </div>
          {job.match_score != null && <span className="pa-badge pa-badge-primary">{job.match_score}% match</span>}
        </div>

        <div className="pa-chip-row" style={{ marginTop: 12 }}>
          {job.remote_type && <span className="pa-badge pa-badge-neutral">{job.remote_type}</span>}
          {job.job_type && <span className="pa-badge pa-badge-neutral">{job.job_type}</span>}
          {job.experience_level && <span className="pa-badge pa-badge-neutral">{job.experience_level}</span>}
          {formatSalary(job.salary_min, job.salary_max, job.currency) && (
            <span className="pa-badge pa-badge-neutral">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
          )}
        </div>

        <div className="pa-row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
          {job.external_url && (
            <a className="pa-btn pa-btn-primary pa-btn-sm" href={job.external_url} target="_blank" rel="noreferrer">
              Apply on company site ↗
            </a>
          )}
          {job.is_applied ? (
            <span className="pa-badge pa-badge-success">✓ Tracked</span>
          ) : (
            <Button size="sm" variant="ghost" loading={track.isPending} onClick={() => track.mutate()}>
              + Track application
            </Button>
          )}
          <Button size="sm" variant={job.is_saved ? 'outline' : 'ghost'} loading={saveToggle.isPending}
            onClick={() => saveToggle.mutate()}>
            {job.is_saved ? '★ Saved' : '☆ Save'}
          </Button>
        </div>
      </div>

      <h3 style={{ fontSize: 17, margin: '4px 0 14px' }}>AI tools for this job</h3>
      <div className="pa-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        {([
          { to: 'tailor', icon: 'edit_document', title: 'Tailor resume', sub: 'Match your CV to this role', accent: 'primary' },
          { to: 'cover-letter', icon: 'draft', title: 'Cover letter', sub: 'A letter written for this role', accent: 'cyan' },
          { to: 'interview-prep', icon: 'record_voice_over', title: 'Interview prep', sub: 'Likely questions & answers', accent: 'violet' },
        ] as const).map((t) => (
          <Link key={t.to} to={`/jobs/${id}/${t.to}`} className="pa-card pa-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className={`pa-icon-pill ${t.accent}`}><span className="material-symbols-outlined fill">{t.icon}</span></span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              <div className="pa-muted" style={{ fontSize: 12 }}>{t.sub}</div>
            </div>
            <span className="pa-chevron-circle">›</span>
          </Link>
        ))}
      </div>

      {job.skills_required?.length > 0 && (
        <div className="pa-card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Skills</h3>
          <div className="pa-chip-row">
            {job.skills_required.map((s) => <span key={s} className="pa-badge pa-badge-neutral">{s}</span>)}
          </div>
        </div>
      )}

      {job.requirements?.length > 0 && (
        <div className="pa-card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Requirements</h3>
          <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Description</h3>
        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{job.description}</div>
      </div>
    </div>
  );
}
