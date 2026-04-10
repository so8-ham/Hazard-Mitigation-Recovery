import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Main Admin Pages
import MainAdminDashboard from './pages/mainAdmin/DashboardPage';
import LocalAdminsPage from './pages/mainAdmin/LocalAdminsPage';
import AllProposalsPage from './pages/mainAdmin/AllProposalsPage';
import TransactionsPage from './pages/mainAdmin/TransactionsPage';

// Local Admin Pages
import LocalAdminDashboard from './pages/localAdmin/DashboardPage';
import MyProposalsPage from './pages/localAdmin/MyProposalsPage';
import NewProposalPage from './pages/localAdmin/NewProposalPage';
import MyTransactionsPage from './pages/localAdmin/MyTransactionsPage';
import ProfilePage from './pages/localAdmin/ProfilePage';

// Shared
import NotificationsPage from './pages/shared/NotificationsPage';

// ─── Route Guards ──────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RequireMainAdmin({ children }) {
  const { isAuthenticated, isMainAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isMainAdmin) return <Navigate to="/local/dashboard" replace />;
  return children;
}

function RequireLocalAdmin({ children }) {
  const { isAuthenticated, isLocalAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isLocalAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { isAuthenticated, isMainAdmin } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a28',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={isMainAdmin ? '/dashboard' : '/local/dashboard'} replace />
            : <LoginPage />
        } />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Root Redirect */}
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={isMainAdmin ? '/dashboard' : '/local/dashboard'} replace />
            : <Navigate to="/login" replace />
        } />

        {/* MAIN ADMIN Routes */}
        <Route path="/dashboard" element={
          <RequireMainAdmin>
            <DashboardLayout />
          </RequireMainAdmin>
        }>
          <Route index element={<MainAdminDashboard />} />
          <Route path="local-admins" element={<LocalAdminsPage />} />
          <Route path="proposals" element={<AllProposalsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* LOCAL ADMIN Routes */}
        <Route path="/local" element={
          <RequireLocalAdmin>
            <DashboardLayout />
          </RequireLocalAdmin>
        }>
          <Route path="dashboard" element={<LocalAdminDashboard />} />
          <Route path="proposals" element={<MyProposalsPage />} />
          <Route path="new-proposal" element={<NewProposalPage />} />
          <Route path="transactions" element={<MyTransactionsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="auth-layout">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🌊</div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>404 — Lost at Sea</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>This page doesn't exist</p>
              <a href="/" className="btn btn-primary">Return Home</a>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}
