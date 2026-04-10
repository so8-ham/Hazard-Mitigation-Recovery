import { useState, useEffect } from 'react';
import { getAllTransactions } from '../../api/axios';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTransactions()
      .then(res => setTransactions(res.data.transactions || []))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false));
  }, []);

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Transactions</h1>
          <p>Complete record of all approved payouts</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card green">
          <div className="stat-icon green"><CreditCard size={22} /></div>
          <div className="stat-value">{loading ? '–' : transactions.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">₹</div>
          <div className="stat-value">{loading ? '–' : `₹${total.toLocaleString()}`}</div>
          <div className="stat-label">Total Disbursed</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Receiver</th>
              <th>Approved By</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="loading-center"><div className="loading-spinner" /></div></td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon">💳</div>
                  <h3>No transactions yet</h3>
                  <p>Approved proposal payouts will appear here</p>
                </div>
              </td></tr>
            ) : transactions.map(t => (
              <tr key={t._id}>
                <td style={{ fontWeight: 600 }}>{t.proposal?.title || 'N/A'}</td>
                <td>
                  <div>{t.receiver?.name || '–'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.receiver?.email}</div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.approvedBy?.name || '–'}</td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{t.amount?.toLocaleString()}</span>
                </td>
                <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{t.status}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {t.processedAt ? new Date(t.processedAt).toLocaleString() : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
