import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { POLL_INTERVAL_MS } from '@/app/lib/config';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, Spinner } from '@/app/components/ui';
import type { User } from '@/app/lib/types';

const MAX_ATTEMPTS = 20; // ~1 min

/**
 * Razorpay redirects here after a web payment. The webhook may take a few
 * seconds to mark the user as Pro, so we poll /users/me until subscription
 * flips to 'pro' (or we time out and let the user retry).
 */
export default function PaywallSuccess() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [state, setState] = useState<'polling' | 'success' | 'timeout'>('polling');
  const attempts = useRef(0);

  useEffect(() => {
    let timer: number;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      attempts.current += 1;
      try {
        const { data } = await api.get<User>('/users/me');
        if (data.subscription === 'pro') {
          setUser(data);
          qc.invalidateQueries({ queryKey: ['my-usage'] });
          setState('success');
          return;
        }
      } catch { /* keep polling */ }

      if (attempts.current >= MAX_ATTEMPTS) { setState('timeout'); return; }
      timer = window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [qc, setUser]);

  return (
    <div className="pa-content" style={{ maxWidth: 480 }}>
      <div className="pa-card" style={{ textAlign: 'center', padding: '44px 28px' }}>
        {state === 'polling' && (
          <>
            <Spinner size={30} />
            <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 16 }}>Confirming your payment…</h2>
            <p className="pa-muted" style={{ marginTop: 8 }}>This usually takes a few seconds.</p>
          </>
        )}
        {state === 'success' && (
          <>
            <div style={{ fontSize: 46 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>Welcome to Pro!</h2>
            <p className="pa-muted" style={{ marginTop: 8 }}>All AI tools are now unlocked.</p>
            <Button style={{ marginTop: 20 }} onClick={() => navigate('/')}>Go to dashboard</Button>
          </>
        )}
        {state === 'timeout' && (
          <>
            <div style={{ fontSize: 40 }}>⏳</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>Still processing</h2>
            <p className="pa-muted" style={{ marginTop: 8 }}>
              Your payment may take a little longer to confirm. If you were charged,
              your Pro access will activate shortly.
            </p>
            <div className="pa-row" style={{ justifyContent: 'center', marginTop: 20 }}>
              <Button variant="ghost" onClick={() => window.location.reload()}>Check again</Button>
              <Button onClick={() => navigate('/')}>Go to dashboard</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
