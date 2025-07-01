'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { FaRegBell } from "react-icons/fa6";

const NotificationBell = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/api/notification/user/${user.id}`);
        if (res.data.success) setNotifications(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notifId) => {
    try {
await axios.patch(`/api/notification/read/${notifId}`);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notifId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi sebagai dibaca:", err);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <FaRegBell />
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-80 bg-white border rounded shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Tidak ada notifikasi.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif._id)}
                className={`cursor-pointer p-3 border-b ${notif.isRead ? 'bg-white' : 'bg-orange-100'} hover:bg-gray-100`}
              >
                <p className="font-medium text-sm">{notif.title}</p>
                <p className="text-xs text-gray-600">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
