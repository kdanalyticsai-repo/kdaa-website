import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, Field, useToast } from '@/app/components/ui';

const INDUSTRIES = ['IT / Software', 'Finance', 'Healthcare', 'Marketing', 'Education', 'Manufacturing', 'Power / Energy', 'Media', 'Other'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const REMOTE = [
  { id: 'any', label: 'Any' },
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'onsite', label: 'On-site' },
];
const EXPERIENCE = [
  { id: 'entry', label: 'Entry' },
  { id: 'mid', label: 'Mid' },
  { id: 'senior', label: 'Senior' },
  { id: 'lead', label: 'Lead' },
  { id: 'executive', label: 'Executive' },
];

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function SeekerOnboarding() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [experience, setExperience] = useState<string>('mid');

  const [roles, setRoles] = useState('');
  const [locations, setLocations] = useState('');
  const [remote, setRemote] = useState('any');
  const [minSalary, setMinSalary] = useState('');
  const [jobTypes, setJobTypes] = useState<string[]>(['Full-time']);
  const [industries, setIndustries] = useState<string[]>([]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setBusy(true); setError('');
    try {
      const { data } = await api.post('/users/me/onboarding', {
        name: name.trim(),
        phone: phone.trim() || undefined,
        preferences: {
          desired_roles: roles.split(',').map((s) => s.trim()).filter(Boolean),
          preferred_locations: locations.split(',').map((s) => s.trim()).filter(Boolean),
          remote_preference: remote,
          min_salary: minSalary ? Number(minSalary) : undefined,
          job_types: jobTypes,
          industries,
          experience_level: experience,
        },
      });
      setUser(data);
      toast('Profile ready!');
      navigate('/', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Could not save your profile.'));
    } finally { setBusy(false); }
  };

  return (
    <div className="pa-auth-wrap">
      <div className="pa-auth-card" style={{ maxWidth: 520 }}>
        <div className="pa-between" style={{ marginBottom: 18 }}>
          <div className="pa-auth-title" style={{ textAlign: 'left' }}>
            {step === 1 ? 'About you' : 'What are you looking for?'}
          </div>
          <span className="pa-badge pa-badge-neutral">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <>
            <Field label="Full name">
              <input className="pa-input" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Phone (optional)">
              <input className="pa-input" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Experience level">
              <div className="pa-chip-row">
                {EXPERIENCE.map((e) => (
                  <button key={e.id} type="button"
                    className={`pa-chip${experience === e.id ? ' active' : ''}`}
                    onClick={() => setExperience(e.id)}>{e.label}</button>
                ))}
              </div>
            </Field>
            <Button block disabled={!name.trim()} onClick={() => setStep(2)}>Continue</Button>
          </>
        ) : (
          <>
            <Field label="Desired roles" hint="Comma-separated, e.g. Frontend Developer, Data Analyst">
              <input className="pa-input" value={roles} onChange={(e) => setRoles(e.target.value)} />
            </Field>
            <Field label="Preferred locations" hint="Comma-separated, e.g. Bengaluru, Remote">
              <input className="pa-input" value={locations} onChange={(e) => setLocations(e.target.value)} />
            </Field>
            <Field label="Work style">
              <div className="pa-chip-row">
                {REMOTE.map((r) => (
                  <button key={r.id} type="button"
                    className={`pa-chip${remote === r.id ? ' active' : ''}`}
                    onClick={() => setRemote(r.id)}>{r.label}</button>
                ))}
              </div>
            </Field>
            <Field label="Job types">
              <div className="pa-chip-row">
                {JOB_TYPES.map((t) => (
                  <button key={t} type="button"
                    className={`pa-chip${jobTypes.includes(t) ? ' active' : ''}`}
                    onClick={() => setJobTypes((p) => toggle(p, t))}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label="Industries">
              <div className="pa-chip-row">
                {INDUSTRIES.map((i) => (
                  <button key={i} type="button"
                    className={`pa-chip${industries.includes(i) ? ' active' : ''}`}
                    onClick={() => setIndustries((p) => toggle(p, i))}>{i}</button>
                ))}
              </div>
            </Field>
            <Field label="Minimum salary (₹/year, optional)" error={error}>
              <input className="pa-input" inputMode="numeric" value={minSalary}
                onChange={(e) => setMinSalary(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 800000" />
            </Field>
            <div className="pa-row">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button block loading={busy} onClick={submit}>Finish</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
