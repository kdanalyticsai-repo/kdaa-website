import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { useUsage } from '@/app/lib/hooks';
import { formatDate } from '@/app/lib/format';
import { Button, Field, useToast } from '@/app/components/ui';
import type { User } from '@/app/lib/types';

function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span className={`material-symbols-outlined${fill ? ' fill' : ''}`}>{name}</span>;
}

interface SettingLink { to: string; icon: string; title: string; sub: string; cta: string; }

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
  const roleLabel = user.role === 'job_provider' ? 'Employer' : user.role === 'admin' ? 'Administrator' : 'Job Seeker';

  const settings: SettingLink[] = [
    { to: '/settings', icon: 'security', title: 'Security & data', sub: 'Password, data export and account deletion.', cta: 'Manage' },
    ...(isSeeker ? [
      { to: '/resume', icon: 'description', title: 'My Resume', sub: 'Upload, score and tailor your CV.', cta: 'Open' },
      { to: '/insights', icon: 'analytics', title: 'Insights', sub: 'Your job-search performance.', cta: 'View' },
    ] : []),
    ...(user.role === 'job_provider' ? [
      { to: '/provider/profile', icon: 'domain', title: 'Company Profile', sub: 'Branding and verification details.', cta: 'Edit' },
    ] : []),
  ];

  return (
    <div className="pa-content">
      <div className="pa-breadcrumb"><span>Account</span><Icon name="chevron_right" /><span className="cur">Profile</span></div>

      <div className="pa-dash-mid">
        {/* Identity card */}
        <div className="pa-card" style={{ borderRadius: 24, padding: 28 }}>
          <div className="pa-tile" style={{ alignItems: 'flex-start', gap: 20 }}>
            <div className="pa-avatar" style={{ width: 88, height: 88, fontSize: 30, borderRadius: 24 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="pa-between">
                <div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{user.name || 'Your name'}</div>
                  <div className="pa-muted" style={{ fontSize: 14 }}>{roleLabel}</div>
                </div>
                {!editing && <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit profile</Button>}
              </div>
              {!editing && (
                <div className="pa-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px 24px', marginTop: 18 }}>
                  <ContactRow icon="mail" value={user.email} />
                  {user.phone && <ContactRow icon="call" value={user.phone} />}
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div style={{ marginTop: 18 }}>
              <Field label="Full name"><input className="pa-input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Phone" error={error}><input className="pa-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" /></Field>
              <div className="pa-row">
                <Button variant="ghost" onClick={() => { setEditing(false); setError(''); setName(user.name ?? ''); setPhone(user.phone ?? ''); }}>Cancel</Button>
                <Button loading={save.isPending} onClick={() => { setError(''); save.mutate(); }}>Save</Button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription — job-seeker only */}
        {isSeeker && (
          <div className="pa-card pa-ai-card" style={{ color: '#fff' }}>
            <div className="pa-metric-label" style={{ color: 'rgba(255,255,255,.75)', position: 'relative' }}>Subscription</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6, position: 'relative' }}>
              {isPro ? 'Pro' : isTrial ? 'Free trial' : 'Free'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 4, position: 'relative' }}>
              {isPro ? (usage.data?.pro_plan_type ? `${usage.data.pro_plan_type} plan` : 'Active')
                : isTrial ? (trialEnds ? `Ends ${formatDate(trialEnds)}` : 'Full access during trial')
                : 'Limited access'}
            </div>
            {!isPro && (
              <Link to="/paywall" className="pa-pill" style={{ position: 'relative', marginTop: 16, background: '#fff', color: '#3800c0' }}>Upgrade to Pro →</Link>
            )}
          </div>
        )}
      </div>

      {/* Account settings */}
      <h3 style={{ fontSize: 18, margin: '28px 0 14px' }}>Account Settings</h3>
      <div className="pa-setting-grid">
        {settings.map((s) => (
          <Link key={s.to} to={s.to} className="pa-setting-card">
            <span className="pa-icon-pill primary"><Icon name={s.icon} fill /></span>
            <h4>{s.title}</h4>
            <p>{s.sub}</p>
            <span className="arrow">{s.cta} <Icon name="arrow_forward" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="pa-tile" style={{ gap: 10, color: 'var(--text-secondary)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'color-mix(in srgb, var(--primary) 60%, transparent)' }}>{icon}</span>
      <span style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
    </div>
  );
}
