import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Eye, X, Filter } from 'lucide-react';
import { getAllProposals, castVote, getProposalVotes, createPayout } from '../../api/axios';
import toast from 'react-hot-toast';

export default function AllProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detailModal, setDetailModal] = useState(null);
  const [voteData, setVoteData] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const fetch = async () => {
    try {
      const res = await getAllProposals();
      setProposals(res.data || []);
    } catch { toast.error('Failed to load proposals'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openDetail = async (proposal) => {
    setDetailModal(proposal);
    try {
      const res = await getProposalVotes(proposal._id);
      setVoteData(res.data);
    } catch { setVoteData(null); }
  };

  const handleVote = async (proposalId, vote) => {
    setVotingId(proposalId);
    try {
      await castVote(proposalId, { vote });
      toast.success(`Vote "${vote}" submitted!`);
      fetch();
      if (detailModal?._id === proposalId) {
        const res = await getProposalVotes(proposalId);
        setVoteData(res.data);
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to vote'); }
    finally { setVotingId(null); }
  };

  const handlePayout = async (proposalId) => {
    setPayingId(proposalId);
    try {
      await createPayout(proposalId);
      toast.success('Payout triggered successfully!');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Payout failed'); }
    finally { setPayingId(null); }
  };

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
  const filtered = filter === 'ALL' ? proposals : proposals.filter(p => p.status === filter);

  const getStatusCounts = () => proposals.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const counts = getStatusCounts();

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>All Proposals</h1>
          <p>Review and vote on proposals from local administrators</p>
        </div>
      </div>

      {/* Mini stats */}
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

      {/* Filter tabs */}
      <div className="tabs">
        {statuses.map(s => (
          <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="loading-spinner" /><span>Loading proposals…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No {filter !== 'ALL' ? filter.toLowerCase() : ''} proposals</h3>
          <p>Proposals from local admins will appear here</p>
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
                      <span>👤 {p.createdBy?.name || 'Unknown'}</span>
                      <span>💰 ₹{p.rewardAmount?.toLocaleString()}</span>
                      <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span>
                </div>

                <div className="proposal-card-desc">{p.description}</div>

                {total > 0 && (
                  <div className="vote-progress">
                    <div className="vote-bar-row">
                      <span>✅ Yes: {p.votesYes || 0}</span>
                      <span>❌ No: {p.votesNo || 0}</span>
                    </div>
                    <div className="vote-bar">
                      <div className="vote-bar-yes" style={{ width: `${yesPercent}%` }} />
                      <div className="vote-bar-no" style={{ width: `${100 - yesPercent}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openDetail(p)}>
                    <Eye size={14} /> Details
                  </button>
                  {p.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={votingId === p._id}
                        onClick={() => handleVote(p._id, 'YES')}
                      >
                        <ThumbsUp size={14} /> Vote Yes
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={votingId === p._id}
                        onClick={() => handleVote(p._id, 'NO')}
                      >
                        <ThumbsDown size={14} /> Vote No
                      </button>
                    </>
                  )}
                  {p.status === 'APPROVED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={payingId === p._id}
                      onClick={() => handlePayout(p._id)}
                    >
                      💳 {payingId === p._id ? 'Processing…' : 'Trigger Payout'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{detailModal.title}</div>
              <button className="modal-close" onClick={() => setDetailModal(null)}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className={`badge badge-${detailModal.status?.toLowerCase()}`}>{detailModal.status}</span>
              <span className="badge badge-info">₹{detailModal.rewardAmount?.toLocaleString()}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DESCRIPTION</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{detailModal.description}</div>
            </div>

            {detailModal.data && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ADDITIONAL DATA</div>
                <div style={{ fontSize: '0.875rem', background: 'var(--bg-glass)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {detailModal.data}
                </div>
              </div>
            )}

            {voteData && (
              <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>VOTING RESULTS</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{voteData.yesVotes}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>YES</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{voteData.noVotes}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NO</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{voteData.totalVotes}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {detailModal.status === 'PENDING' && (
                <>
                  <button className="btn btn-success" disabled={votingId} onClick={() => { handleVote(detailModal._id, 'YES'); setDetailModal(null); }}>
                    <ThumbsUp size={15} /> Vote Yes
                  </button>
                  <button className="btn btn-danger" disabled={votingId} onClick={() => { handleVote(detailModal._id, 'NO'); setDetailModal(null); }}>
                    <ThumbsDown size={15} /> Vote No
                  </button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
