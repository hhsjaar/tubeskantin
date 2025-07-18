'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHistory, FaSpinner, FaShoppingBag, FaCalendarAlt, FaFilter, FaBoxOpen, FaRegClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ongoing"); // ongoing atau history
  const [expandedOrders, setExpandedOrders] = useState(new Set()); // State untuk dropdown

  // Fungsi untuk toggle dropdown detail pesanan
  const toggleOrderDetails = (orderIndex) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderIndex)) {
      newExpanded.delete(orderIndex);
    } else {
      newExpanded.add(orderIndex);
    }
    setExpandedOrders(newExpanded);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    if (isSubmitting) return; // Prevent multiple calls
    
    try {
      setIsSubmitting(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        console.log("Orders data:", JSON.stringify(data.orders[0], null, 2)); // Tambahkan ini untuk debugging
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && !isSubmitting) {
      fetchOrders();
    }
  }, [user]);

  // Tambahkan useEffect untuk menangani refresh dari parameter URL
  useEffect(() => {
    // Cek apakah ada parameter refresh=true di URL
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRefresh = urlParams.get('refresh') === 'true';
    
    if (shouldRefresh && user) {
      // Refresh data pesanan
      fetchOrders();
      
      // Hapus parameter dari URL tanpa refresh halaman
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu Konfirmasi": return "from-yellow-500 to-amber-600";
      case "Sedang Disiapkan": return "from-blue-500 to-indigo-600";
      case "Sudah Siap": return "from-[#479C25] to-[#3a7d1f]";
      case "Selesai": return "from-green-600 to-emerald-700";
      case "Dibatalkan": return "from-red-500 to-rose-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  // Fungsi untuk mendapatkan ikon status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Menunggu Konfirmasi": return "⏳";
      case "Sedang Disiapkan": return "👨‍🍳";
      case "Sudah Siap": return "✅";
      case "Selesai": return "🎉";
      case "Dibatalkan": return "❌";
      default: return "🔄";
    }
  };

  // Filter pesanan berdasarkan tab aktif
  const filteredOrders = orders.filter(order => {
    if (activeTab === "ongoing") {
      return ["Menunggu Konfirmasi", "Sedang Disiapkan", "Sudah Siap"].includes(order.status);
    } else {
      return ["Selesai", "Dibatalkan"].includes(order.status);
    }
  });

  // Menghitung jumlah pesanan untuk setiap tab
  const ongoingCount = orders.filter(order => 
    ["Menunggu Konfirmasi", "Sedang Disiapkan", "Sudah Siap"].includes(order.status)
  ).length;
  
  const historyCount = orders.filter(order => 
    ["Selesai", "Dibatalkan"].includes(order.status)
  ).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#479C25] to-[#3a7d1f] py-12 px-6 md:px-16 lg:px-32 rounded-b-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3a7d1f] rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#479C25] rounded-full filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <FaShoppingBag className="text-white h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Pesanan Saya</h1>
            </div>
            <p className="text-green-100 text-lg max-w-2xl font-medium">Pantau status pesanan Anda dan lihat riwayat pembelian</p>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 lg:px-32 py-8">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8 backdrop-filter backdrop-blur-lg bg-opacity-80 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-[#479C25]" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Status Pesanan</h2>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg group ${
                  activeTab === "ongoing"
                    ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-[1.02]'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.02]'
                }`}
              >
                <FaSpinner className={`${activeTab === "ongoing" ? "animate-spin" : ""} group-hover:scale-110 transition-transform duration-300`} />
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Sedang Berjalan</span>
                <span className="ml-1 bg-white/20 text-xs px-2 py-0.5 rounded-full group-hover:bg-white/30 transition-colors duration-300">{ongoingCount}</span>
              </button>
              
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg group ${
                  activeTab === "history"
                    ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-[1.02]'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.02]'
                }`}
              >
                <FaHistory className="group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Riwayat</span>
                <span className="ml-1 bg-white/20 text-xs px-2 py-0.5 rounded-full group-hover:bg-white/30 transition-colors duration-300">{historyCount}</span>
              </button>
            </div>
          </div>

          {/* Order List */}
          <div className="space-y-6 mb-16">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="p-8 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-filter backdrop-blur-xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[#479C25] border-t-transparent animate-spin"></div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">Memuat pesanan...</p>
                  </div>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-12 text-center backdrop-filter backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:border-[#479C25]/20 dark:hover:border-[#479C25]/20 transition-all duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-[#479C25] dark:text-green-400">
                    <FaBoxOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {activeTab === "ongoing" ? "Tidak ada pesanan yang sedang berjalan" : "Belum ada riwayat pesanan"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-md">
                    {activeTab === "ongoing" 
                      ? "Anda belum memiliki pesanan yang sedang diproses. Silakan pesan makanan atau minuman terlebih dahulu." 
                      : "Riwayat pesanan Anda akan muncul di sini setelah pesanan selesai atau dibatalkan."}
                  </p>
                </div>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg overflow-hidden backdrop-filter backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:border-[#479C25]/20 dark:hover:border-[#479C25]/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className={`bg-gradient-to-r ${getStatusColor(order.status)} px-6 py-3 flex justify-between items-center group-hover:shadow-md transition-shadow duration-300`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg group-hover:scale-110 transition-transform duration-300">{getStatusIcon(order.status)}</span>
                      <span className="text-white font-medium group-hover:translate-x-0.5 transition-transform duration-300">{order.status || "Menunggu Konfirmasi"}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                      <span className="text-white text-sm font-medium">ID: {order._id?.substring(0, 8) || "#000000"}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Info Produk dengan Foto Produk */}
                    <div className="flex-1">
                      {/* Foto Produk - Menampilkan hingga 2 produk */}
                      <div className="flex gap-3 mb-4">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#479C25]/20 to-[#3a7d1f]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                              src={item.product?.image[0] || assets.box_icon}
                              alt={item.product?.name || `Produk ${idx + 1}`}
                              width={80}
                              height={80}
                              className="rounded-xl object-cover border shadow-sm group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.quantity > 1 && (
                              <div className="absolute -top-2 -right-2 bg-[#479C25] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                {item.quantity}
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="relative flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">+{order.items.length - 2} lagi</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Info Produk Modern dengan Dropdown */}
                      <div className="flex flex-col gap-3">
                        {/* Header dengan tombol dropdown */}
                        <div 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition-all duration-300 group"
                          onClick={() => toggleOrderDetails(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#479C25] rounded-full animate-pulse"></div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-[#479C25] dark:group-hover:text-green-400 transition-colors duration-300">
                                {order.items.length} Item Pesanan
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Klik untuk melihat detail produk
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#479C25] dark:text-green-400">
                              {expandedOrders.has(index) ? 'Tutup' : 'Lihat'}
                            </span>
                            {expandedOrders.has(index) ? (
                              <FaChevronUp className="text-[#479C25] dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <FaChevronDown className="text-[#479C25] dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                            )}
                          </div>
                        </div>

                        {/* Dropdown Detail Produk */}
                        {expandedOrders.has(index) && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-inner animate-fadeIn">
                            <div className="p-4 bg-gradient-to-r from-[#479C25]/5 to-[#3a7d1f]/5 border-b border-gray-200 dark:border-gray-600">
                              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FaBoxOpen className="text-[#479C25] dark:text-green-400" />
                                Detail Produk Pesanan
                              </h4>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-600">
                              {order.items.map((item, itemIdx) => (
  <div key={itemIdx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
    <div className="flex items-center gap-4">
      <div className="relative">
        <Image
          src={item.product?.image[0] || assets.box_icon}
          alt={item.product?.name || `Produk ${itemIdx + 1}`}
          width={60}
          height={60}
          className="rounded-lg object-cover border shadow-sm"
        />
        <div className="absolute -top-2 -right-2 bg-[#479C25] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {item.quantity}
        </div>
      </div>
      <div className="flex-1">
        <h5 className="font-medium text-gray-900 dark:text-white text-base">
          {item.product?.name ?? "Produk Tidak Dikenal"}
        </h5>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Jumlah: <span className="font-semibold text-[#479C25] dark:text-green-400">{item.quantity}</span>
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currency}{((item.product?.offerPrice || 0) * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <FaCalendarAlt className="text-[#479C25] dark:text-green-400 h-3 w-3" />
                            {order.date ? new Date(order.date).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }).replace(/\//g, '/') : "Tanggal tidak diketahui"}
                          </span>
                          {order.statusUpdatedAt && (
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <FaRegClock className="text-[#479C25] dark:text-green-400 h-3 w-3" />
                              Diperbarui: {new Date(order.statusUpdatedAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }).replace(/\//g, '/')} {new Date(order.statusUpdatedAt).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Harga */}
                    <div className="my-auto w-full md:w-1/2 bg-gray-50/30 dark:bg-gray-800/30 rounded-xl p-4 border border-white/20 dark:border-gray-700/50 backdrop-filter backdrop-blur-sm">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 text-gray-700 dark:text-gray-300">Subtotal</td>
                            <td className="py-1 text-right font-medium text-gray-900 dark:text-gray-100">{currency}{order.amount?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-700 dark:text-gray-300">Biaya Layanan (5%)</td>
                            <td className="py-1 text-right font-medium text-gray-900 dark:text-gray-100">{currency}{order.tax?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-700 dark:text-gray-300">Diskon</td>
                            <td className="py-1 text-right font-medium text-red-600 dark:text-red-400">- {currency}{order.discount?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr className="border-t pt-2">
                            <td className="py-2 font-semibold text-gray-900 dark:text-gray-100">Total</td>
                            <td className="py-2 text-right font-bold text-green-600 dark:text-green-400">{currency}{order.total?.toLocaleString() ?? "0"}</td>
                          </tr>
                          {order.promoCode && (
                            <tr>
                              <td colSpan="2" className="text-xs text-[#479C25] dark:text-green-400 text-right">
                                Kode promo digunakan: {order.promoCode}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Menambahkan catatan pembeli */}
                      {order.note && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#479C25] dark:text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Catatan:</h4>
                              <p className="text-sm text-gray-600 mt-1">{order.note}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
