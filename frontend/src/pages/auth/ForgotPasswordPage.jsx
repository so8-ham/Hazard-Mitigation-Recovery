import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { forgotPassword, verifyOTP, resetPassword } from '../../api/axios';
import toast from 'react-hot-toast';

const STEPS = ['email', 'otp', 'reset'];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', role: 'MAIN_ADMIN', otp: '', newPassword: '', confirm: '' });

  const upd = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email: form.email, role: form.role });
      toast.success('OTP sent to your email!');
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const checkOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP({ email: form.email, role: form.role, otp: form.otp });
      toast.success('OTP verified!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const doReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await resetPassword({ email: form.email, role: form.role, newPassword: form.newPassword });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-bg-glow" />
      <div className="auth-bg-dots" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔐</div>
          <div className="auth-logo-text">Password Recovery</div>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {['Email', 'Verify OTP', 'New Password'].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: '3px',
                borderRadius: '2px',
                background: i <= step ? 'var(--grad-primary)' : 'var(--border)',
                marginBottom: '6px',
                transition: 'all 0.3s ease'
              }} />
              <span style={{ fontSize: '0.65rem', color: i <= step ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: 600 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="auth-title">Forgot Password?</div>
            <div className="auth-subtitle">Enter your email to receive an OTP</div>
            <form onSubmit={sendOTP}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={upd('role')}>
                  <option value="MAIN_ADMIN">Main Admin</option>
                  <option value="LOCAL_ADMIN">Local Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-icon">
                  <Mail size={16} className="input-icon" />
                  <input id="fp-email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={upd('email')} required />
                </div>
              </div>
              <button id="fp-send-otp" type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === 1 && (
          <>
            <div className="auth-title">Check Your Email</div>
            <div className="auth-subtitle">We sent a 4-digit OTP to {form.email}</div>
            <form onSubmit={checkOTP}>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <div className="form-input-icon">
                  <KeyRound size={16} className="input-icon" />
                  <input id="fp-otp" type="text" className="form-input" placeholder="4-digit code" maxLength={4} value={form.otp} onChange={upd('otp')} required />
                </div>
              </div>
              <button id="fp-verify-otp" type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
              <button type="button" className="btn btn-secondary btn-full" style={{ marginTop: '10px' }} onClick={() => setStep(0)}>
                <ArrowLeft size={15} /> Resend OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-title">Set New Password</div>
            <div className="auth-subtitle">Create a strong new password</div>
            <form onSubmit={doReset}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-icon">
                  <Lock size={16} className="input-icon" />
                  <input id="fp-newpass" type="password" className="form-input" placeholder="Min. 6 characters" value={form.newPassword} onChange={upd('newPassword')} required minLength={6} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="form-input-icon">
                  <Lock size={16} className="input-icon" />
                  <input id="fp-confirm" type="password" className="form-input" placeholder="Repeat password" value={form.confirm} onChange={upd('confirm')} required />
                </div>
              </div>
              <button id="fp-reset-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem' }}>
          <Link to="/login" className="text-link">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
