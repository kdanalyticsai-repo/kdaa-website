import { useState } from 'react';
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
  return (
    <div className="pa-grid pa-grid-4">
      <Stat label="Total users" value={data.total_users} />
      <Stat label="Pro users" value={data.pro_users} />
      <Stat label="Active jobs" value={data.total_jobs} />
      <Stat label="Applications" value={data.total_apps} />
      <Stat label="Resumes" value={data.total_resumes} />
      <Stat label="Monthly revenue" value={`₹${data.monthly_revenue_inr ?? 0}`} />
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

function Users() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get<{ users: AdminUser[] }>('/admin/users?limit=100')).data,
  });
  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorState message="Could not load users." onRetry={refetch} />;

  return (
    <div className="pa-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="pa-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {data.users.map((u) => (
            <tr key={u.id}>
              <td>{u.name || '—'}</td>
              <td>{u.email}</td>
              <td>{u.role.replace('job_', '')}</td>
              <td>{u.subscription === 'pro' ? <span className="pa-badge pa-badge-success">pro{u.pro_plan_type ? ` · ${u.pro_plan_type}` : ''}</span> : 'free'}</td>
              <td>{u.created_at ? formatDate(u.created_at) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
