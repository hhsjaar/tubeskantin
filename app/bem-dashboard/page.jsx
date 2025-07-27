"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { FaRecycle, FaLeaf, FaCoins, FaChartLine, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaImage, FaTimes, FaArrowLeft, FaFileAlt, FaShoppingBag, FaCheckCircle, FaBars } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { assets } from '../../assets/assets';

export default function BemDashboard() {
  const [bankSampahList, setBankSampahList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrashback: 0,
    totalUsers: 0,
    totalPromos: 0
  });

  const [selectedBankSampahId, setSelectedBankSampahId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoValue, setPromoValue] = useState("");
  
  // State untuk detail view
  const [detailView, setDetailView] = useState(false);
  const [selectedTrashback, setSelectedTrashback] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageGallery, setImageGallery] = useState([]);

  // State untuk sidebar dan pesanan
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('trashback'); // 'trashback' atau 'orders'

  const pathname = usePathname();
  const menuItems = [
    { name: 'Data TrashBack', path: '/bem-dashboard', icon: assets.add_icon, view: 'trashback' },
    { name: 'Pesanan Selesai', path: '/bem-dashboard', icon: assets.order_icon, view: 'orders' },
  ];

  const fetchBankSampah = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/bank-sampah");
      if (data.success) {
        setBankSampahList(data.bankSampah);
        
        // Menghitung statistik
        setStats({
          totalTrashback: data.bankSampah.length,
          totalUsers: new Set(data.bankSampah.map(item => item.userId?._id)).size,
          totalPromos: data.bankSampah.filter(item => item.promoCode).length
        });
      } else {
        setError(data.message || "Gagal ambil data TrashBack");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get("/api/order/seller-orders");
      if (data.success) {
        // Filter hanya pesanan yang sudah selesai
        const completed = data.orders.filter(order => order.status === "Selesai");
        // Urutkan berdasarkan tanggal terbaru (descending)
        const sortedCompleted = completed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCompletedOrders(sortedCompleted);
      } else {
        toast.error(data.message || "Gagal ambil data pesanan");
      }
    } catch (e) {
      toast.error("Gagal mengambil data pesanan: " + e.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPromoStats = async () => {
    try {
      const { data } = await axios.get("/api/promo-codes/all");
      if (data.success) {
        setStats(prevStats => ({
          ...prevStats,
          totalPromos: data.totalPromos
        }));
      }
    } catch (e) {
      console.error("Error fetching promo stats:", e);
      // Don't set error state here to avoid overriding bank sampah errors
    }
  };

  useEffect(() => {
    fetchBankSampah();
    fetchCompletedOrders();
    fetchPromoStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBankSampahId || !promoCode || !promoValue) {
      toast.error("Mohon isi semua field promo.");
      return;
    }

    const bankSampah = bankSampahList.find((bs) => bs._id === selectedBankSampahId);
    if (!bankSampah || !bankSampah.userId?._id) {
      toast.error("Data user tidak ditemukan.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/promo-codes", {
        userId: bankSampah.userId._id,
        code: promoCode,
        value: Number(promoValue),
      });

      if (data.success) {
        // Update bank sampah dengan promo code dan value
        await axios.patch(`/api/bank-sampah/${selectedBankSampahId}`, {
          promoCode,
          promoValue: Number(promoValue)
        });
        
        // Jika detail view sedang terbuka dan menampilkan item yang sama dengan yang diupdate
        if (detailView && selectedTrashback && selectedTrashback._id === selectedBankSampahId) {
          // Update selectedTrashback dengan informasi promo baru
          setSelectedTrashback({
            ...selectedTrashback,
            promoCode,
            promoValue: Number(promoValue),
            promoUsed: false
          });
        }
        
        toast.success("Promo berhasil ditambahkan.");
        setPromoCode("");
        setPromoValue("");
        setSelectedBankSampahId("");
        fetchBankSampah(); // Refresh data
      } else {
        toast.error(data.message || "Gagal menambahkan promo");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan detail trashback
  const showTrashbackDetail = (item) => {
    setSelectedTrashback(item);
    setDetailView(true);
    
    // Handle array of images properly
    const images = Array.isArray(item.fotoSampah) ? item.fotoSampah : [item.fotoSampah || "/default-image.jpg"];
    setImageGallery(images);
    setCurrentImageIndex(0);
  };

  // Fungsi untuk menutup detail view
  const closeDetailView = () => {
    setDetailView(false);
    setSelectedTrashback(null);
    setImageGallery([]);
  };

  // Fungsi untuk navigasi gambar
  const navigateImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % imageGallery.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imageGallery.length) % imageGallery.length);
    }
  };

  // Fungsi untuk menghitung total pesanan
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = item.product?.offerPrice || item.product?.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Fungsi untuk mendapatkan kantin dari pesanan
  const getKantinFromOrder = (order) => {
    if (order.items && order.items.length > 0) {
      return order.items[0].product?.kantin || 'Tidak diketahui';
    }
    return 'Tidak diketahui';
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Sidebar */}
        <div className={`md:w-64 w-16 border-r border-gray-200 dark:border-gray-700 min-h-screen text-base py-2 flex flex-col sticky top-0 h-screen bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/20 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : ''}`}>
          {menuItems.map((item) => {
            const isActive = selectedView === item.view;

            return (
              <div
                key={item.name}
                onClick={() => setSelectedView(item.view)}
                className={
                  `flex items-center py-3 px-4 gap-3 transition-all duration-300 ease-in-out cursor-pointer group ${
                    isActive
                      ? "border-r-4 md:border-r-[6px] bg-[#479c26]/10 border-[#479c26] dark:bg-[#479c26]/20 dark:border-[#479c26] text-[#479c26] dark:text-[#479c26]"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                <Image
                  src={item.icon}
                  alt={`${item.name.toLowerCase()}_icon`}
                  className={`w-7 h-7 transition-all duration-300 filter ${
                    isActive 
                      ? 'brightness-0 saturate-100' 
                      : 'brightness-0 saturate-100 opacity-70 group-hover:opacity-100'
                  } ${
                    isActive 
                      ? 'dark:brightness-0 dark:invert dark:sepia dark:saturate-[10000%] dark:hue-rotate-[60deg]' 
                      : 'dark:brightness-0 dark:invert dark:opacity-70 dark:group-hover:opacity-100'
                  }`}
                  style={{
                    filter: isActive 
                      ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(100deg) brightness(97%) contrast(97%)'
                      : undefined
                  }}
                />
                <p className={`md:block hidden text-center font-medium transition-all duration-300 ease-in-out ${
                  isActive 
                    ? 'text-[#479c26] dark:text-[#479c26] font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-10">
          {/* Hero Section dengan Gradient Background */}
          <div className="relative bg-gradient-to-r from-[#479C25] to-[#3a7d1f] py-12 px-6 md:px-16 lg:px-32 rounded-b-3xl shadow-lg overflow-hidden mb-10">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3a7d1f] rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#479C25] rounded-full filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <FaRecycle className="inline-block" /> BEM Dashboard
              </h1>
              <p className="text-green-100 text-lg max-w-2xl mx-auto">
                Kelola program TrashBack dan pantau pesanan yang sudah selesai dari semua kantin untuk crosscheck kontribusi mahasiswa.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="container mx-auto px-6 md:px-16 lg:px-32 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-800/40 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400">
          <FaRecycle size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalTrashback}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total TrashBack</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-800/40 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400">
          <FaUser size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Partisipan Aktif</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-800/40 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400">
          <FaCoins size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalPromos}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Promo Diberikan</p>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-800/40 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400">
          <FaCheckCircle size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{completedOrders.length}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pesanan Selesai</p>
        </div>
      </div>
    </div>
  </div>
</div>

          {error && (
  <div className="container mx-auto px-6 md:px-16 lg:px-32 mb-6">
    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800">
      {error}
    </div>
  </div>
)}

          {/* Main Content */}
          <div className="container mx-auto px-6 md:px-16 lg:px-32">
            {/* Detail View */}
            {detailView && selectedTrashback && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 md:p-8">
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
        <button 
          onClick={closeDetailView}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft className="text-gray-700 dark:text-gray-300" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detail TrashBack</h2>
        <button 
          onClick={closeDetailView}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaTimes className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="p-6">
        {/* Image Gallery dengan dark mode */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-video">
            <img 
              src={imageGallery[currentImageIndex]} 
              alt="Foto Sampah" 
              className="w-full h-full object-contain"
            />
            // ... existing image navigation code ...
          </div>
          // ... existing thumbnail gallery code ...
        </div>
        
        {/* Detail Info dengan dark mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                <FaRecycle />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Jenis Sampah</h3>
                <p className="text-gray-900 dark:text-white">
                  {Array.isArray(selectedTrashback.sampah) 
                    ? selectedTrashback.sampah.join(", ") 
                    : selectedTrashback.sampah}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                <FaLeaf />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Jumlah</h3>
                <p className="text-gray-900 dark:text-white">
                  {Array.isArray(selectedTrashback.jumlahSampah)
                    ? selectedTrashback.jumlahSampah.join(", ") + " buah"
                    : selectedTrashback.jumlahSampah + " buah"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Lokasi</h3>
                <p className="text-gray-900 dark:text-white">{selectedTrashback.lokasi}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedTrashback.catatan && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                  <FaFileAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Catatan</h3>
                  <p className="text-gray-900 dark:text-white break-words">{selectedTrashback.catatan}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                <FaCalendarAlt />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Tanggal</h3>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedTrashback.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pukul {new Date(selectedTrashback.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
            
            {selectedTrashback.userId && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 flex-shrink-0 mt-1">
                  <FaUser />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Pengirim</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={selectedTrashback.userId.imageUrl || "/default-user.png"}
                      alt={selectedTrashback.userId.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <span className="text-gray-900 dark:text-white">{selectedTrashback.userId.name}</span>
                  </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Promo Section */}
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Promo</h3>
                      
                      {selectedTrashback.promoCode ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25]">
                              <FaCoins />
                            </div>
                            <div>
                              <p className="text-green-800 font-medium">Promo telah diberikan</p>
                              <p className="text-sm text-green-700">
                                Kode: <span className="font-mono font-bold">{selectedTrashback.promoCode}</span>
                              </p>
                              <p className="text-sm text-green-700">
                                Nilai: Rp {selectedTrashback.promoValue?.toLocaleString('id-ID')}
                              </p>
                              {selectedTrashback.promoUsed !== undefined && (
                                <p className="text-sm text-green-700">
                                  Status: {selectedTrashback.promoUsed ? 
                                    <span className="text-orange-600 font-medium">Sudah digunakan</span> : 
                                    <span className="text-green-600 font-medium">Belum digunakan</span>}
                                </p>
                              )}
                              {selectedTrashback.promoExpiresAt && (
                                <p className="text-sm text-green-700">
                                  Kadaluarsa: {new Date(selectedTrashback.promoExpiresAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                              <FaCoins />
                            </div>
                            <div>
                              <p className="text-yellow-800 font-medium">Belum ada promo yang diberikan</p>
                              <p className="text-sm text-yellow-700">
                                Berikan promo untuk pengguna ini melalui form promo
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content berdasarkan selectedView */}
            {selectedView === 'trashback' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Data TrashBack */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <FaRecycle className="text-[#479C25]" /> Data TrashBack Terbaru
                  </h2>

                  {loading && !bankSampahList.length && (
                    <div className="flex justify-center items-center h-40">
                      <div className="w-10 h-10 border-4 border-[#479C25] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {!loading && bankSampahList.length === 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                      <FaRecycle className="mx-auto text-gray-300 dark:text-gray-500 text-4xl mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Belum ada data TrashBack.</p>
                    </div>
                  )}

                  <ul className="space-y-4 overflow-x-auto max-h-[70vh] pr-2 custom-scrollbar">
                    {bankSampahList.map((item) => {
                      const isSelected = selectedBankSampahId === item._id;
                      return (
                        <li
                          key={item._id}
                          onClick={() => setSelectedBankSampahId(item._id)}
                          className={`cursor-pointer border rounded-xl p-5 flex flex-col sm:flex-row gap-4 transition-all duration-300
                            ${isSelected ? "bg-green-50 dark:bg-green-900/30 border-green-500 shadow-md" : "bg-white dark:bg-gray-700 hover:shadow-md border-gray-100 dark:border-gray-600"}`}
                        >
                          <div className="relative group">
                            <img
                              src={
                                Array.isArray(item.fotoSampah)
                                  ? item.fotoSampah[0] || "/default-image.jpg"
                                  : item.fotoSampah || "/default-image.jpg"
                              }
                              alt="Foto Sampah"
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                showTrashbackDetail(item);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <FaImage className="text-white text-xl" />
                            </div>
                          </div>
                          <div className="flex-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <p>
                              <strong>Jenis Sampah:</strong>{" "}
                              {Array.isArray(item.sampah) ? item.sampah.join(", ") : item.sampah}
                            </p>
                            <p>
                              <strong>Jumlah:</strong>{" "}
                              {Array.isArray(item.jumlahSampah)
                                ? item.jumlahSampah.join(", ") + " buah"
                                : item.jumlahSampah + " buah"}
                            </p>
                            <p>
                              <strong>Lokasi:</strong> {item.lokasi}
                            </p>
                            {item.catatan && (
                              <p className="break-words">
                                <strong>Catatan:</strong> {item.catatan}
                              </p>
                            )}
                            {item.userId && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <img
                                  src={item.userId.imageUrl || "/default-user.png"}
                                  alt={item.userId.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="truncate">
                                  Dikirim oleh: {item.userId.name}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showTrashbackDetail(item);
                                }}
                                className="text-xs text-[#479C25] hover:text-[#3a7d1f] font-medium transition-colors"
                              >
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Right Column - Form Promo */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <FaCoins className="text-[#479C25]" /> Input Promo dari TrashBack
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Pilih TrashBack
                      </label>
                      <select
                        value={selectedBankSampahId}
                        onChange={(e) => setSelectedBankSampahId(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">-- Pilih --</option>
                        {bankSampahList.map((bs) => (
                          <option key={bs._id} value={bs._id}>
                            {bs.sampah} - {bs.userId?.name || "Unknown"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kode Promo</label>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Masukkan Kode Promo"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Nominal Promo (Rp)
                      </label>
                      <input
                        type="number"
                        value={promoValue}
                        onChange={(e) => setPromoValue(e.target.value)}
                        required
                        min={1}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Masukkan Nominal Promo"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <FaCoins />
                          <span>Tambahkan Promo</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // View Pesanan Selesai
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                  <FaCheckCircle className="text-[#479C25]" /> Pesanan Selesai - Crosscheck TrashBack
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Daftar pesanan yang sudah selesai dari semua kantin di Polines. Data ini dapat digunakan untuk crosscheck dengan data TrashBack.
                </p>

                {ordersLoading && (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-[#479C25] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {!ordersLoading && completedOrders.length === 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                    <FaShoppingBag className="mx-auto text-gray-300 dark:text-gray-500 text-4xl mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Belum ada pesanan yang selesai.</p>
                  </div>
                )}

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {completedOrders.map((order, index) => {
                    const orderDate = new Date(order.date);
                    const formattedDate = orderDate.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    const formattedTime = orderDate.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    const orderTotal = calculateOrderTotal(order.items);
                    const kantin = getKantinFromOrder(order);
                    
                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100 dark:border-gray-600"
                      >
                        {/* Header pesanan dengan status */}
                        <div className="px-6 py-3 flex justify-between items-center bg-green-50 dark:bg-green-900/30 border-b dark:border-gray-600">
                          <div className="flex items-center space-x-2">
                            <FaCheckCircle className="text-green-600" />
                            <span className="font-semibold text-green-800 dark:text-green-400">Pesanan Selesai</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{kantin}</span>
                          </div>
                        </div>

                        {/* Detail pesanan */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">Order ID: {order.orderId}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formattedDate} • {formattedTime}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-800 dark:text-white">
                                Rp {orderTotal.toLocaleString('id-ID')}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          {/* Daftar produk */}
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                                <img
                                  src={item.product?.image?.[0] || '/default-product.jpg'}
                                  alt={item.product?.name || 'Product'}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 dark:text-white">
                                    {item.product?.name || 'Produk tidak ditemukan'}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.quantity}x • Rp {(item.product?.offerPrice || item.product?.price || 0).toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    Rp {((item.product?.offerPrice || item.product?.price || 0) * item.quantity).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Info tambahan */}
                          {order.note && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-400">
                                <strong>Catatan:</strong> {order.note}
                              </p>
                            </div>
                          )}

                          {order.promoCode && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                <strong>Promo:</strong> {order.promoCode}
                                {order.discount && (
                                  <span className="ml-2">(-Rp {order.discount.toLocaleString('id-ID')})</span>
                                )}
                              </p>
                            </div>
                          )}

                          {/* Informasi user */}
                          {order.user && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                              <div className="flex items-center gap-3">
                                <img
                                  src={order.user.imageUrl || "/default-user.png"}
                                  alt={order.user.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-500"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    <strong>Dipesan oleh:</strong> {order.user.name}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {order.user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}