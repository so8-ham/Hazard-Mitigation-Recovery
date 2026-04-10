import { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Save, Trash2, AlertTriangle } from 'lucide-react';
import { getLocalAdminProfile, updateLocalAdminProfile, deleteLocalAdminAccount } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getLocalAdminProfile()
      .then(res => {
        setProfile(res.data.data || res.data);
        setForm(res.data.data || res.data);
      })
      .catch(() => toast.error('Failed to load profile'));
  }, []);

  const upd = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { name, phone } = form;
      const res = await updateLocalAdminProfile({ name, phone });
      setProfile(res.data.data || res.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLocalAdminAccount();
      toast.success('Account deleted');
      logout();
      navigate('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    finally { setDeleting(false); }
  };

  if (!profile) return <div className="loading-center"><div className="loading-spinner" /></div>;

  const initials = profile.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={{ animation: 'slideUp 0.4s ease', maxWidth: '640px' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{profile.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{profile.email}</div>
          <span className="badge badge-local" style={{ marginTop: '8px', display: 'inline-flex' }}>📍 Local Admin</span>
        </div>
        {!editing && (
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEditing(true)}>
            ✏️ Edit
          </button>
        )}
      </div>

      {/* Profile Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{editing ? 'Edit Information' : 'Account Information'}</div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-icon">
                <User size={14} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  value={editing ? form.name : profile.name}
                  onChange={upd('name')}
                  readOnly={!editing}
                  style={{ opacity: editing ? 1 : 0.8 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-icon">
                <Mail size={14} className="input-icon" />
                <input type="email" className="form-input" value={profile.email} readOnly style={{ opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input-icon">
                <Phone size={14} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  value={editing ? (form.phone || '') : (profile.phone || '–')}
                  onChange={upd('phone')}
                  readOnly={!editing}
                  style={{ opacity: editing ? 1 : 0.8 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar Number</label>
              <div className="form-input-icon">
                <CreditCard size={14} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  value={profile.aadhaarNumber ? `•••• •••• ${profile.aadhaarNumber.slice(-4)}` : '–'}
                  readOnly
                  style={{ opacity: 0.6, fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Created</label>
            <input type="text" className="form-input" value={new Date(profile.createdAt).toLocaleString()} readOnly style={{ opacity: 0.6 }} />
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile); }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', marginTop: '20px' }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: 'var(--danger)' }}>⚠️ Danger Zone</div>
            <div className="card-subtitle">Irreversible actions — proceed with caution</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Delete Account</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Permanently delete your account and all data</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDelete && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowDelete(false)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Delete Your Account?</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This will permanently delete your account. All your proposals and data will be lost. This action cannot be undone.
              </div>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
