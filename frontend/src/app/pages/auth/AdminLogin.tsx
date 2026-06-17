import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/stores/authStore';
import { apiError } from '@/app/lib/api';
import { Button, Field } from '@/app/components/ui';

export default function AdminLogin() {
  const adminLogin = useAuthStore((s) => s.adminLogin);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await adminLogin(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Invalid admin credentials.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pa-auth-wrap">
      <form className="pa-auth-card" onSubmit={onSubmit}>
        <div className="pa-auth-title">Admin sign in</div>
        <div className="pa-auth-sub">Restricted access</div>
        <Field label="Admin email">
          <input className="pa-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" error={error}>
          <input className="pa-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit" block loading={busy}>Sign in</Button>
        <div className="pa-auth-foot"><Link to="/login">Back to user sign in</Link></div>
      </form>
    </div>
  );
}
