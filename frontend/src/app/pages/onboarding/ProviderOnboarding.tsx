import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, Field, useToast } from '@/app/components/ui';

const SIZES = ['1–10', '11–50', '51–200', '200+'];
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [size, setSize] = useState('11–50');
  const [vacancies, setVacancies] = useState('');

  const [pan, setPan] = useState('');
  const [cin, setCin] = useState('');
  const [gstin, setGstin] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (pan && !PAN_RE.test(pan.toUpperCase())) {
      setError('Enter a valid PAN (e.g. AAAAA9999A).');
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post('/users/me/onboarding', {
        name: user?.name || companyName,
        phone: phone.trim() || undefined,
        preferences: { desired_roles: [], preferred_locations: [], remote_preference: 'any', job_types: [], industries: [] },
        company_name: companyName.trim(),
        company_size: size,
        total_vacancies: vacancies ? Number(vacancies) : undefined,
        company_pan: pan ? pan.toUpperCase() : undefined,
        company_reg_no: cin.trim() || undefined,
        gstin: gstin.trim() || undefined,
      });
      setUser(data);
      toast('Company profile created.');
      navigate('/provider', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Could not save your company details.'));
    } finally { setBusy(false); }
  };

  return (
    <div className="pa-auth-wrap">
      <div className="pa-auth-card" style={{ maxWidth: 520 }}>
        <div className="pa-between" style={{ marginBottom: 18 }}>
          <div className="pa-auth-title" style={{ textAlign: 'left' }}>
            {step === 1 ? 'Company basics' : 'Verification'}
          </div>
          <span className="pa-badge pa-badge-neutral">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <>
            <Field label="Company name">
              <input className="pa-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Field>
            <Field label="Contact phone (optional)">
              <input className="pa-input" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Company size">
              <div className="pa-chip-row">
                {SIZES.map((s) => (
                  <button key={s} type="button" className={`pa-chip${size === s ? ' active' : ''}`}
                    onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </Field>
            <Field label="Open vacancies">
              <input className="pa-input" inputMode="numeric" value={vacancies}
                onChange={(e) => setVacancies(e.target.value.replace(/\D/g, ''))} />
            </Field>
            <Button block disabled={!companyName.trim()} onClick={() => setStep(2)}>Continue</Button>
          </>
        ) : (
          <>
            <Field label="Company PAN" hint="Format: AAAAA9999A — reviewed by our team for a verified badge">
              <input className="pa-input" value={pan} maxLength={10}
                onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="AAAAA9999A" />
            </Field>
            <Field label="Registration No. / CIN (optional)">
              <input className="pa-input" value={cin} onChange={(e) => setCin(e.target.value)} />
            </Field>
            <Field label="GSTIN (optional)" error={error}>
              <input className="pa-input" value={gstin} maxLength={15}
                onChange={(e) => setGstin(e.target.value.toUpperCase())} />
            </Field>
            <div className="pa-row">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button block loading={busy} onClick={submit}>Complete setup</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
