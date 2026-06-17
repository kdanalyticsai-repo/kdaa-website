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
    <div className="pa-content" style={{ maxWidth: 640 }}>
      <h1 className="pa-page-title">Company profile</h1>
      <div style={{ marginTop: 10 }}>{panBadge(user)}</div>

      {profile.isLoading ? <Loading /> : (
        <div className="pa-card" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Company details</h3>
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
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Verification</h3>
        <p className="pa-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Reviewed by our team. The verified badge appears on your profile once approved.
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
