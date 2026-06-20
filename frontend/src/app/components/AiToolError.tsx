import { Link } from 'react-router-dom';
import { apiError } from '@/app/lib/api';
import { ErrorState, EmptyState } from './ui';

/**
 * Error display for the AI tools (tailor / cover letter / interview prep).
 * When the failure is "no resume", show a friendly upload prompt instead of a
 * raw backend error + "Try again".
 */
export function AiToolError({ error, fallback, onRetry }: { error: unknown; fallback: string; onRetry: () => void }) {
  const msg = apiError(error, fallback);
  if (/resume/i.test(msg)) {
    return (
      <EmptyState
        icon="📄"
        title="Upload a resume to use this feature"
        sub="This tool works from your primary resume — upload one to get started."
        action={<Link to="/resume" className="pa-btn pa-btn-primary">Upload resume</Link>}
      />
    );
  }
  return <ErrorState message={msg} onRetry={onRetry} />;
}
