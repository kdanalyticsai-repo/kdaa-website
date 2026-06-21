import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { Button, Field } from '@/app/components/ui';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pa-auth-wrap">
      <form className="pa-auth-card" onSubmit={onSubmit}>
        <div className="pa-auth-title">Reset your password</div>
        <div className="pa-auth-sub">We'll send a 6-digit reset code to your email and mobile (SMS)</div>
        <Field label="Email" error={error}>
          <input className="pa-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Button type="submit" block loading={busy}>Send reset code</Button>
        <div className="pa-auth-foot"><Link to="/login">Back to sign in</Link></div>
      </form>
    </div>
  );
}
