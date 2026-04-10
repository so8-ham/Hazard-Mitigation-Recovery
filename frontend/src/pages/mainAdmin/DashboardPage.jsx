import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CreditCard, Bell, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getLocalAdmins, getAllProposals, getAllTransactions, getMyNotifications } from '../../api/axios';

export default function MainAdminDashboard() {
  const [stats, setStats] = useState({ admins: 0, proposals: 0, transactions: 0, notifications: 0 });
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [adminsRes, proposalsRes, txRes, notifRes] = await Promise.allSettled([
          getLocalAdmins(),
          getAllProposals(),
          getAllTransactions(),
          getMyNotifications(),
        ]);

        const admins = adminsRes.status === 'fulfilled' ? adminsRes.value.data.count : 0;
        const allProposals = proposalsRes.status === 'fulfilled' ? proposalsRes.value.data : [];
        const txs = txRes.status === 'fulfilled' ? txRes.value.data.count : 0;
        const notifs = notifRes.status === 'fulfilled'
          ? notifRes.value.data.notifications?.filter(n => !n.isRead).length : 0;

        setStats({ admins, proposals: allProposals.length, transactions: txs, notifications: notifs });
        setProposals(allProposals.slice(0, 5));
      } catch {/* silent */}
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const statusCounts = proposals.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Main Admin Dashboard</h1>
          <p>Monitor system activity and manage all operations</p>
        </div>
        <Link to="/dashboard/local-admins" className="btn btn-primary">
          <Users size={16} /> Manage Admins
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple"><Users size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.admins}</div>
          <div className="stat-label">Local Admins</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan"><FileText size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.proposals}</div>
          <div className="stat-label">Total Proposals</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><CreditCard size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.transactions}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber"><Bell size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.notifications}</div>
          <div className="stat-label">Unread Alerts</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Proposals */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Proposals</div>
              <div className="card-subtitle">Latest submissions requiring review</div>
            </div>
            <Link to="/dashboard/proposals" className="btn btn-secondary btn-sm">View all</Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : proposals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No proposals yet</h3>
              <p>Proposals from local admins will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proposals.map(p => (
                <Link key={p._id} to={`/dashboard/proposals`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ₹{p.rewardAmount?.toLocaleString()} · {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Quick Actions</div>
              <div className="card-subtitle">Common management tasks</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/dashboard/local-admins', icon: Users, label: 'Create Local Admin', desc: 'Add a new local administrator', color: 'purple' },
              { to: '/dashboard/proposals', icon: FileText, label: 'Review Proposals', desc: 'Vote on pending proposals', color: 'cyan' },
              { to: '/dashboard/transactions', icon: CreditCard, label: 'View Transactions', desc: 'Track all payment history', color: 'green' },
              { to: '/dashboard/notifications', icon: Bell, label: 'Notifications', desc: 'Check system alerts', color: 'amber' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px', background: 'var(--bg-glass)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)', cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div className={`stat-icon ${item.color}`} style={{ width: 40, height: 40, margin: 0 }}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
