import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { apiError } from '@/app/lib/api';
import { Button, Field, PasswordInput } from '@/app/components/ui';
import { AuthShell } from '@/app/components/AuthShell';

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const setPendingRole = useAuthStore((s) => s.setPendingRole);
  const pendingRole = useAuthStore((s) => s.pendingRole);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const role = params.get('role');
    if (role === 'job_seeker' || role === 'job_provider') setPendingRole(role);
  }, [params, setPendingRole]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      await register(email.trim(), password, name.trim());
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(apiError(err, 'Could not create your account.'));
    } finally {
      setBusy(false);
    }
  };

  const roleLabel = pendingRole === 'job_provider' ? 'Employer' : 'Job Seeker';

  return (
    <AuthShell>
      <form onSubmit={onSubmit}>
        <div className="pa-auth-title" style={{ textAlign: 'left' }}>Create your account</div>
        <div className="pa-auth-sub" style={{ textAlign: 'left', margin: '6px 0 22px' }}>
          Signing up as <strong>{roleLabel}</strong> · <Link to="/role-select">change</Link>
        </div>

        <Field label="Full name">
          <input className="pa-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Email">
          <input className="pa-input" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" hint="At least 8 characters" error={error}>
          <PasswordInput autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </Field>

        <Button type="submit" block loading={busy}>Create account</Button>

        <div className="pa-auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </AuthShell>
  );
}
