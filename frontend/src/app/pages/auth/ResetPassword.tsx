import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { Button, Field, useToast } from '@/app/components/ui';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(params.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim(), otp: otp.trim(), new_password: newPassword,
      });
      toast('Password updated. Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Invalid or expired code.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pa-auth-wrap">
      <form className="pa-auth-card" onSubmit={onSubmit}>
        <div className="pa-auth-title">Enter reset code</div>
        <div className="pa-auth-sub">Check your email for the 6-digit code</div>
        <Field label="Email">
          <input className="pa-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="6-digit code">
          <input className="pa-input" inputMode="numeric" maxLength={6} value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
        </Field>
        <Field label="New password" hint="At least 8 characters" error={error}>
          <input className="pa-input" type="password" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} required />
        </Field>
        <Button type="submit" block loading={busy}>Update password</Button>
        <div className="pa-auth-foot"><Link to="/login">Back to sign in</Link></div>
      </form>
    </div>
  );
}
