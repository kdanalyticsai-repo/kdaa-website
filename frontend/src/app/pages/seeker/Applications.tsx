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
      <div className="pa-between" style={{ flexWrap: 'wrap', gap: 12 }}>
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
            <div key={app.id} className="pa-job-card">
              <span className="pa-app-logo"><span className="material-symbols-outlined">domain</span></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pa-between" style={{ gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{app.job?.title || 'Untitled role'}</div>
                    <div className="pa-muted" style={{ fontSize: 13, marginTop: 2 }}>
                      {app.job?.company}{app.job?.location ? ` · ${app.job.location}` : ''} · {formatDate(app.applied_at)}
                    </div>
                  </div>
                  <select className="pa-select" style={{ width: 'auto', flexShrink: 0 }} value={app.status}
                    onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}>
                    {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="pa-row" style={{ marginTop: 12 }}>
                  {app.job?.external_url && (
                    <a className="pa-btn pa-btn-ghost pa-btn-sm" href={app.job.external_url} target="_blank" rel="noreferrer">Open posting ↗</a>
                  )}
                  <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }}
                    onClick={() => remove.mutate(app.id)}>Remove</button>
                </div>
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

  const searchQuery = [title.trim(), company.trim()].filter(Boolean).join(' ');
  const searchQ = encodeURIComponent(searchQuery ? `${searchQuery} jobs` : 'jobs in India');

  return (
    <div style={overlay} onClick={onClose}>
      <div className="pa-card" style={{ maxWidth: 460, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Log an application</h3>
        <p className="pa-muted" style={{ fontSize: 13, marginBottom: 14 }}>Search for the job first, paste the URL below, then save.</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <a target="_blank" rel="noreferrer" href={`https://www.google.com/search?q=${searchQ}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #dadce0', background: '#fff', color: '#3c4043', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'box-shadow .15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)')}>
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.68 28.18A13.86 13.86 0 0 1 10.8 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A23.93 23.93 0 0 0 0 24c0 3.86.92 7.51 2.56 10.73l7.12-5.52-.01-.03z"/><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.34 5.7C13.42 13.62 18.27 9.75 24 9.75z"/></svg>
            Google
          </a>
          <a target="_blank" rel="noreferrer" href={`https://duckduckgo.com/?q=${searchQ}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #de5833', background: '#fff', color: '#de5833', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'box-shadow .15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(222,88,51,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)')}>
            <svg width="16" height="16" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#de5833"/><ellipse cx="64" cy="58" rx="28" ry="30" fill="#fff"/><circle cx="54" cy="52" r="7" fill="#3d3d3d"/><circle cx="57" cy="50" r="2.5" fill="#fff"/><circle cx="74" cy="52" r="7" fill="#3d3d3d"/><circle cx="77" cy="50" r="2.5" fill="#fff"/><path d="M52 70 Q64 80 76 70" stroke="#de5833" strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>
            DuckDuckGo
          </a>
        </div>

        <Field label="Job title *"><input className="pa-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Software Engineer" /></Field>
        <Field label="Company *"><input className="pa-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Infosys" /></Field>
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
