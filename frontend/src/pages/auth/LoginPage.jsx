import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin, registerMainAdmin } from '../../api/axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'MAIN_ADMIN' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', aadhaarNumber: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(loginForm);
      const { token, role } = res.data;
      login(token, role, { email: loginForm.email, role });
      toast.success('Login successful! Welcome back.');
      navigate(role === 'MAIN_ADMIN' ? '/dashboard' : '/local/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerMainAdmin(registerForm);
      toast.success('Main Admin registered! Please login.');
      setTab('login');
      setLoginForm(prev => ({ ...prev, email: registerForm.email }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-bg-glow" />
      <div className="auth-bg-dots" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🛡️</div>
          <div>
            <div className="auth-logo-text">HazardShield</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mitigation & Recovery</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: '28px', width: '100%', justifyContent: 'center' }}>
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setTab('login')}>
            Login
          </button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setTab('register')}>
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <>
            <div className="auth-title">Welcome back</div>
            <div className="auth-subtitle">Sign in to your admin portal</div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={loginForm.role}
                  onChange={e => setLoginForm(p => ({ ...p, role: e.target.value }))}
                >
                  <option value="MAIN_ADMIN">Main Admin</option>
                  <option value="LOCAL_ADMIN">Local Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="admin@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Password</span>
                  <Link to="/forgot-password" className="text-link" style={{ fontSize: '0.8rem' }}>Forgot?</Link>
                </label>
                <div className="form-input-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-password"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button id="login-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                <Shield size={16} />
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-title">Create account</div>
            <div className="auth-subtitle">Register as Main Admin</div>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="admin@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="reg-password"
                    type="password"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>
                <div className="form-input-icon">
                  <CreditCard size={16} className="input-icon" />
                  <input
                    id="reg-aadhaar"
                    type="text"
                    className="form-input"
                    placeholder="12-digit Aadhaar"
                    maxLength={12}
                    value={registerForm.aadhaarNumber}
                    onChange={e => setRegisterForm(p => ({ ...p, aadhaarNumber: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button id="register-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
