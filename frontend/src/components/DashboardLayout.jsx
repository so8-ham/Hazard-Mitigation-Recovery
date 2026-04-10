import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getMyNotifications } from '../api/axios';

export default function DashboardLayout() {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    getMyNotifications()
      .then(res => {
        const unread = (res.data.notifications || []).filter(n => !n.isRead).length;
        setNotifCount(unread);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="app-layout">
      <Sidebar notificationCount={notifCount} />
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
