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

  // Fungsi untuk memilih emoji berdasarkan judul notifikasi
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
    return '🔔'; // Default emoji
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
        <div className="absolute right-0 top-9 w-80 bg-white border rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Tidak ada notifikasi.</p>
          ) : (
            notifications.map((notif) => {
              // Format date and time
              const dateObj = notif.createdAt ? new Date(notif.createdAt) : null;
              const dateStr = dateObj ? dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
              const timeStr = dateObj ? dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
              // Emoji berdasarkan judul notifikasi
              const emoji = getEmojiByTitle(notif.title);
              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif._id)}
                  className={`flex items-start gap-2 cursor-pointer p-3 border-b ${notif.isRead ? 'bg-white' : 'bg-orange-100'} hover:bg-gray-100`}
                >
                  {/* Favicon dengan ukuran lebih besar */}
                  <img src="/favicon.ico" alt="favicon" className="w-10 h-10 mt-0.5 mr-1" />
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm">{notif.title}</span>
                      {/* Emoji dipindahkan ke kanan judul dan ukuran diperkecil */}
                      <span className="text-sm">{emoji}</span>
                    </div>
                    {/* Ukuran teks deskripsi diperkecil */}
                    <p className="text-[11px] text-gray-600 mt-1">{notif.message}</p>
                  </div>
                  {/* Date & Time */}
                  <div className="flex flex-col items-end ml-2 min-w-[70px]">
                    <span className="text-xs text-gray-400">{dateStr}</span>
                    <span className="text-[10px] text-gray-300">{timeStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
