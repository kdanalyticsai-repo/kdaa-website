import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api, apiError, tokenStore } from '@/app/lib/api';
import { API_URL } from '@/app/lib/config';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, useToast } from '@/app/components/ui';

export default function Settings() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isPro = user?.subscription === 'pro';
  const isSeeker = user?.role === 'job_seeker';

  const exportData = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/users/me/export`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      if (!res.ok) throw new Error('export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'proaicv-my-data.json'; a.click();
      URL.revokeObjectURL(url);
    },
    onError: (e) => toast(apiError(e, 'Could not export your data.')),
  });

  const downgrade = useMutation({
    mutationFn: () => api.post('/subscriptions/downgrade'),
    onSuccess: () => toast('Auto-renew turned off. Pro stays active until it expires.'),
    onError: (e) => toast(apiError(e, 'Could not update subscription.')),
  });

  const deleteAccount = useMutation({
    mutationFn: () => api.delete('/users/me'),
    onSuccess: async () => { await logout(); navigate('/login'); },
    onError: (e) => toast(apiError(e, 'Could not delete account.')),
  });

  const onLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div className="pa-content" style={{ maxWidth: 640 }}>
      <h1 className="pa-page-title">Settings</h1>
      <p className="pa-page-sub">Manage your account, data and security</p>

      <div className="pa-card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Security</h3>
        <Link to="/forgot-password" className="pa-list-link">🔐 Change password <span>›</span></Link>
        {user && !user.phone_verified && (
          <Link to="/verify-phone" className="pa-list-link">📱 Verify phone number <span>›</span></Link>
        )}
      </div>

      {isSeeker && (
        <div className="pa-card">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Subscription</h3>
          {isPro ? (
            <Button variant="ghost" loading={downgrade.isPending} onClick={() => downgrade.mutate()}>
              Turn off auto-renew
            </Button>
          ) : (
            <Link to="/paywall" className="pa-btn pa-btn-primary">Upgrade to Pro</Link>
          )}
        </div>
      )}

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Your data</h3>
        <Button variant="ghost" loading={exportData.isPending} onClick={() => exportData.mutate()}>
          ⬇ Export my data
        </Button>
      </div>

      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Legal</h3>
        <a className="pa-list-link" href="https://kdaanalytics.com/terms-of-service" target="_blank" rel="noreferrer">📋 Terms & Conditions <span>›</span></a>
        <a className="pa-list-link" href="https://kdaanalytics.com/privacy-policy" target="_blank" rel="noreferrer">🔒 Privacy Policy <span>›</span></a>
      </div>

      <div className="pa-card" style={{ borderColor: 'var(--danger)' }}>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Danger zone</h3>
        <p className="pa-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Deleting your account permanently removes your resumes, applications and data.
        </p>
        {!confirmDelete ? (
          <button className="pa-btn pa-btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(true)}>
            Delete account
          </button>
        ) : (
          <div className="pa-row">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" loading={deleteAccount.isPending} onClick={() => deleteAccount.mutate()}>
              Yes, delete permanently
            </Button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <Button variant="ghost" block onClick={onLogout}>Sign out</Button>
      </div>
    </div>
  );
}
