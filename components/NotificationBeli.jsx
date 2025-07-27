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

  // Close notification when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.notification-container') && window.innerWidth >= 640) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Prevent body scroll when notification is open on mobile
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <div className="relative notification-container">
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        aria-label="Notifikasi"
      >
        <FaRegBell className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl" />
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 dark:bg-green-400 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse font-medium">
            {notifications.filter(n => !n.isRead).length > 99 ? '99+' : notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Full Screen Overlay for Mobile */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" />
          
          {/* Notification Panel - Full screen untuk mobile, dropdown untuk desktop */}
          <div className="fixed inset-0 sm:absolute sm:right-0 sm:top-14 w-full sm:w-96 md:w-[28rem] lg:w-[32rem] bg-white dark:bg-gray-900 border-0 sm:border dark:border-gray-700 rounded-none sm:rounded-2xl shadow-xl dark:shadow-gray-900/50 z-50 flex flex-col sm:max-h-[32rem] backdrop-blur-lg">
            {/* Header - Full width untuk mobile */}
            <div className="flex-shrink-0 bg-white dark:bg-gray-900 p-4 sm:p-4 border-b dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Notifikasi</h3>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <FaRegBell className="text-4xl text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-base text-gray-500 dark:text-gray-400">Tidak ada notifikasi.</p>
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
                        className={`group flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 ${
                          notif.isRead 
                            ? 'bg-white dark:bg-gray-900' 
                            : 'bg-green-50 dark:bg-green-900/20'
                        } hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700`}
                      >
                        {/* Emoji Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
                          {emoji}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-base text-gray-900 dark:text-gray-100 truncate pr-2">
                              {notif.title}
                            </h4>
                            <div className="flex flex-col items-end text-xs flex-shrink-0">
                              <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">{dateStr}</span>
                              <span className="text-gray-400 dark:text-gray-500 whitespace-nowrap">{timeStr}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          {/* Read indicator */}
                          {!notif.isRead && (
                            <div className="mt-2">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer untuk mobile - Optional action buttons */}
            <div className="flex-shrink-0 bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800 sm:hidden">
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Mark all as read
                    notifications.forEach(notif => {
                      if (!notif.isRead) {
                        handleNotificationClick(notif._id);
                      }
                    });
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  disabled={notifications.filter(n => !n.isRead).length === 0}
                >
                  Tandai Semua Dibaca
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
