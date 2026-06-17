import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError, tokenStore } from '@/app/lib/api';
import { API_URL, MAX_FILE_SIZE_MB } from '@/app/lib/config';
import { Button, Loading, EmptyState, ErrorState, useToast } from '@/app/components/ui';

interface ResumeItem {
  id: string; name: string; status: string; ats_score: number | null;
  completeness_score: number | null; is_primary: boolean; version: number;
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
      // Use fetch for multipart so axios JSON defaults don't interfere.
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

  return (
    <div className="pa-content">
      <div className="pa-between">
        <div>
          <h1 className="pa-page-title">Resume</h1>
          <p className="pa-page-sub">Upload your CV — we’ll score it for ATS and power AI tailoring</p>
        </div>
        <Button loading={uploading} onClick={() => fileRef.current?.click()}>↑ Upload resume</Button>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={onFile} />
      </div>

      <div style={{ marginTop: 18 }}>
        {isLoading ? <Loading />
          : isError ? <ErrorState message="Could not load resumes." onRetry={refetch} />
          : resumes.length === 0 ? (
            <EmptyState icon="📄" title="No resume yet"
              sub="Upload a PDF or Word file to get an instant ATS score."
              action={<Button loading={uploading} onClick={() => fileRef.current?.click()}>Upload resume</Button>} />
          ) : resumes.map((r) => (
            <div key={r.id} className="pa-card">
              <div className="pa-between">
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {r.name} {r.is_primary && <span className="pa-badge pa-badge-primary" style={{ marginLeft: 6 }}>Primary</span>}
                  </div>
                  <div className="pa-muted" style={{ fontSize: 13, marginTop: 3 }}>
                    {r.status === 'processing' ? '⏳ Analyzing…'
                      : r.status === 'failed' ? '⚠️ Processing failed'
                      : `ATS score ${r.ats_score ?? '—'} · Completeness ${r.completeness_score ?? '—'}%`}
                  </div>
                </div>
                {r.status === 'processing' && <span className="pa-spinner" />}
              </div>
              <div className="pa-row" style={{ marginTop: 12 }}>
                {!r.is_primary && r.status === 'ready' && (
                  <Button size="sm" variant="ghost" loading={setPrimary.isPending} onClick={() => setPrimary.mutate(r.id)}>
                    Set as primary
                  </Button>
                )}
                <button className="pa-btn pa-btn-ghost pa-btn-sm" style={{ color: 'var(--danger)' }}
                  onClick={() => remove.mutate(r.id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
