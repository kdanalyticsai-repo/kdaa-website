import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { apiError } from '@/app/lib/api';
import { Button, Field, PasswordInput } from '@/app/components/ui';

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
    <div className="pa-auth-wrap">
      <form className="pa-auth-card" onSubmit={onSubmit}>
        <div className="pa-auth-title">Welcome back</div>
        <div className="pa-auth-sub">Sign in to your ProAICV account</div>

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
    </div>
  );
}
