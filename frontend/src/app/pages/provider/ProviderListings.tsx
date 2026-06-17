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
          <h1 className="pa-page-title">My listings</h1>
          <p className="pa-page-sub">{jobs.length} job{jobs.length === 1 ? '' : 's'} posted</p>
        </div>
        <Link to="/provider/post" className="pa-btn pa-btn-primary">➕ Post job</Link>
      </div>

      <div style={{ marginTop: 18 }}>
        {isLoading ? <Loading />
          : isError ? <ErrorState message="Could not load your listings." onRetry={refetch} />
          : jobs.length === 0 ? (
            <EmptyState icon="📑" title="No listings yet"
              sub="Post your first job to start receiving applicants."
              action={<Link to="/provider/post" className="pa-btn pa-btn-primary">Post a job</Link>} />
          ) : jobs.map((job) => {
            const badge = REVIEW_BADGE[job.review_status] ?? REVIEW_BADGE.pending;
            const access = job.applicants_access;
            return (
              <div key={job.id} className="pa-card">
                <div className="pa-between">
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{job.title}</div>
                    <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                      {job.company}{job.location ? ` · ${job.location}` : ''}
                    </div>
                  </div>
                  <span className={`pa-badge ${badge.cls}`}>{badge.label}</span>
                </div>

                <div className="pa-chip-row" style={{ marginTop: 10 }}>
                  <span className="pa-badge pa-badge-neutral">👥 {job.applicant_count} applicant{job.applicant_count === 1 ? '' : 's'}</span>
                  {job.vacancies != null && <span className="pa-badge pa-badge-neutral">{job.vacancies} vacanc{job.vacancies === 1 ? 'y' : 'ies'}</span>}
                  {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                    <span className="pa-badge pa-badge-neutral">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                  )}
                </div>

                <div className="pa-row" style={{ marginTop: 12, flexWrap: 'wrap' }}>
                  {job.review_status === 'approved' && (
                    access === 'approved' ? (
                      <Link to="/provider/applicants" className="pa-btn pa-btn-ghost pa-btn-sm">View applicants</Link>
                    ) : access === 'pending' ? (
                      <span className="pa-badge pa-badge-warning">Access requested</span>
                    ) : (
                      <Button size="sm" variant="ghost" loading={requestAccess.isPending && requestAccess.variables === job.id}
                        onClick={() => requestAccess.mutate(job.id)}>Request applicant access</Button>
                    )
                  )}
                  <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }}
                    onClick={() => remove.mutate(job.id)}>Delete</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
