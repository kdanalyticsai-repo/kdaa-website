import { useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { formatSalary, formatDate } from '@/app/lib/format';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

type Tab = 'overview' | 'jobs' | 'access' | 'pan' | 'users';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'jobs', label: 'Pending jobs' },
  { id: 'access', label: 'Access requests' },
  { id: 'pan', label: 'PAN verify' },
  { id: 'users', label: 'Users' },
];

export default function AdminHome() {
  const [tab, setTab] = useState<Tab>('overview');
  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Admin</h1>
      <div className="pa-chip-row" style={{ marginTop: 14 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`pa-chip${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        {tab === 'overview' && <Overview />}
        {tab === 'jobs' && <PendingJobs />}
        {tab === 'access' && <AccessRequests />}
        {tab === 'pan' && <PanVerify />}
        {tab === 'users' && <Users />}
      </div>
    </div>
  );
}

function Overview() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get<any>('/admin/stats')).data,
  });
  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load stats." onRetry={refetch} />;

  const u = data.users ?? {};
  const rev = data.revenue ?? {};
  const jobs = data.jobs ?? {};
  const apps = data.applications ?? {};
  const resumes = data.resumes ?? {};
  const listed = data.listed_jobs ?? {};
  const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

  return (
    <>
      <SectionLabel>Users</SectionLabel>
      <div className="pa-grid pa-grid-4">
        <Stat label="Total users" value={u.total ?? 0} />
        <Stat label="Free" value={u.free ?? 0} />
        <Stat label="Pro" value={u.pro ?? 0} accent="primary" />
        <Stat label="New signups (7d)" value={`+${u.signups_last_7d ?? 0}`} accent="tertiary" />
      </div>

      <SectionLabel>Revenue</SectionLabel>
      <div className="pa-grid pa-grid-4">
        <Stat label="Total revenue" value={inr(rev.monthly_inr)} accent="primary" />
        <Stat label="Pro subscribers" value={rev.pro_subscribers ?? 0} />
      </div>

      <SectionLabel>Listed jobs</SectionLabel>
      <div className="pa-grid pa-grid-4">
        <Stat label="Total listed" value={listed.total ?? 0} />
        <Stat label="Approved" value={listed.approved ?? 0} accent="tertiary" />
        <Stat label="Pending" value={listed.pending ?? 0} accent="warning" />
        <Stat label="New (7d)" value={`+${listed.last_7d ?? 0}`} />
      </div>

      <SectionLabel>Activity</SectionLabel>
      <div className="pa-grid pa-grid-4">
        <Stat label="Active jobs" value={(jobs.total_active ?? 0).toLocaleString('en-IN')} />
        <Stat label="Applications" value={apps.total ?? 0} />
        <Stat label="Resumes" value={resumes.total ?? 0} />
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="pa-section-label">{children}</div>;
}

const ACCENT: Record<string, string> = {
  primary: 'var(--primary)',
  tertiary: 'var(--tertiary)',
  warning: 'var(--warning)',
};

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: keyof typeof ACCENT }) {
  return (
    <div className="pa-card pa-card-stat">
      <div className="pa-stat-num" style={accent ? { color: ACCENT[accent] } : undefined}>{value}</div>
      <div className="pa-label" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

interface PendingJob {
  id: string; title: string; company: string; location: string;
  salary_min: number | null; salary_max: number | null;
  job_type: string; remote_type: string; provider_name: string; provider_email: string | null;
  posted_at: string | null;
}

function PendingJobs() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-pending-jobs'],
    queryFn: async () => (await api.get<PendingJob[]>('/admin/pending-jobs')).data,
  });

  const decide = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) => api.post(`/admin/jobs/${id}/${action}`),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['admin-pending-jobs'] }); toast(`Job ${v.action}d.`); },
    onError: (e) => toast(apiError(e, 'Action failed.')),
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load pending jobs." onRetry={refetch} />;
  if (data.length === 0) return <EmptyState icon="✅" title="No jobs pending review" sub="New provider listings will appear here." />;

  return (
    <>
      {data.map((job) => (
        <div key={job.id} className="pa-card">
          <div style={{ fontWeight: 700 }}>{job.title}</div>
          <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
            {job.company}{job.location ? ` · ${job.location}` : ''} · by {job.provider_name}
          </div>
          <div className="pa-chip-row" style={{ marginTop: 8 }}>
            {job.job_type && <span className="pa-badge pa-badge-neutral">{job.job_type}</span>}
            {job.remote_type && <span className="pa-badge pa-badge-neutral">{job.remote_type}</span>}
            {formatSalary(job.salary_min, job.salary_max, 'INR') && (
              <span className="pa-badge pa-badge-neutral">{formatSalary(job.salary_min, job.salary_max, 'INR')}</span>
            )}
          </div>
          <div className="pa-row" style={{ marginTop: 12 }}>
            <Button size="sm" loading={decide.isPending && decide.variables?.id === job.id && decide.variables.action === 'approve'}
              onClick={() => decide.mutate({ id: job.id, action: 'approve' })}>Approve</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--danger)' }}
              loading={decide.isPending && decide.variables?.id === job.id && decide.variables.action === 'reject'}
              onClick={() => decide.mutate({ id: job.id, action: 'reject' })}>Reject</Button>
          </div>
        </div>
      ))}
    </>
  );
}

interface AccessReq {
  id: string; title: string; company: string; provider_name: string; provider_email: string | null;
}

function AccessRequests() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-access-reqs'],
    queryFn: async () => (await api.get<AccessReq[]>('/admin/pending-applicant-access')).data,
  });

  const decide = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api.post(`/admin/jobs/${id}/${action}-applicant-access`),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['admin-access-reqs'] }); toast(`Access ${v.action}d.`); },
    onError: (e) => toast(apiError(e, 'Action failed.')),
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load access requests." onRetry={refetch} />;
  if (data.length === 0) return <EmptyState icon="🔓" title="No pending access requests" sub="Provider requests to view applicant details appear here." />;

  return (
    <>
      {data.map((req) => (
        <div key={req.id} className="pa-card">
          <div style={{ fontWeight: 700 }}>{req.title}</div>
          <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
            {req.company} · requested by {req.provider_name} ({req.provider_email})
          </div>
          <div className="pa-row" style={{ marginTop: 12 }}>
            <Button size="sm" loading={decide.isPending && decide.variables?.id === req.id && decide.variables.action === 'approve'}
              onClick={() => decide.mutate({ id: req.id, action: 'approve' })}>Grant access</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--danger)' }}
              loading={decide.isPending && decide.variables?.id === req.id && decide.variables.action === 'reject'}
              onClick={() => decide.mutate({ id: req.id, action: 'reject' })}>Reject</Button>
          </div>
        </div>
      ))}
    </>
  );
}

interface PanProvider {
  id: string; name: string | null; email: string; phone: string | null;
  company_pan: string; company_reg_no: string | null; gstin: string | null;
}

function PanVerify() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-pan'],
    queryFn: async () => (await api.get<PanProvider[]>('/admin/pending-pan-providers')).data,
  });

  const decide = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'verify-pan' | 'reject-pan' }) => api.post(`/admin/users/${id}/${action}`),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['admin-pan'] }); toast(v.action === 'verify-pan' ? 'PAN verified.' : 'PAN rejected.'); },
    onError: (e) => toast(apiError(e, 'Action failed.')),
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load PAN requests." onRetry={refetch} />;
  if (data.length === 0) return <EmptyState icon="🪪" title="No PAN verifications pending" sub="Providers awaiting PAN verification appear here." />;

  return (
    <>
      {data.map((p) => (
        <div key={p.id} className="pa-card">
          <div style={{ fontWeight: 700 }}>{p.name || p.email}</div>
          <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>{p.email}{p.phone ? ` · ${p.phone}` : ''}</div>
          <div className="pa-chip-row" style={{ marginTop: 8 }}>
            <span className="pa-badge pa-badge-neutral">PAN {p.company_pan}</span>
            {p.company_reg_no && <span className="pa-badge pa-badge-neutral">CIN {p.company_reg_no}</span>}
            {p.gstin && <span className="pa-badge pa-badge-neutral">GST {p.gstin}</span>}
          </div>
          <div className="pa-row" style={{ marginTop: 12 }}>
            <Button size="sm" loading={decide.isPending && decide.variables?.id === p.id && decide.variables.action === 'verify-pan'}
              onClick={() => decide.mutate({ id: p.id, action: 'verify-pan' })}>Verify</Button>
            <Button size="sm" variant="ghost" style={{ color: 'var(--danger)' }}
              loading={decide.isPending && decide.variables?.id === p.id && decide.variables.action === 'reject-pan'}
              onClick={() => decide.mutate({ id: p.id, action: 'reject-pan' })}>Reject</Button>
          </div>
        </div>
      ))}
    </>
  );
}

interface AdminUser {
  id: string; email: string; name: string | null; subscription: string;
  role: string; created_at: string | null; pro_plan_type: string | null;
}

const PLAN_TYPES: { id: string; label: string }[] = [
  { id: 'monthly', label: '₹199 / mo' },
  { id: 'quarterly', label: '₹499 / qtr' },
  { id: 'yearly', label: '₹999 / yr' },
];

function Users() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get<{ users: AdminUser[] }>('/admin/users?limit=100')).data,
  });

  const delUser = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast('User deleted.');
    },
    onError: (e) => toast(apiError(e, 'Could not delete user.')),
  });

  const setPlan = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) =>
      api.post(`/admin/users/${id}/set-plan-type?plan_type=${plan}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast('Plan type updated.');
    },
    onError: (e) => toast(apiError(e, 'Could not update plan type.')),
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load users." onRetry={refetch} />;

  return (
    <div className="pa-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="pa-table-wrap">
        <table className="pa-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {data.users.map((u) => {
              const isPro = u.subscription === 'pro';
              return (
                <tr key={u.id}>
                  <td>{u.name || '—'}</td>
                  <td>{u.email}</td>
                  <td>{u.role.replace('job_', '')}</td>
                  <td>
                    {isPro ? (
                      u.pro_plan_type
                        ? <span className="pa-badge pa-badge-success">pro · {u.pro_plan_type}</span>
                        : (
                          <div className="pa-chip-row">
                            <span className="pa-badge pa-badge-primary">pro</span>
                            {PLAN_TYPES.map((p) => (
                              <button key={p.id} className="pa-chip" style={{ padding: '3px 9px', fontSize: 12 }}
                                disabled={setPlan.isPending}
                                onClick={() => setPlan.mutate({ id: u.id, plan: p.id })}>{p.label}</button>
                            ))}
                          </div>
                        )
                    ) : 'free'}
                  </td>
                  <td>{u.created_at ? formatDate(u.created_at) : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }}
                      disabled={delUser.isPending && delUser.variables === u.id}
                      onClick={() => { if (confirm(`Delete ${u.name || u.email} and all their data?`)) delUser.mutate(u.id); }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
