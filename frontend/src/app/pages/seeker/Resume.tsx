import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError, tokenStore } from '@/app/lib/api';
import { API_URL, MAX_FILE_SIZE_MB } from '@/app/lib/config';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface ResumeItem {
  id: string; name: string; status: string; ats_score: number | null;
  completeness_score: number | null; is_primary: boolean; version: number;
}

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

export default function Resume() {
  const qc = useQueryClient();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => (await api.get<{ resumes: ResumeItem[]; total: number }>('/resumes')).data,
    refetchInterval: (q) => {
      const list = (q.state.data as { resumes: ResumeItem[] } | undefined)?.resumes ?? [];
      return list.some((r) => r.status === 'processing') ? 4000 : false;
    },
  });

  const setPrimary = useMutation({
    mutationFn: (id: string) => api.post(`/resumes/${id}/primary`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resumes'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/resumes/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['resumes'] }); toast('Resume deleted.'); },
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) { toast(`Max file size is ${MAX_FILE_SIZE_MB}MB.`); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('name', file.name.replace(/\.[^.]+$/, ''));
      const res = await fetch(`${API_URL}/resumes/upload-file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
        body: form,
      });
      if (!res.ok) throw new Error('upload failed');
      toast('Uploaded — analyzing your resume…');
      qc.invalidateQueries({ queryKey: ['resumes'] });
    } catch (err) {
      toast(apiError(err, 'Upload failed. Try a PDF or DOCX under 10MB.'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const resumes = data?.resumes ?? [];
  const primary = resumes.find((r) => r.is_primary) ?? resumes[0];

  return (
    <div className="pa-content">
      <div style={{ textAlign: 'center' }}>
        <h1 className="pa-page-title">Resume Hub</h1>
        <p className="pa-page-sub" style={{ maxWidth: 520, margin: '6px auto 0' }}>Upload your CV — we’ll score it for ATS and power AI tailoring.</p>
        <Button loading={uploading} onClick={() => fileRef.current?.click()} style={{ marginTop: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>upload_file</span> Upload resume
        </Button>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={onFile} />
      </div>

      <div style={{ marginTop: 20 }}>
        {isLoading ? <Loading />
          : isError ? <ErrorState message="Could not load resumes." onRetry={refetch} />
          : resumes.length === 0 ? (
            <EmptyState icon="📄" title="No resume yet"
              sub="Upload a PDF or Word file to get an instant ATS score."
              action={<Button loading={uploading} onClick={() => fileRef.current?.click()}>Upload resume</Button>} />
          ) : (
            <>
              {/* Primary resume hero */}
              {primary && (
                <div className="pa-card" style={{ borderRadius: 24, padding: 28 }}>
                  <div className="pa-tile" style={{ alignItems: 'flex-start' }}>
                    <span className="pa-resume-thumb"><Icon name="description" /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="pa-between">
                        <div style={{ fontWeight: 800, fontSize: 20 }}>{primary.name}</div>
                        {primary.is_primary && <span className="pa-badge pa-badge-primary">Primary</span>}
                      </div>
                      <div className="pa-muted" style={{ fontSize: 13, marginTop: 4 }}>
                        {primary.status === 'processing' ? '⏳ Analyzing…'
                          : primary.status === 'failed' ? '⚠️ Processing failed'
                          : `Version ${primary.version} · Ready`}
                      </div>
                    </div>
                  </div>

                  <div className="pa-bento" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', display: 'grid', gap: 14, marginTop: 22 }}>
                    <ScoreCard label="ATS Score" value={primary.ats_score} suffix="/100" max={100} color="var(--primary)" />
                    <ScoreCard label="Completeness" value={primary.completeness_score} suffix="%" max={100} color="var(--tertiary)" />
                    <div className="pa-score-card">
                      <div className="pa-metric-label">Status</div>
                      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8, color: primary.status === 'ready' ? 'var(--success)' : 'var(--warning)' }}>
                        {primary.status === 'ready' ? 'Ready' : primary.status === 'processing' ? 'Analyzing' : 'Failed'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All resumes */}
              <h3 style={{ fontSize: 18, margin: '28px 0 14px' }}>All Resumes</h3>
              <div className="pa-grid pa-grid-2">
                {resumes.map((r) => (
                  <div key={r.id} className="pa-card pa-tile" style={{ alignItems: 'flex-start' }}>
                    <span className="pa-icon-pill primary"><Icon name="description" /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        {r.is_primary && <span className="pa-badge pa-badge-primary">Primary</span>}
                      </div>
                      <div className="pa-muted" style={{ fontSize: 13, marginTop: 3 }}>
                        {r.status === 'processing' ? '⏳ Analyzing…'
                          : r.status === 'failed' ? '⚠️ Failed'
                          : `ATS ${r.ats_score ?? '—'} · ${r.completeness_score ?? '—'}% complete`}
                      </div>
                      <div className="pa-row" style={{ marginTop: 12 }}>
                        {!r.is_primary && r.status === 'ready' && (
                          <Button size="sm" variant="ghost" loading={setPrimary.isPending} onClick={() => setPrimary.mutate(r.id)}>Set as primary</Button>
                        )}
                        <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove.mutate(r.id)}>Delete</button>
                      </div>
                    </div>
                    {r.status === 'processing' && <span className="pa-spinner" />}
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, suffix, max, color }: {
  label: string; value: number | null; suffix: string; max: number; color: string;
}) {
  return (
    <div className="pa-score-card">
      <div className="pa-metric-label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color }}>{value ?? '—'}</span>
        {value != null && <span className="pa-muted" style={{ fontWeight: 700, fontSize: 14 }}>{suffix}</span>}
      </div>
      <div className="pa-bar-track" style={{ marginTop: 12 }}>
        <div className="pa-bar-fill" style={{ width: `${value != null ? (value / max) * 100 : 0}%`, background: color }} />
      </div>
    </div>
  );
}
