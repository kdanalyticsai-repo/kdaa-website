import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, Field, Loading, useToast } from '@/app/components/ui';
import { panBadge } from './ProviderHome';
import type { User } from '@/app/lib/types';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '200+'];
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

interface ProviderProfile {
  company_name: string | null; company_size: string | null;
  industry: string | null; website: string | null;
}

export default function ProviderProfile() {
  const qc = useQueryClient();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const profile = useQuery({
    queryKey: ['provider-profile'],
    queryFn: async () => (await api.get<ProviderProfile>('/users/me/provider-profile')).data,
  });

  const [company, setCompany] = useState<ProviderProfile>({ company_name: '', company_size: '', industry: '', website: '' });
  const [pan, setPan] = useState(user?.company_pan ?? '');
  const [regNo, setRegNo] = useState(user?.company_reg_no ?? '');
  const [gstin, setGstin] = useState(user?.gstin ?? '');
  const [panError, setPanError] = useState('');

  useEffect(() => {
    if (profile.data) setCompany({
      company_name: profile.data.company_name ?? '', company_size: profile.data.company_size ?? '',
      industry: profile.data.industry ?? '', website: profile.data.website ?? '',
    });
  }, [profile.data]);

  const saveCompany = useMutation({
    mutationFn: () => api.patch('/users/me/provider-profile', company),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['provider-profile'] }); toast('Company details saved.'); },
    onError: (e) => toast(apiError(e, 'Could not save company details.')),
  });

  const saveVerification = useMutation({
    mutationFn: async () =>
      (await api.patch<User>('/users/me', {
        company_pan: pan.trim().toUpperCase() || undefined,
        company_reg_no: regNo.trim() || undefined,
        gstin: gstin.trim() || undefined,
      })).data,
    onSuccess: (data) => { setUser(data); toast('Verification details submitted for review.'); },
    onError: (e) => toast(apiError(e, 'Could not save verification details.')),
  });

  const submitVerification = () => {
    if (pan.trim() && !PAN_RE.test(pan.trim().toUpperCase())) {
      setPanError('Enter a valid PAN (e.g. ABCDE1234F).'); return;
    }
    setPanError(''); saveVerification.mutate();
  };

  if (!user) return null;

  return (
    <div className="pa-content" style={{ maxWidth: 720 }}>
      <h1 className="pa-page-title">Manage Employer Details</h1>
      <p className="pa-page-sub">Optimize how your company appears to top talent.</p>
      <div style={{ marginTop: 12 }}>{panBadge(user)}</div>

      {(() => {
        const fields = [company.company_name, company.industry, company.company_size, company.website, user.pan_verified];
        const strength = Math.round((fields.filter(Boolean).length / fields.length) * 100);
        return (
          <div className="pa-card pa-ai-card" style={{ color: '#fff', marginTop: 16 }}>
            <div className="pa-tile" style={{ position: 'relative' }}>
              <span className="pa-ai-avatar"><span className="material-symbols-outlined fill">insights</span></span>
              <div>
                <div className="pa-ai-title">Profile Strength</div>
                <div className="pa-ai-sub">How complete your employer profile is</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 800, position: 'relative' }}>{strength}%</span>
            </div>
            <div className="pa-bar-track" style={{ position: 'relative', marginTop: 14, background: 'rgba(255,255,255,.18)' }}>
              <div className="pa-bar-fill" style={{ width: `${strength}%`, background: 'var(--tertiary)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 12, position: 'relative' }}>
              {strength < 100 ? 'Complete every field and get PAN-verified to reach 100%.' : 'Your profile is fully complete.'}
            </p>
          </div>
        );
      })()}

      {profile.isLoading ? <Loading /> : (
        <div className="pa-card" style={{ marginTop: 16 }}>
          <div className="pa-card-head">
            <span className="pa-icon-pill primary"><span className="material-symbols-outlined fill">edit_note</span></span>
            <div><h3>Basic Information</h3><div className="sub">Essential details for job seekers</div></div>
          </div>
          <Field label="Company name"><input className="pa-input" value={company.company_name ?? ''} onChange={(e) => setCompany((c) => ({ ...c, company_name: e.target.value }))} /></Field>
          <Field label="Industry"><input className="pa-input" value={company.industry ?? ''} onChange={(e) => setCompany((c) => ({ ...c, industry: e.target.value }))} placeholder="IT / Software" /></Field>
          <Field label="Company size">
            <select className="pa-select" value={company.company_size ?? ''} onChange={(e) => setCompany((c) => ({ ...c, company_size: e.target.value }))}>
              <option value="">Select…</option>
              {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </Field>
          <Field label="Website"><input className="pa-input" value={company.website ?? ''} onChange={(e) => setCompany((c) => ({ ...c, website: e.target.value }))} placeholder="https://…" /></Field>
          <Button loading={saveCompany.isPending} onClick={() => saveCompany.mutate()}>Save company details</Button>
        </div>
      )}

      <div className="pa-card">
        <div className="pa-card-head">
          <span className="pa-icon-pill cyan"><span className="material-symbols-outlined fill">verified_user</span></span>
          <div><h3>Verification</h3><div className="sub">Reviewed by our team — the verified badge appears once approved.</div></div>
        </div>
        <p className="pa-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Changing your PAN resets verification.
        </p>
        <Field label="Company PAN" error={panError}><input className="pa-input" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} /></Field>
        <Field label="Registration No. (CIN)"><input className="pa-input" value={regNo} onChange={(e) => setRegNo(e.target.value)} /></Field>
        <Field label="GSTIN (optional)"><input className="pa-input" value={gstin} onChange={(e) => setGstin(e.target.value)} maxLength={15} /></Field>
        <Button loading={saveVerification.isPending} onClick={submitVerification}>Submit for verification</Button>
      </div>

      <div className="pa-card">
        <Link to="/settings" className="pa-list-link">⚙️ Settings & security <span>›</span></Link>
      </div>
    </div>
  );
}
