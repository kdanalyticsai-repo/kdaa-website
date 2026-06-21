import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { apiError } from '@/app/lib/api';
import { Button, Field, PasswordInput } from '@/app/components/ui';
import { AuthShell } from '@/app/components/AuthShell';

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get('role') || undefined; // job_seeker | job_provider
  const isProvider = role === 'job_provider';
  const roleLabel = isProvider ? 'Employer' : 'Job Seeker';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [switchTo, setSwitchTo] = useState<{ to: string; label: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setSwitchTo(null);
    setBusy(true);
    try {
      await login(email.trim(), password, role);
      navigate('/', { replace: true });
    } catch (err: any) {
      if (err?.isRoleMismatch) {
        const actualProvider = err.actualRole === 'job_provider';
        setError(`This email is registered as a ${actualProvider ? 'Job Provider' : 'Job Seeker'}.`);
        setSwitchTo({
          to: `/login?role=${actualProvider ? 'job_provider' : 'job_seeker'}`,
          label: `Sign in as ${actualProvider ? 'Job Provider' : 'Job Seeker'}`,
        });
      } else {
        setError(apiError(err, 'Invalid email or password.'));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell role={role}>
      <form onSubmit={onSubmit}>
        <div className="pa-auth-title" style={{ textAlign: 'left' }}>Welcome back</div>
        <div className="pa-auth-sub" style={{ textAlign: 'left', margin: '6px 0 22px' }}>
          Sign in to your <strong>{roleLabel}</strong> account · <Link to="/role-select">change</Link>
        </div>

        <Field label="Email">
          <input className="pa-input" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" error={error}>
          <PasswordInput autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {switchTo && (
          <div style={{ marginTop: -8, marginBottom: 12 }}>
            <Link to={switchTo.to} style={{ fontSize: 13, fontWeight: 700 }}>{switchTo.label} →</Link>
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: -2, marginBottom: 14 }}>
          <Link to="/forgot-password" style={{ fontSize: 13 }}>Forgot password?</Link>
        </div>

        <Button type="submit" block loading={busy}>Sign in</Button>

        <div className="pa-auth-foot">
          New here?{' '}
          <Link to={`/register?role=${isProvider ? 'job_provider' : 'job_seeker'}`}>Create an account</Link>
        </div>
      </form>
    </AuthShell>
  );
}
