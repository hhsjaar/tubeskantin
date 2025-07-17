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

  const getEmojiByTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pesanan')) return '🛒';
    if (lowerTitle.includes('pembayaran')) return '💰';
    if (lowerTitle.includes('promo') || lowerTitle.includes('diskon')) return '🏷️';
    if (lowerTitle.includes('pengiriman')) return '🚚';
    if (lowerTitle.includes('selamat') || lowerTitle.includes('berhasil')) return '🎉';
    if (lowerTitle.includes('gagal') || lowerTitle.includes('batal')) return '❌';
    if (lowerTitle.includes('info')) return 'ℹ️';
    if (lowerTitle.includes('peringatan') || lowerTitle.includes('warning')) return '⚠️';
    return '🔔';
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <FaRegBell className="text-gray-600 dark:text-gray-300 text-xl" />
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 dark:bg-green-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-gray-900/50 z-50 max-h-[32rem] overflow-y-auto backdrop-blur-lg">
          <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifikasi</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FaRegBell className="text-4xl text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Tidak ada notifikasi.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((notif) => {
                const dateObj = notif.createdAt ? new Date(notif.createdAt) : null;
                const dateStr = dateObj ? dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
                const timeStr = dateObj ? dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
                const emoji = getEmojiByTitle(notif.title);
                
                return (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif._id)}
                    className={`group flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 ${notif.isRead ? 'bg-white dark:bg-gray-900' : 'bg-green-50 dark:bg-green-900/20'} hover:bg-gray-50 dark:hover:bg-gray-800`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
                      {emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {notif.title}
                        </h4>
                        <div className="flex flex-col items-end text-xs">
                          <span className="text-gray-500 dark:text-gray-400">{dateStr}</span>
                          <span className="text-gray-400 dark:text-gray-500">{timeStr}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
