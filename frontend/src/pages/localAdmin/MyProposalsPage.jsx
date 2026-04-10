import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, X } from 'lucide-react';
import { getMyProposals } from '../../api/axios';
import toast from 'react-hot-toast';

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    getMyProposals()
      .then(res => setProposals(res.data || []))
      .catch(() => toast.error('Failed to load proposals'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? proposals : proposals.filter(p => p.status === filter);
  const counts = proposals.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Proposals</h1>
          <p>Track the status of all your submitted proposals</p>
        </div>
        <Link to="/local/new-proposal" className="btn btn-primary">
          <Plus size={16} /> New Proposal
        </Link>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total', val: proposals.length, color: 'purple' },
          { label: 'Pending', val: counts.PENDING || 0, color: 'amber' },
          { label: 'Approved', val: counts.APPROVED || 0, color: 'green' },
          { label: 'Rejected', val: counts.REJECTED || 0, color: 'red' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '18px 20px' }}>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{loading ? '–' : s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="loading-spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No {filter !== 'ALL' ? filter.toLowerCase() : ''} proposals</h3>
          <p><Link to="/local/new-proposal" className="text-link">Submit your first proposal</Link></p>
        </div>
      ) : (
        <div className="proposal-list">
          {filtered.map(p => {
            const total = (p.votesYes || 0) + (p.votesNo || 0);
            const yesPercent = total > 0 ? ((p.votesYes || 0) / total) * 100 : 0;
            return (
              <div key={p._id} className="proposal-card">
                <div className="proposal-card-header">
                  <div>
                    <div className="proposal-card-title">{p.title}</div>
                    <div className="proposal-card-meta">
                      <span>💰 ₹{p.rewardAmount?.toLocaleString()}</span>
                      <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.approvedAt && <span>✅ Approved: {new Date(p.approvedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span>
                </div>

                <div className="proposal-card-desc">{p.description}</div>

                {total > 0 && (
                  <div className="vote-progress">
                    <div className="vote-bar-row">
                      <span>✅ Yes: {p.votesYes || 0} / 3 needed</span>
                      <span>❌ No: {p.votesNo || 0}</span>
                    </div>
                    <div className="vote-bar">
                      <div className="vote-bar-yes" style={{ width: `${yesPercent}%` }} />
                      <div className="vote-bar-no" style={{ width: `${100 - yesPercent}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setDetail(p)}>
                    <Eye size={14} /> View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{detail.title}</div>
              <button className="modal-close" onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span className={`badge badge-${detail.status?.toLowerCase()}`}>{detail.status}</span>
              <span className="badge badge-info">₹{detail.rewardAmount?.toLocaleString()}</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>DESCRIPTION</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{detail.description}</div>
            </div>
            {detail.data && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>SUPPORTING DATA</div>
                <div style={{ fontSize: '0.875rem', background: 'var(--bg-glass)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {detail.data}
                </div>
              </div>
            )}
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>VOTE PROGRESS</div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{detail.votesYes || 0}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>YES</span>
                </div>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{detail.votesNo || 0}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>NO</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
                  (Need 3 YES to approve)
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
