import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { Button, Loading } from '@/app/components/ui';
import { FeatureGate } from '@/app/components/FeatureGate';
import { AiToolError } from '@/app/components/AiToolError';

interface TailorResult {
  tailored_sections?: Record<string, string> | null;
  changes?: string[] | null;
  keywords_added: string[];
  ats_score_before?: number | null;
  ats_score_after?: number | null;
}

export default function Tailor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = useQuery({
    queryKey: ['job', id],
    queryFn: async () => (await api.get<{ title: string; company: string }>(`/jobs/${id}`)).data,
    enabled: !!id,
  });

  const run = useMutation({
    mutationFn: async () => (await api.post<TailorResult>('/ai/tailor', { job_id: id })).data,
  });

  return (
    <div className="pa-content">
      <button className="pa-btn pa-btn-ghost pa-btn-sm" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="pa-page-title" style={{ marginTop: 12 }}>Tailor your resume</h1>
      <p className="pa-page-sub">
        {job.data ? `For ${job.data.title} · ${job.data.company}` : 'AI-optimized for this role'}
      </p>

      <FeatureGate feature="tailor">
        <div className="pa-card" style={{ marginTop: 16 }}>
          {!run.data && !run.isPending && (
            <>
              <p className="pa-muted" style={{ marginBottom: 14 }}>
                We’ll rewrite your primary resume to match this job’s keywords and
                requirements, and estimate the ATS score lift.
              </p>
              <Button loading={run.isPending} onClick={() => run.mutate()}>Tailor my resume</Button>
            </>
          )}
          {run.isPending && <Loading label="Tailoring your resume… this may take 20–30 seconds" />}
          {run.isError && (() => {
            const msg = apiError(run.error, '');
            if (/upgrade_required|pro subscription/i.test(msg) || (run.error as any)?.response?.status === 403) {
              return (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Upgrade to Pro to tailor your resume</div>
                  <p className="pa-muted" style={{ marginBottom: 16 }}>AI resume tailoring is a Pro feature.</p>
                  <Button onClick={() => navigate('/paywall')}>Upgrade to Pro</Button>
                </div>
              );
            }
            return <AiToolError error={run.error} fallback="Could not tailor resume. Please try again." onRetry={() => run.mutate()} />;
          })()}

          {run.data && (
            <div>
              {(run.data.ats_score_before != null || run.data.ats_score_after != null) && (
                <div className="pa-row" style={{ gap: 24, marginBottom: 18 }}>
                  <div>
                    <div className="pa-label">ATS before</div>
                    <div className="pa-stat-num">{run.data.ats_score_before ?? '—'}</div>
                  </div>
                  <div style={{ alignSelf: 'center', fontSize: 20 }}>→</div>
                  <div>
                    <div className="pa-label">ATS after</div>
                    <div className="pa-stat-num" style={{ color: 'var(--primary)' }}>{run.data.ats_score_after ?? '—'}</div>
                  </div>
                </div>
              )}

              {run.data.keywords_added?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>Keywords added</h3>
                  <div className="pa-chip-row">
                    {run.data.keywords_added.map((k) => <span key={k} className="pa-badge pa-badge-success">{k}</span>)}
                  </div>
                </div>
              )}

              {run.data.changes && run.data.changes.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>What changed</h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {run.data.changes.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {run.data.tailored_sections && Object.entries(run.data.tailored_sections).map(([section, text]) => (
                <div key={section} style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8, textTransform: 'capitalize' }}>{section.replace(/_/g, ' ')}</h3>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{text}</div>
                </div>
              ))}

              <Button variant="ghost" onClick={() => run.reset()}>Run again</Button>
            </div>
          )}
        </div>
      </FeatureGate>
    </div>
  );
}
