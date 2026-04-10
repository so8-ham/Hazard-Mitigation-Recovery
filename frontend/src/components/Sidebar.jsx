import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, FileText, Vote, Bell,
  CreditCard, LogOut, User, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const mainAdminNav = [
  { section: 'Overview' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Management' },
  { to: '/dashboard/local-admins', icon: Users, label: 'Local Admins' },
  { to: '/dashboard/proposals', icon: FileText, label: 'All Proposals' },
  { to: '/dashboard/transactions', icon: CreditCard, label: 'Transactions' },
  { section: 'Communication' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications', badge: true },
];

const localAdminNav = [
  { section: 'Overview' },
  { to: '/local/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'My Work' },
  { to: '/local/proposals', icon: FileText, label: 'My Proposals' },
  { to: '/local/new-proposal', icon: Vote, label: 'New Proposal' },
  { to: '/local/transactions', icon: CreditCard, label: 'My Payments' },
  { section: 'Account' },
  { to: '/local/profile', icon: User, label: 'My Profile' },
  { to: '/local/notifications', icon: Bell, label: 'Notifications', badge: true },
];

export default function Sidebar({ notificationCount = 0 }) {
  const { user, role, logout, isMainAdmin } = useAuth();
  const navigate = useNavigate();
  const navItems = isMainAdmin ? mainAdminNav : localAdminNav;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🛡️</div>
          <div>
            <div className="sidebar-logo-text">HazardShield</div>
            <div className="sidebar-logo-sub">Mitigation & Recovery</div>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div>
          <div className="sidebar-user-name">{user?.name || user?.email || 'Admin'}</div>
          <div className="sidebar-user-role">
            {isMainAdmin ? '🏛 Main Admin' : '📍 Local Admin'}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) return (
            <div key={i} className="sidebar-section-label">{item.section}</div>
          );
          const Icon = item.icon;
          const hasCount = item.badge && notificationCount > 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/local/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              {item.label}
              {hasCount && <span className="nav-badge">{notificationCount}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item btn-danger" style={{ width: '100%', border: 'none', background: 'transparent' }} onClick={handleLogout}>
          <LogOut size={18} className="nav-icon" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
