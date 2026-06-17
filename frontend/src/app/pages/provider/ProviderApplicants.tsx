import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { API_URL } from '@/app/lib/config';
import { tokenStore } from '@/app/lib/api';
import { formatDate } from '@/app/lib/format';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface ProviderJob {
  id: string; title: string; company: string; review_status: string;
  applicants_access: string | null; applicant_count: number;
}
interface Applicant {
  application_id: string; applicant_name: string | null;
  applicant_email: string | null; applied_at: string; status: string;
}

export default function ProviderApplicants() {
  const [jobId, setJobId] = useState<string>('');

  const jobs = useQuery({
    queryKey: ['provider-jobs'],
    queryFn: async () => (await api.get<ProviderJob[]>('/provider/jobs')).data,
  });

  const approvedJobs = (jobs.data ?? []).filter((j) => j.review_status === 'approved');
  const selectedId = jobId || approvedJobs[0]?.id || '';

  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Applicants</h1>
      <p className="pa-page-sub">Review candidates for your live listings</p>

      {jobs.isLoading ? <Loading />
        : approvedJobs.length === 0 ? (
          <EmptyState icon="👥" title="No live listings"
            sub="Once a listing is approved, applicants will appear here." />
        ) : (
          <>
            <div className="pa-card" style={{ marginTop: 16 }}>
              <label className="pa-label">Listing</label>
              <select className="pa-select" value={selectedId} onChange={(e) => setJobId(e.target.value)}>
                {approvedJobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title} — {j.applicant_count} applicant(s)</option>
                ))}
              </select>
            </div>
            {selectedId && <ApplicantList job={approvedJobs.find((j) => j.id === selectedId)!} />}
          </>
        )}
    </div>
  );
}

function ApplicantList({ job }: { job: ProviderJob }) {
  const qc = useQueryClient();
  const toast = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applicants', job.id],
    queryFn: async () =>
      (await api.get<{ access_granted: boolean; access_status: string; applicants: Applicant[] }>(`/provider/jobs/${job.id}/applicants`)).data,
  });

  const requestAccess = useMutation({
    mutationFn: () => api.post(`/provider/jobs/${job.id}/request-applicant-access`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applicants', job.id] });
      qc.invalidateQueries({ queryKey: ['provider-jobs'] });
      toast('Access request sent to admin.');
    },
    onError: (e) => toast(apiError(e, 'Could not request access.')),
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load applicants." onRetry={refetch} />;

  const downloadResume = (applicationId: string) => {
    const url = `${API_URL}/provider/applicants/${applicationId}/resume-download?token=${encodeURIComponent(tokenStore.getAccess() ?? '')}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ marginTop: 16 }}>
      {!data.access_granted && (
        <div className="pa-card" style={{ background: 'var(--surface-low)' }}>
          <div className="pa-between" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Applicant contact details are locked</div>
              <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                {data.access_status === 'pending' ? 'Your access request is pending admin approval.'
                  : 'Request admin approval to see emails and download resumes.'}
              </div>
            </div>
            {data.access_status !== 'pending' && (
              <Button size="sm" loading={requestAccess.isPending} onClick={() => requestAccess.mutate()}>Request access</Button>
            )}
          </div>
        </div>
      )}

      {data.applicants.length === 0 ? (
        <EmptyState icon="📭" title="No applicants yet" sub="Candidates who apply will show up here." />
      ) : data.applicants.map((a) => (
        <div key={a.application_id} className="pa-card">
          <div className="pa-between">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{a.applicant_name || 'Candidate'}</div>
              <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                {a.applicant_email || '••• locked •••'} · applied {formatDate(a.applied_at)}
              </div>
            </div>
            <span className="pa-badge pa-badge-neutral">{a.status}</span>
          </div>
          {data.access_granted && (
            <div className="pa-row" style={{ marginTop: 12 }}>
              <Button size="sm" variant="ghost" onClick={() => downloadResume(a.application_id)}>⬇ Download resume</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
