import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { getMyNotifications, markNotificationRead, deleteNotification } from '../../api/axios';
import toast from 'react-hot-toast';

const typeIcon = {
  NEW_PROPOSAL: '📋',
  PROPOSAL_APPROVED: '✅',
  PROPOSAL_REJECTED: '❌',
  PAYMENT_SENT: '💰',
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetch = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data.notifications || []);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed to mark as read'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markNotificationRead(n._id).catch(() => {})));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => !n.isRead);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Notifications</h1>
          <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}>
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      <div className="tabs">
        <button className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All ({notifications.length})</button>
        <button className={`tab-btn ${filter === 'UNREAD' ? 'active' : ''}`} onClick={() => setFilter('UNREAD')}>Unread ({unreadCount})</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={48} /></div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
              {!n.isRead && <div className="notification-dot" />}
              {n.isRead && <div style={{ width: 8 }} />}
              <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{typeIcon[n.type] || '🔔'}</div>
              <div className="notification-content">
                <div className="notification-title">{n.title}</div>
                <div className="notification-message">{n.message}</div>
                {n.proposal && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', marginTop: '4px' }}>
                    📋 {n.proposal.title} · <span className={`badge badge-${n.proposal.status?.toLowerCase()}`} style={{ padding: '1px 6px' }}>{n.proposal.status}</span>
                  </div>
                )}
                <div className="notification-time">{timeAgo(n.createdAt)}</div>
              </div>
              <div className="notification-actions">
                {!n.isRead && (
                  <button className="btn btn-success btn-sm btn-icon" title="Mark as read" onClick={() => handleMarkRead(n._id)}>
                    <Check size={13} />
                  </button>
                )}
                <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => handleDelete(n._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
