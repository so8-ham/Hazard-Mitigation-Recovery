import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, Bell, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getMyProposals, getMyTransactions, getMyNotifications } from '../../api/axios';

export default function LocalAdminDashboard() {
  const [stats, setStats] = useState({ proposals: 0, transactions: 0, notifications: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [proposalsRes, txRes, notifRes] = await Promise.allSettled([
          getMyProposals(), getMyTransactions(), getMyNotifications()
        ]);

        const proposals = proposalsRes.status === 'fulfilled' ? proposalsRes.value.data : [];
        const txs = txRes.status === 'fulfilled' ? txRes.value.data.count : 0;
        const notifs = notifRes.status === 'fulfilled'
          ? notifRes.value.data.notifications?.filter(n => !n.isRead).length : 0;

        const pending = proposals.filter(p => p.status === 'PENDING').length;
        const approved = proposals.filter(p => p.status === 'APPROVED').length;
        const rejected = proposals.filter(p => p.status === 'REJECTED').length;

        setStats({ proposals: proposals.length, transactions: txs, notifications: notifs, pending, approved, rejected });
        setRecentProposals(proposals.slice(0, 4));
      } catch {/* silent */}
      finally { setLoading(false); }
    };
    init();
  }, []);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Local Admin Dashboard</h1>
          <p>Track your proposals, payments, and notifications</p>
        </div>
        <Link to="/local/new-proposal" className="btn btn-primary">
          <Plus size={16} /> New Proposal
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple"><Clock size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.pending}</div>
          <div className="stat-label">Pending Proposals</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><XCircle size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan"><CreditCard size={22} /></div>
          <div className="stat-value">{loading ? '–' : stats.transactions}</div>
          <div className="stat-label">Payments Received</div>
        </div>
      </div>

      <div className="grid-2">
        {/* My Recent Proposals */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My Proposals</div>
              <div className="card-subtitle">Latest submissions</div>
            </div>
            <Link to="/local/proposals" className="btn btn-secondary btn-sm">View all</Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : recentProposals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No proposals yet</h3>
              <p><Link to="/local/new-proposal" className="text-link">Create your first proposal</Link></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentProposals.map(p => (
                <div key={p._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ₹{p.rewardAmount?.toLocaleString()} · {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Quick Actions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/local/new-proposal', icon: Plus, label: 'Submit New Proposal', desc: 'Report hazard mitigation data', color: 'purple' },
              { to: '/local/proposals', icon: FileText, label: 'My Proposals', desc: 'Track all your submissions', color: 'cyan' },
              { to: '/local/transactions', icon: CreditCard, label: 'Payment History', desc: 'View received rewards', color: 'green' },
              { to: '/local/notifications', icon: Bell, label: 'Notifications', desc: `${stats.notifications} unread`, color: 'amber' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 14px', background: 'var(--bg-glass)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div className={`stat-icon ${item.color}`} style={{ width: 36, height: 36, margin: 0, borderRadius: '10px' }}>
                    <item.icon size={16} />
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
