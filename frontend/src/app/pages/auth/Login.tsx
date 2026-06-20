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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(apiError(err, 'Invalid email or password.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={onSubmit}>
        <div className="pa-auth-title" style={{ textAlign: 'left' }}>Welcome back</div>
        <div className="pa-auth-sub" style={{ textAlign: 'left', margin: '6px 0 22px' }}>Sign in to your ProAICV account</div>

        <Field label="Email">
          <input className="pa-input" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" error={error}>
          <PasswordInput autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </Field>

        <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 14 }}>
          <Link to="/forgot-password" style={{ fontSize: 13 }}>Forgot password?</Link>
        </div>

        <Button type="submit" block loading={busy}>Sign in</Button>

        <div className="pa-auth-foot">
          New here?{' '}
          <Link to={`/register${params.get('role') ? `?role=${params.get('role')}` : ''}`}>Create an account</Link>
        </div>
      </form>
    </AuthShell>
  );
}
