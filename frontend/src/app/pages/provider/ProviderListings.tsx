import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { formatSalary } from '@/app/lib/format';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface ProviderJob {
  id: string; title: string; company: string; location: string;
  salary_min: number | null; salary_max: number | null; currency: string;
  job_type: string; remote_type: string; vacancies: number | null;
  review_status: string; applicants_access: string | null; is_active: boolean;
  applicant_count: number; posted_at: string | null;
}

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

const REVIEW_BADGE: Record<string, { cls: string; label: string }> = {
  pending: { cls: 'pa-badge-warning', label: 'Pending review' },
  approved: { cls: 'pa-badge-success', label: 'Live' },
  rejected: { cls: 'pa-badge-neutral', label: 'Rejected' },
};

export default function ProviderListings() {
  const qc = useQueryClient();
  const toast = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['provider-jobs'],
    queryFn: async () => (await api.get<ProviderJob[]>('/provider/jobs')).data,
  });

  const requestAccess = useMutation({
    mutationFn: (id: string) => api.post(`/provider/jobs/${id}/request-applicant-access`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['provider-jobs'] }); toast('Access request sent to admin.'); },
    onError: (e) => toast(apiError(e, 'Could not request access.')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/provider/jobs/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['provider-jobs'] }); toast('Listing deleted.'); },
    onError: (e) => toast(apiError(e, 'Could not delete. Approved listings may be locked.')),
  });

  const jobs = data ?? [];

  return (
    <div className="pa-content">
      <div className="pa-between">
        <div>
          <h1 className="pa-page-title">Employer Listings</h1>
          <p className="pa-page-sub">{jobs.length} job{jobs.length === 1 ? '' : 's'} posted · manage your active roles & pipelines.</p>
        </div>
        <Link to="/provider/post" className="pa-btn pa-btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span> Post New Job
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        {isLoading ? <Loading />
          : isError ? <ErrorState message="Could not load your listings." onRetry={refetch} />
          : jobs.length === 0 ? (
            <EmptyState icon="📑" title="No listings yet"
              sub="Post your first job to start receiving applicants."
              action={<Link to="/provider/post" className="pa-btn pa-btn-primary">Post a job</Link>} />
          ) : (
            <div className="pa-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {jobs.map((job) => {
                const badge = REVIEW_BADGE[job.review_status] ?? REVIEW_BADGE.pending;
                const access = job.applicants_access;
                return (
                  <div key={job.id} className="pa-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="pa-between">
                      <span className="pa-icon-pill primary"><Icon name="work" fill /></span>
                      <button className="pa-icon-btn" title="Delete" onClick={() => remove.mutate(job.id)}>
                        <Icon name="delete" />
                      </button>
                    </div>

                    <span className={`pa-badge ${badge.cls}`} style={{ alignSelf: 'flex-start', marginTop: 16 }}>{badge.label}</span>
                    <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>{job.title}</div>
                    <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                      {job.company}{job.location ? ` · ${job.location}` : ''}
                    </div>

                    <div className="pa-bento" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div className="pa-muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>Applicants</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{job.applicant_count}</div>
                      </div>
                      <div>
                        <div className="pa-muted" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>Vacancies</div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>{job.vacancies ?? '—'}</div>
                      </div>
                    </div>

                    {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                      <div className="pa-muted" style={{ fontSize: 13, marginTop: 12 }}>
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                      {job.review_status === 'approved' && (
                        access === 'approved' ? (
                          <Link to="/provider/applicants" className="pa-btn pa-btn-ghost pa-btn-sm pa-btn-block">View applicants</Link>
                        ) : access === 'pending' ? (
                          <span className="pa-badge pa-badge-warning">Access requested</span>
                        ) : (
                          <Button size="sm" variant="ghost" block loading={requestAccess.isPending && requestAccess.variables === job.id}
                            onClick={() => requestAccess.mutate(job.id)}>Request applicant access</Button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
