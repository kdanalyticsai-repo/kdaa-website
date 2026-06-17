import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiError } from '@/app/lib/api';
import { useAuthStore } from '@/app/stores/authStore';
import { Button, Field, useToast } from '@/app/components/ui';

export default function VerifyPhone() {
  const navigate = useNavigate();
  const toast = useToast();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const [phase, setPhase] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const sendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const full = phone.startsWith('+') ? phone.trim() : `+91${phone.trim()}`;
      await api.post('/auth/send-phone-otp', { phone: full });
      setPhone(full);
      setPhase('otp');
      toast('Verification code sent.');
    } catch (err) {
      setError(apiError(err));
    } finally { setBusy(false); }
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/verify-phone-otp', { otp: otp.trim() });
      setUser(data);
      toast('Phone verified.');
      navigate(-1);
    } catch (err) {
      setError(apiError(err, 'Invalid or expired code.'));
    } finally { setBusy(false); }
  };

  return (
    <div className="pa-auth-wrap">
      {phase === 'phone' ? (
        <form className="pa-auth-card" onSubmit={sendOtp}>
          <div className="pa-auth-title">Verify your phone</div>
          <div className="pa-auth-sub">We'll text you a 6-digit code</div>
          <Field label="Mobile number" error={error}>
            <input className="pa-input" inputMode="tel" placeholder="+91 9876543210" value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Button type="submit" block loading={busy}>Send code</Button>
          <div className="pa-auth-foot">
            <a onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Skip for now</a>
          </div>
        </form>
      ) : (
        <form className="pa-auth-card" onSubmit={verify}>
          <div className="pa-auth-title">Enter the code</div>
          <div className="pa-auth-sub">Sent to {phone}</div>
          <Field label="6-digit code" error={error}>
            <input className="pa-input" inputMode="numeric" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
          </Field>
          <Button type="submit" block loading={busy}>Verify</Button>
          <div className="pa-auth-foot">
            <a onClick={() => setPhase('phone')} style={{ cursor: 'pointer' }}>Change number</a>
          </div>
        </form>
      )}
    </div>
  );
}
