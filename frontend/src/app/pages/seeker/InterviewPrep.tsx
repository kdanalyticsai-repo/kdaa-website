import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Button, Loading } from '@/app/components/ui';
import { FeatureGate } from '@/app/components/FeatureGate';
import { AiToolError } from '@/app/components/AiToolError';

interface QA { question: string; answer?: string; guidance?: string; tip?: string }
interface PrepResult {
  behavioral_questions: QA[];
  technical_questions: QA[];
  questions_to_ask: string[];
  prep_tips: string[];
  role_research_points: string[];
}

function QABlock({ title, items }: { title: string; items: QA[] }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, marginBottom: 10 }}>{title}</h3>
      {items.map((q, i) => (
        <div key={i} className="pa-qa">
          <div style={{ fontWeight: 600 }}>{q.question}</div>
          {(q.answer || q.guidance) && (
            <div className="pa-muted" style={{ marginTop: 5, lineHeight: 1.6 }}>{q.answer || q.guidance}</div>
          )}
          {q.tip && <div style={{ marginTop: 5, fontSize: 13, color: 'var(--primary)' }}>💡 {q.tip}</div>}
        </div>
      ))}
    </div>
  );
}

export default function InterviewPrep() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = useQuery({
    queryKey: ['job', id],
    queryFn: async () => (await api.get<{ title: string; company: string }>(`/jobs/${id}`)).data,
    enabled: !!id,
  });

  const run = useMutation({
    mutationFn: async () => (await api.post<PrepResult>('/ai/interview-prep', { job_id: id })).data,
  });

  return (
    <div className="pa-content">
      <button className="pa-btn pa-btn-ghost pa-btn-sm" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="pa-page-title" style={{ marginTop: 12 }}>Interview prep</h1>
      <p className="pa-page-sub">
        {job.data ? `For ${job.data.title} · ${job.data.company}` : 'Tailored questions & talking points'}
      </p>

      <FeatureGate feature="interview_prep">
        <div className="pa-card" style={{ marginTop: 16 }}>
          {!run.data && !run.isPending && (
            <>
              <p className="pa-muted" style={{ marginBottom: 14 }}>
                Get likely behavioral and technical questions, smart questions to ask,
                and research points for this role.
              </p>
              <Button onClick={() => run.mutate()}>Generate prep</Button>
            </>
          )}
          {run.isPending && <Loading label="Building your prep sheet…" />}
          {run.isError && <AiToolError error={run.error} fallback="Could not generate prep." onRetry={() => run.mutate()} />}

          {run.data && (
            <div>
              <QABlock title="Behavioral questions" items={run.data.behavioral_questions} />
              <QABlock title="Technical questions" items={run.data.technical_questions} />

              {run.data.questions_to_ask?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>Questions to ask them</h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {run.data.questions_to_ask.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
              {run.data.role_research_points?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>Research points</h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {run.data.role_research_points.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
              {run.data.prep_tips?.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 8 }}>Prep tips</h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {run.data.prep_tips.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}

              <Button variant="ghost" onClick={() => run.reset()}>Run again</Button>
            </div>
          )}
        </div>
      </FeatureGate>
    </div>
  );
}
