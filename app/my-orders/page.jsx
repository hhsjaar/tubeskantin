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
import { FaHistory, FaSpinner, FaShoppingBag, FaCalendarAlt, FaFilter, FaBoxOpen, FaRegClock } from "react-icons/fa";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ongoing"); // ongoing atau history

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section dengan Gradient Background */}
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
            <p className="text-green-100 text-lg max-w-2xl">Pantau status pesanan Anda dan lihat riwayat pembelian</p>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 lg:px-32 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 backdrop-filter backdrop-blur-lg bg-opacity-80 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-[#479C25]" />
              <h2 className="text-xl font-bold text-gray-800">Status Pesanan</h2>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "ongoing"
                    ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaSpinner className={`${activeTab === "ongoing" ? "animate-spin" : ""}`} />
                <span>Sedang Berjalan</span>
                <span className="ml-1 bg-white/20 text-xs px-2 py-0.5 rounded-full">{ongoingCount}</span>
              </button>
              
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "history"
                    ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaHistory />
                <span>Riwayat</span>
                <span className="ml-1 bg-white/20 text-xs px-2 py-0.5 rounded-full">{historyCount}</span>
              </button>
            </div>
          </div>

          {/* Order List */}
          <div className="space-y-6 mb-16">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="p-8 rounded-xl bg-white shadow-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[#479C25] border-t-transparent animate-spin"></div>
                    <p className="text-gray-600 font-medium">Memuat pesanan...</p>
                  </div>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-[#479C25]">
                    <FaBoxOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800">
                    {activeTab === "ongoing" ? "Tidak ada pesanan yang sedang berjalan" : "Belum ada riwayat pesanan"}
                  </h3>
                  <p className="text-gray-500 max-w-md">
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
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header dengan status */}
                  <div className={`bg-gradient-to-r ${getStatusColor(order.status)} px-6 py-3 flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg">{getStatusIcon(order.status)}</span>
                      <span className="text-white font-medium">{order.status || "Menunggu Konfirmasi"}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
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
                          <div className="relative flex items-center justify-center w-20 h-20 bg-gray-100 rounded-xl border border-gray-200">
                            <span className="text-sm font-medium text-gray-600">+{order.items.length - 2} lagi</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Info Produk */}
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-base text-gray-800">
                          {order.items
                            .map(
                              (item) =>
                                `${item.product?.name ?? "Produk Tidak Dikenal"} x ${item.quantity ?? 0}`
                            )
                            .join(", ")}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <FaBoxOpen className="text-[#479C25] h-3.5 w-3.5" />
                          Total Produk: {order.items.length}
                        </span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaCalendarAlt className="text-[#479C25] h-3 w-3" />
                            {order.date ? new Date(order.date).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }).replace(/\//g, '/') : "Tanggal tidak diketahui"}
                          </span>
                          {order.statusUpdatedAt && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <FaRegClock className="text-[#479C25] h-3 w-3" />
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
                    <div className="my-auto w-full md:w-1/2 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                      <table className="w-full text-sm text-gray-700">
                        <tbody>
                          <tr>
                            <td className="py-1">Subtotal</td>
                            <td className="py-1 text-right font-medium">{currency}{order.amount?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Pajak (2%)</td>
                            <td className="py-1 text-right font-medium">{currency}{order.tax?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Diskon</td>
                            <td className="py-1 text-right text-orange-600 font-medium">- {currency}{order.discount?.toLocaleString() ?? "0"}</td>
                          </tr>
                          <tr className="border-t pt-2">
                            <td className="py-2 font-semibold">Total</td>
                            <td className="py-2 text-right font-bold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] bg-clip-text text-transparent">{currency}{order.total?.toLocaleString() ?? "0"}</td>
                          </tr>
                          {order.promoCode && (
                            <tr>
                              <td colSpan="2" className="text-xs text-[#479C25] text-right">
                                Kode promo digunakan: {order.promoCode}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Menambahkan catatan pembeli */}
                      {order.note && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#479C25] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
