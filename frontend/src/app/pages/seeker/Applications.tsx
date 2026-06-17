import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { STATUS_LABELS, STATUS_ORDER, formatDate } from '@/app/lib/format';
import { Button, Field, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface AppItem {
  id: string; status: string; notes: string | null; applied_at: string;
  job: { title: string; company: string; location: string; external_url: string | null; source: string | null } | null;
}

export default function Applications() {
  const qc = useQueryClient();
  const toast = useToast();
  const [showLog, setShowLog] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => (await api.get<{ applications: AppItem[]; total: number }>('/applications')).data,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/applications/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
    onError: () => toast('Could not update status.'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/applications/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); toast('Removed.'); },
  });

  const apps = data?.applications ?? [];

  return (
    <div className="pa-content">
      <div className="pa-between">
        <div>
          <h1 className="pa-page-title">Applications</h1>
          <p className="pa-page-sub">Track every job you’ve applied to</p>
        </div>
        <Button onClick={() => setShowLog(true)}>+ Log application</Button>
      </div>

      <div style={{ marginTop: 18 }}>
        {isLoading ? <Loading />
          : isError ? <ErrorState message="Could not load applications." onRetry={refetch} />
          : apps.length === 0 ? (
            <EmptyState icon="📋" title="No applications yet"
              sub="Track jobs you apply to here — including ones you found elsewhere."
              action={<Button onClick={() => setShowLog(true)}>Log your first application</Button>} />
          ) : apps.map((app) => (
            <div key={app.id} className="pa-card">
              <div className="pa-between">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{app.job?.title || 'Untitled role'}</div>
                  <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {app.job?.company}{app.job?.location ? ` · ${app.job.location}` : ''} · {formatDate(app.applied_at)}
                  </div>
                </div>
                <select className="pa-select" style={{ width: 'auto' }} value={app.status}
                  onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}>
                  {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div className="pa-row" style={{ marginTop: 10 }}>
                {app.job?.external_url && (
                  <a className="pa-btn pa-btn-ghost pa-btn-sm" href={app.job.external_url} target="_blank" rel="noreferrer">Open posting ↗</a>
                )}
                <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }}
                  onClick={() => remove.mutate(app.id)}>Remove</button>
              </div>
            </div>
          ))}
      </div>

      {showLog && <LogModal onClose={() => setShowLog(false)} />}
    </div>
  );
}

function LogModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const save = useMutation({
    mutationFn: () => api.post('/applications', {
      job_title: title.trim(), company: company.trim(),
      location: location.trim() || undefined, external_url: url.trim() || undefined, source: 'manual',
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); toast('Application logged.'); onClose(); },
    onError: (e) => setError(apiError(e, 'Could not save. Check the details.')),
  });

  const submit = () => {
    if (!title.trim() || !company.trim()) { setError('Job title and company are required.'); return; }
    setError(''); save.mutate();
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div className="pa-card" style={{ maxWidth: 460, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Log an application</h3>
        <Field label="Job title *"><input className="pa-input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Company *"><input className="pa-input" value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
        <Field label="Location"><input className="pa-input" value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
        <Field label="Job posting URL" error={error}><input className="pa-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /></Field>
        <div className="pa-row" style={{ marginTop: 6 }}>
          <Button variant="ghost" block onClick={onClose}>Cancel</Button>
          <Button block loading={save.isPending} onClick={submit}>Save</Button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 80,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
};
