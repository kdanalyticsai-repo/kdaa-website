import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useUsage, isFeatureBlocked } from '@/app/lib/hooks';
import { Loading } from './ui';
import { formatDate } from '@/app/lib/format';

/**
 * Gates an AI feature behind the trial/Pro check. While usage loads we show a
 * spinner; if the feature is blocked (trial ended, no Pro) we show an upgrade
 * card instead of the children.
 */
export function FeatureGate({ feature, children }: { feature: string; children: ReactNode }) {
  const { data, isLoading } = useUsage();
  if (isLoading) return <Loading />;

  if (isFeatureBlocked(data, feature)) {
    const ended = data?.trial_ends_at ? formatDate(data.trial_ends_at) : null;
    return (
      <div className="pa-card pa-paywall">
        <div className="pa-paywall-icon">✦</div>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>
          {ended ? 'Your free trial has ended' : 'Upgrade to Pro'}
        </h2>
        <p className="pa-muted" style={{ marginTop: 8, maxWidth: 380 }}>
          {ended ? `Your 7-day trial ended on ${ended}. ` : ''}
          Upgrade to Pro for unlimited AI resume tailoring, cover letters,
          interview prep and career coaching.
        </p>
        <Link to="/paywall" className="pa-btn pa-btn-primary" style={{ marginTop: 18 }}>
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
