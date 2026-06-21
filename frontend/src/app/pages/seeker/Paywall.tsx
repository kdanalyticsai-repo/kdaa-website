import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { PAYMENT_RETURN_URL } from '@/app/lib/config';
import { Button, useToast } from '@/app/components/ui';
import type { PlanId } from '@/app/lib/types';

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  per: string;
  note?: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  { id: 'monthly', label: 'Monthly', price: '₹199', per: '/month' },
  { id: 'quarterly', label: 'Quarterly', price: '₹499', per: '/3 months', note: 'Save 16%' },
  { id: 'yearly', label: 'Yearly', price: '₹999', per: '/year', note: 'Best value — save 58%', highlight: true },
];

const PRO_FEATURES = [
  'Unlimited AI resume tailoring',
  'Unlimited cover letters',
  'Unlimited interview prep',
  'Unlimited AI career coaching',
  'Priority job matches',
];

export default function Paywall() {
  const navigate = useNavigate();
  const toast = useToast();
  const [selected, setSelected] = useState<PlanId>('yearly');
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<{ url: string }>('/subscriptions/payment-url', {
        params: { plan: selected, return_url: PAYMENT_RETURN_URL },
      });
      // Hand off to Razorpay-hosted checkout; it redirects back to PAYMENT_RETURN_URL.
      window.location.href = data.url;
    } catch (e) {
      toast(apiError(e, 'Could not start checkout. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="pa-content" style={{ maxWidth: 720 }}>
      <button className="pa-btn pa-btn-ghost pa-btn-sm" onClick={() => navigate(-1)}>← Back</button>

      <div style={{ textAlign: 'center', margin: '18px 0 26px' }}>
        <div className="pa-paywall-icon" style={{ margin: '0 auto 14px' }}>✦</div>
        <h1 className="pa-page-title">Upgrade to ProAICV Pro</h1>
        <p className="pa-page-sub">Unlimited AI tools to land your next role faster</p>
      </div>

      <div className="pa-grid pa-grid-3">
        {PLANS.map((p) => (
          <button key={p.id} onClick={() => setSelected(p.id)}
            className={`pa-card pa-plan${selected === p.id ? ' selected' : ''}`}>
            {p.note && <span className={`pa-badge ${p.highlight ? 'pa-badge-success' : 'pa-badge-primary'}`}>{p.note}</span>}
            <div style={{ fontWeight: 700, marginTop: p.note ? 10 : 0 }}>{p.label}</div>
            <div style={{ marginTop: 6 }}>
              <span className="pa-stat-num" style={{ fontSize: 26 }}>{p.price}</span>
              <span className="pa-muted" style={{ fontSize: 13 }}> {p.per}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="pa-card" style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Everything in Pro</h3>
        {PRO_FEATURES.map((f) => (
          <div key={f} className="pa-row" style={{ marginBottom: 8 }}>
            <span style={{ color: 'var(--success)' }}>✓</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Button block loading={loading} onClick={startCheckout}>
          Continue with {PLANS.find((p) => p.id === selected)?.label} · {PLANS.find((p) => p.id === selected)?.price}
        </Button>
        <p className="pa-muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
          Secure payment via Razorpay. Contact us for refund queries.
        </p>
      </div>
    </div>
  );
}
