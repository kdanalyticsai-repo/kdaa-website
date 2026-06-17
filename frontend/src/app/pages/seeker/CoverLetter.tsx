import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { Button, Loading, ErrorState, useToast } from '@/app/components/ui';
import { FeatureGate } from '@/app/components/FeatureGate';

interface CoverLetterResult {
  subject_line: string;
  cover_letter: string;
  key_highlights: string[];
}

export default function CoverLetter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const job = useQuery({
    queryKey: ['job', id],
    queryFn: async () => (await api.get<{ title: string; company: string }>(`/jobs/${id}`)).data,
    enabled: !!id,
  });

  const run = useMutation({
    mutationFn: async () => (await api.post<CoverLetterResult>('/ai/cover-letter', { job_id: id })).data,
  });

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => toast('Copied to clipboard.'), () => toast('Copy failed.'));
  };

  return (
    <div className="pa-content">
      <button className="pa-btn pa-btn-ghost pa-btn-sm" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="pa-page-title" style={{ marginTop: 12 }}>Cover letter</h1>
      <p className="pa-page-sub">
        {job.data ? `For ${job.data.title} · ${job.data.company}` : 'Personalized for this role'}
      </p>

      <FeatureGate feature="cover_letter">
        <div className="pa-card" style={{ marginTop: 16 }}>
          {!run.data && !run.isPending && (
            <>
              <p className="pa-muted" style={{ marginBottom: 14 }}>
                Generate a tailored cover letter using your resume and this job description.
              </p>
              <Button onClick={() => run.mutate()}>Write cover letter</Button>
            </>
          )}
          {run.isPending && <Loading label="Writing your cover letter…" />}
          {run.isError && <ErrorState message={apiError(run.error, 'Could not generate cover letter.')} onRetry={() => run.mutate()} />}

          {run.data && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div className="pa-label">Subject line</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{run.data.subject_line}</div>
              </div>

              {run.data.key_highlights?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>Key highlights</h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {run.data.key_highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}

              <div className="pa-letter">{run.data.cover_letter}</div>

              <div className="pa-row" style={{ marginTop: 16 }}>
                <Button size="sm" onClick={() => copy(run.data!.cover_letter)}>Copy letter</Button>
                <Button size="sm" variant="ghost" onClick={() => run.reset()}>Regenerate</Button>
              </div>
            </div>
          )}
        </div>
      </FeatureGate>
    </div>
  );
}
