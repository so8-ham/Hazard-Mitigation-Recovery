import { useState, useEffect } from 'react';
import { getMyTransactions } from '../../api/axios';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTransactions()
      .then(res => setTransactions(res.data.transactions || []))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false));
  }, []);

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Payments</h1>
          <p>Your reward payment history</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card green">
          <div className="stat-icon green"><CreditCard size={22} /></div>
          <div className="stat-value">{loading ? '–' : transactions.length}</div>
          <div className="stat-label">Total Payments</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple" style={{ fontSize: '1rem', fontWeight: 800 }}>₹</div>
          <div className="stat-value">{loading ? '–' : `₹${total.toLocaleString()}`}</div>
          <div className="stat-label">Total Earned</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4}><div className="loading-center"><div className="loading-spinner" /></div></td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={4}>
                <div className="empty-state">
                  <div className="empty-state-icon">💳</div>
                  <h3>No payments yet</h3>
                  <p>Payments from approved proposals will appear here</p>
                </div>
              </td></tr>
            ) : transactions.map(t => (
              <tr key={t._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.proposal?.title || 'N/A'}</div>
                  {t.proposal?.status && (
                    <span className={`badge badge-${t.proposal.status?.toLowerCase()}`} style={{ marginTop: '4px' }}>
                      {t.proposal.status}
                    </span>
                  )}
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success)' }}>
                    ₹{t.amount?.toLocaleString()}
                  </span>
                </td>
                <td><span className="badge badge-success">{t.status}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {t.processedAt ? new Date(t.processedAt).toLocaleDateString() : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
