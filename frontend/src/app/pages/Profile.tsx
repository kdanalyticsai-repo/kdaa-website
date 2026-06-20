import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { useUsage } from '@/app/lib/hooks';
import { formatDate } from '@/app/lib/format';
import { Button, Field, useToast } from '@/app/components/ui';
import type { User } from '@/app/lib/types';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToast();
  const usage = useUsage();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState('');

  const save = useMutation({
    mutationFn: async () =>
      (await api.patch<User>('/users/me', { name: name.trim(), phone: phone.trim() || undefined })).data,
    onSuccess: (data) => { setUser(data); setEditing(false); toast('Profile updated.'); },
    onError: (e) => setError(apiError(e, 'Could not save profile.')),
  });

  if (!user) return null;
  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  const isSeeker = user.role === 'job_seeker';
  const isPro = user.subscription === 'pro';
  const isTrial = usage.data?.is_trial;
  const trialEnds = usage.data?.trial_ends_at;

  return (
    <div className="pa-content" style={{ maxWidth: 640 }}>
      <h1 className="pa-page-title">Profile</h1>

      <div className="pa-card" style={{ marginTop: 16 }}>
        <div className="pa-row">
          <div className="pa-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name || 'Your name'}</div>
            <div className="pa-muted" style={{ fontSize: 14 }}>{user.email}</div>
            {user.phone && <div className="pa-muted" style={{ fontSize: 14 }}>{user.phone}</div>}
          </div>
        </div>

        {!editing ? (
          <div className="pa-row" style={{ marginTop: 16 }}>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit profile</Button>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <Field label="Full name"><input className="pa-input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Phone" error={error}><input className="pa-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" /></Field>
            <div className="pa-row">
              <Button variant="ghost" onClick={() => { setEditing(false); setError(''); setName(user.name ?? ''); setPhone(user.phone ?? ''); }}>Cancel</Button>
              <Button loading={save.isPending} onClick={() => { setError(''); save.mutate(); }}>Save</Button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription — job-seeker concept only */}
      {isSeeker && (
        <div className="pa-card">
          <div className="pa-between">
            <div>
              <h3 style={{ fontSize: 16 }}>Subscription</h3>
              <div className="pa-muted" style={{ fontSize: 14, marginTop: 4 }}>
                {isPro ? `Pro${usage.data?.pro_plan_type ? ` · ${usage.data.pro_plan_type}` : ''}`
                  : isTrial ? `Free trial${trialEnds ? ` · ends ${formatDate(trialEnds)}` : ''}`
                  : 'Free plan'}
              </div>
            </div>
            {isPro ? <span className="pa-badge pa-badge-success">✦ PRO</span>
              : <Link to="/paywall" className="pa-btn pa-btn-primary pa-btn-sm">Upgrade</Link>}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="pa-card">
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Account</h3>
        <Link to="/settings" className="pa-list-link">⚙️ Settings & security <span>›</span></Link>
        {isSeeker && <Link to="/resume" className="pa-list-link">📄 My resume <span>›</span></Link>}
        {isSeeker && <Link to="/insights" className="pa-list-link">📊 Insights <span>›</span></Link>}
        {user.role === 'job_provider' && <Link to="/provider/profile" className="pa-list-link">🏢 Company profile <span>›</span></Link>}
      </div>
    </div>
  );
}
