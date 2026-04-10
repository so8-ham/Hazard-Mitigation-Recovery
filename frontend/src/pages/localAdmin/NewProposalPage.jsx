import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, AlignLeft, Database } from 'lucide-react';
import { createProposal } from '../../api/axios';
import toast from 'react-hot-toast';

export default function NewProposalPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    data: '',
    rewardAmount: ''
  });

  const upd = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rewardAmount || isNaN(Number(form.rewardAmount))) {
      toast.error('Enter a valid reward amount');
      return;
    }
    setLoading(true);
    try {
      await createProposal({ ...form, rewardAmount: Number(form.rewardAmount) });
      toast.success('Proposal submitted! Main admins will be notified.');
      navigate('/local/proposals');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease', maxWidth: '680px' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>New Proposal</h1>
          <p>Submit a hazard mitigation proposal for Main Admin review</p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '28px',
        display: 'flex', gap: '12px', alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>How proposals work</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            After submission, all Main Admins will be notified and will vote on your proposal.
            If 3 or more Main Admins vote YES, your proposal will be approved and payment triggered automatically.
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Proposal Title</label>
            <div className="form-input-icon">
              <FileText size={15} className="input-icon" />
              <input
                id="proposal-title"
                type="text"
                className="form-input"
                placeholder="e.g. Flood Mitigation in Sector 4"
                value={form.title}
                onChange={upd('title')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <div className="form-input-icon" style={{ position: 'relative' }}>
              <AlignLeft size={15} style={{ position: 'absolute', top: '13px', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <textarea
                id="proposal-description"
                className="form-textarea"
                placeholder="Describe the hazard, impact area, proposed mitigation steps, and expected outcomes…"
                value={form.description}
                onChange={upd('description')}
                style={{ paddingLeft: '44px', minHeight: '120px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Supporting Data / Evidence <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <div className="form-input-icon" style={{ position: 'relative' }}>
              <Database size={15} style={{ position: 'absolute', top: '13px', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <textarea
                id="proposal-data"
                className="form-textarea"
                placeholder="Sensor readings, field observations, or any supporting data…"
                value={form.data}
                onChange={upd('data')}
                style={{ paddingLeft: '44px', minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Requested Reward Amount (₹)</label>
            <div className="form-input-icon">
              <DollarSign size={15} className="input-icon" />
              <input
                id="proposal-amount"
                type="number"
                className="form-input"
                placeholder="e.g. 50000"
                min="1"
                value={form.rewardAmount}
                onChange={upd('rewardAmount')}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/local/proposals')}>
              Cancel
            </button>
            <button id="submit-proposal-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting…' : '📤 Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
