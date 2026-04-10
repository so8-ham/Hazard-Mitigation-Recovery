import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, User, Mail, Phone, CreditCard, X, Search } from 'lucide-react';
import { getLocalAdmins, createLocalAdmin, updateLocalAdmin, deleteLocalAdmin } from '../../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', password: '', aadhaarNumber: '', phone: '' };

export default function LocalAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await getLocalAdmins();
      setAdmins(res.data.data || []);
    } catch { toast.error('Failed to load admins'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const openCreate = () => { setForm(emptyForm); setSelected(null); setModal('create'); };
  const openEdit = (a)  => { setForm({ name: a.name, email: a.email, phone: a.phone, aadhaarNumber: a.aadhaarNumber, password: '' }); setSelected(a); setModal('edit'); };
  const openDelete = (a) => { setSelected(a); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createLocalAdmin(form);
      toast.success('Local Admin created!');
      closeModal();
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await updateLocalAdmin(selected._id, payload);
      toast.success('Admin updated!');
      closeModal();
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteLocalAdmin(selected._id);
      toast.success('Admin deleted');
      closeModal();
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const upd = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const filtered = admins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Local Admins</h1>
          <p>Manage all local administrators in the system</p>
        </div>
        <button id="create-local-admin-btn" className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Create Local Admin
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="form-input-icon">
          <Search size={16} className="input-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Aadhaar</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="loading-center"><div className="loading-spinner" /></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon">👤</div>
                  <h3>No local admins found</h3>
                  <p>Create your first local admin to get started</p>
                </div>
              </td></tr>
            ) : filtered.map(a => (
              <tr key={a._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {a.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{a.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{a.email}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{a.phone}</td>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {a.aadhaarNumber ? `•••• •••• ${a.aadhaarNumber.slice(-4)}` : '–'}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm btn-icon" title="Edit" onClick={() => openEdit(a)}><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => openDelete(a)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? 'Create Local Admin' : 'Edit Local Admin'}</div>
              <button className="modal-close" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={modal === 'create' ? handleCreate : handleUpdate}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="form-input-icon">
                    <User size={14} className="input-icon" />
                    <input type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={upd('name')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="form-input-icon">
                    <Mail size={14} className="input-icon" />
                    <input type="email" className="form-input" placeholder="local@example.com" value={form.email} onChange={upd('email')} required />
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Password {modal === 'edit' && <span style={{ color: 'var(--text-muted)' }}>(leave blank to keep)</span>}</label>
                  <input type="password" className="form-input" placeholder="Min. 6 chars" value={form.password} onChange={upd('password')} required={modal === 'create'} minLength={modal === 'create' ? 6 : 0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="form-input-icon">
                    <Phone size={14} className="input-icon" />
                    <input type="text" className="form-input" placeholder="10-digit phone" maxLength={10} value={form.phone} onChange={upd('phone')} required />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>
                <div className="form-input-icon">
                  <CreditCard size={14} className="input-icon" />
                  <input type="text" className="form-input" placeholder="12-digit Aadhaar" maxLength={12} value={form.aadhaarNumber} onChange={upd('aadhaarNumber')} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'create' ? 'Create Admin' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === 'delete' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div className="modal-title">Delete Admin</div>
              <button className="modal-close" onClick={closeModal}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{selected?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting…' : 'Delete Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
