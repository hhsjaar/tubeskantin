'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // Tab untuk filter pesanan
    const [groupByDate, setGroupByDate] = useState(true); // State untuk toggle pengelompokan berdasarkan tanggal
    const [expandedOrders, setExpandedOrders] = useState({}); // State untuk melacak pesanan yang detailnya dibuka

    const fetchSellerOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(
                '/api/order/seller-orders',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                const kantekOrders = data.orders.filter(order =>
                    order.items.some(item => item.product?.kantin === "Kantin Teknik")
                );
                setOrders(kantekOrders);
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const token = await getToken();
            const { data } = await axios.put(
                '/api/order/update-status',
                { orderId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success("Status pesanan berhasil diperbarui");
                // Update status pesanan di state lokal
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, status: newStatus, statusUpdatedAt: new Date() } : order
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }
    }, [user]);

    // Fungsi untuk toggle detail pesanan
    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Fungsi untuk mendapatkan warna status
    const getStatusColor = (status) => {
        switch (status) {
            case "Menunggu Konfirmasi": return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Sedang Disiapkan": return "bg-blue-100 text-blue-800 border-blue-300";
            case "Sudah Siap": return "bg-green-100 text-green-800 border-green-300";
            case "Selesai": return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "Dibatalkan": return "bg-red-100 text-red-800 border-red-300";
            default: return "bg-gray-100 text-gray-800 border-gray-300";
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

    // Fungsi untuk menghitung total harga pesanan (tanpa pajak)
    const calculateOrderTotal = (items) => {
        return items.reduce((total, item) => {
            const itemPrice = item.product?.offerPrice || item.product?.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    // Filter pesanan berdasarkan tab aktif
    const filteredOrders = orders
        .filter(order => {
            if (activeTab === "all") return true;
            return order.status === activeTab;
        })
        // Urutkan pesanan dari yang terbaru ke yang terlama
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Fungsi untuk mengelompokkan pesanan berdasarkan tanggal
    const groupOrdersByDate = (orders) => {
        const grouped = {};
        
        orders.forEach(order => {
            const orderDate = new Date(order.date);
            const dateKey = orderDate.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            
            grouped[dateKey].push(order);
        });
        
        return grouped;
    };

    // Mengelompokkan pesanan berdasarkan tanggal jika groupByDate aktif
    const groupedOrders = groupByDate ? groupOrdersByDate(filteredOrders) : null;
    
    // Mendapatkan array tanggal yang diurutkan dari yang terbaru
    const sortedDates = groupByDate ? 
        Object.keys(groupedOrders).sort((a, b) => {
            return new Date(b.split(' ')[0]) - new Date(a.split(' ')[0]);
        }) : [];

    return (
        <div className="flex-1 min-h-screen flex flex-col bg-gray-50">
            <div className="flex-grow p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header dengan statistik */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
                        <h1 className="text-2xl font-bold mb-4">Dashboard Pesanan</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm opacity-80">Total Pesanan</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm opacity-80">Menunggu Konfirmasi</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === "Menunggu Konfirmasi").length}
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm opacity-80">Sedang Disiapkan</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === "Sedang Disiapkan").length}
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm opacity-80">Sudah Siap</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === "Sudah Siap").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tab untuk filter pesanan */}
                    <div className="flex flex-wrap items-center justify-between mb-6 bg-white rounded-lg shadow p-3">
                        <button 
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "all" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Semua Pesanan
                        </button>
                        <button 
                            onClick={() => setActiveTab("Menunggu Konfirmasi")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "Menunggu Konfirmasi" ? "bg-yellow-100 text-yellow-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Menunggu Konfirmasi
                        </button>
                        <button 
                            onClick={() => setActiveTab("Sedang Disiapkan")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "Sedang Disiapkan" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Sedang Disiapkan
                        </button>
                        <button 
                            onClick={() => setActiveTab("Sudah Siap")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "Sudah Siap" ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Sudah Siap
                        </button>
                        <button 
                            onClick={() => setActiveTab("Selesai")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "Selesai" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Selesai
                        </button>
                        <button 
                            onClick={() => setActiveTab("Dibatalkan")}
                            className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all ${activeTab === "Dibatalkan" ? "bg-red-100 text-red-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            Dibatalkan
                        </button>
                    </div>
                        
                    {/* Toggle untuk pengelompokan berdasarkan tanggal */}
                    <div className="flex items-center mt-3 md:mt-0 mb-6">
                        <label className="inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={groupByDate}
                                onChange={() => setGroupByDate(!groupByDate)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-700">Kelompokkan per Hari</span>
                        </label>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loading />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak Ada Pesanan</h3>
                            <p className="text-gray-500">
                                {activeTab === "all" 
                                    ? "Belum ada pesanan yang masuk" 
                                    : `Tidak ada pesanan dengan status "${activeTab}"`}
                            </p>
                        </div>
                    ) : groupByDate ? (
                        // Tampilkan pesanan yang dikelompokkan berdasarkan tanggal
                        <div className="space-y-8">
                            {sortedDates.map(dateKey => (
                                <div key={dateKey} className="space-y-4">
                                    <div className="sticky top-0 z-10 bg-gray-50 py-2">
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {dateKey} <span className="ml-2 text-sm font-normal text-gray-500">({groupedOrders[dateKey].length} pesanan)</span>
                                        </h2>
                                    </div>
                                    
                                    {groupedOrders[dateKey].map((order, index) => {
                                        // Format tanggal dan waktu
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
                                        
                                        // Hitung total pesanan (tanpa pajak)
                                        const orderTotal = calculateOrderTotal(order.items);
                                        
                                        return (
                                            <div
                                                key={index}
                                                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                                            >
                                                {/* Header pesanan dengan status */}
                                                <div className={`px-6 py-3 flex justify-between items-center ${getStatusColor(order.status)}`}>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{getStatusIcon(order.status)}</span>
                                                        <span className="font-medium">{order.status || "Menunggu Konfirmasi"}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        Order ID: {order.orderId || order._id.substring(0, 8)}
                                                    </div>
                                                </div>
                                                
                                                {/* Konten pesanan */}
                                                <div className="p-6">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {/* Informasi produk */}
                                                        <div className="flex-1">
                                                            <div className="flex gap-4">
                                                                {/* Mengganti tampilan gambar tunggal dengan tampilan multi gambar */}
                                                                <div className="flex -space-x-2 relative">
                                                                    {order.items.slice(0, 2).map((item, idx) => (
                                                                        <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border bg-gray-50 shadow-sm">
                                                                            <Image
                                                                                src={item?.product?.image[0] || assets.box_icon}
                                                                                alt={item?.product?.name || "Produk"}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    {order.items.length > 2 && (
                                                                        <div className="absolute -right-3 -bottom-3 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-medium shadow-md">
                                                                            +{order.items.length - 2}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <h3 className="font-medium text-gray-900">
                                                                            {order.items[0]?.product?.name || "Produk Tidak Dikenal"}
                                                                            {order.items.length > 1 && ` & ${order.items.length - 1} item lainnya`}
                                                                        </h3>
                                                                        <button 
                                                                            onClick={() => toggleOrderDetails(order._id)}
                                                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center"
                                                                        >
                                                                            {expandedOrders[order._id] ? (
                                                                                <>
                                                                                    <span>Sembunyikan Detail</span>
                                                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                                                    </svg>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <span>Lihat Detail</span>
                                                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                                    </svg>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    {/* Detail pesanan yang dapat di-expand */}
                                                                    {expandedOrders[order._id] ? (
                                                                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                                                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Pesanan:</h4>
                                                                            <div className="space-y-2">
                                                                                {order.items.map((item, idx) => (
                                                                                    <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-medium">
                                                                                                {item.quantity}
                                                                                            </span>
                                                                                            <div>
                                                                                                <span className="text-gray-700">{item.product?.name || "Produk tidak ditemukan"}</span>
                                                                                                {item.product?.description && (
                                                                                                    <p className="text-xs text-gray-500 mt-0.5">{item.product.description.substring(0, 60)}{item.product.description.length > 60 ? '...' : ''}</p>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                            <div className="text-gray-600">
                                                                                                {currency}{((item.product?.offerPrice || item.product?.price) * item.quantity).toLocaleString()}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-500">
                                                                                                {currency}{(item.product?.offerPrice || item.product?.price).toLocaleString()} x {item.quantity}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-2 mt-1 mb-3">
                                                                            {order.items.slice(0, 2).map((item, idx) => (
                                                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-medium">
                                                                                            {item.quantity}
                                                                                        </span>
                                                                                        <span className="text-gray-700">{item.product?.name || "Produk tidak ditemukan"}</span>
                                                                                    </div>
                                                                                    <span className="text-gray-600">
                                                                                        {currency}{((item.product?.offerPrice || item.product?.price) * item.quantity).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                            {order.items.length > 2 && (
                                                                                <div className="text-xs text-gray-500 italic">
                                                                                    + {order.items.length - 2} item lainnya...
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                                        <div className="flex justify-between items-center text-sm">
                                                                            <span className="font-medium text-gray-700">Total Pesanan:</span>
                                                                            <span className="font-bold text-emerald-600">
                                                                                {currency}{orderTotal.toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Informasi waktu dan aksi */}
                                                        <div className="md:w-64 flex flex-col justify-between">
                                                            <div className="text-sm text-gray-500 space-y-1">
                                                                <div className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span>{formattedDate}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span>{formattedTime}</span>
                                                                </div>
                                                                {order.statusUpdatedAt && (
                                                                    <div className="flex items-center">
                                                                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                                        </svg>
                                                                        <span>Diperbarui: {new Date(order.statusUpdatedAt).toLocaleTimeString('id-ID')}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Dropdown untuk mengubah status */}
                                                            <div className="mt-4">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                                                <div className="relative">
                                                                    <select 
                                                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                                                                        value={order.status || "Menunggu Konfirmasi"}
                                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                                        disabled={updatingOrderId === order._id}
                                                                    >
                                                                        <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                                                                        <option value="Sedang Disiapkan">Sedang Disiapkan</option>
                                                                        <option value="Sudah Siap">Sudah Siap</option>
                                                                        <option value="Selesai">Selesai</option>
                                                                        <option value="Dibatalkan">Dibatalkan</option>
                                                                    </select>
                                                                    {updatingOrderId === order._id && (
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
                                                                            <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Tampilkan pesanan tanpa pengelompokan (tampilan asli)
                        <div className="space-y-4">
                            {filteredOrders.map((order, index) => {
                                // Format tanggal dan waktu
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
                                
                                // Hitung total pesanan (tanpa pajak)
                                const orderTotal = calculateOrderTotal(order.items);
                                
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                                    >
                                        {/* Header pesanan dengan status */}
                                        <div className={`px-6 py-3 flex justify-between items-center ${getStatusColor(order.status)}`}>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{getStatusIcon(order.status)}</span>
                                                <span className="font-medium">{order.status || "Menunggu Konfirmasi"}</span>
                                            </div>
                                            <div className="text-sm">
                                                Order ID: {order.orderId || order._id.substring(0, 8)}
                                            </div>
                                        </div>
                                        
                                        {/* Konten pesanan */}
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Informasi produk */}
                                                <div className="flex-1">
                                                    <div className="flex gap-4">
                                                        {/* Mengganti tampilan gambar tunggal dengan tampilan multi gambar */}
                                                        <div className="flex -space-x-2 relative">
                                                            {order.items.slice(0, 2).map((item, idx) => (
                                                                <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border bg-gray-50 shadow-sm">
                                                                    <Image
                                                                        src={item?.product?.image[0] || assets.box_icon}
                                                                        alt={item?.product?.name || "Produk"}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                            {order.items.length > 2 && (
                                                                <div className="absolute -right-3 -bottom-3 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-medium shadow-md">
                                                                    +{order.items.length - 2}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h3 className="font-medium text-gray-900">
                                                                    {order.items[0]?.product?.name || "Produk Tidak Dikenal"}
                                                                    {order.items.length > 1 && ` & ${order.items.length - 1} item lainnya`}
                                                                </h3>
                                                                <button 
                                                                    onClick={() => toggleOrderDetails(order._id)}
                                                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center"
                                                                >
                                                                    {expandedOrders[order._id] ? (
                                                                        <>
                                                                            <span>Sembunyikan Detail</span>
                                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                                            </svg>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span>Lihat Detail</span>
                                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                            </svg>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            
                                                            {/* Detail pesanan yang dapat di-expand */}
                                                            {expandedOrders[order._id] ? (
                                                                <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Pesanan:</h4>
                                                                    <div className="space-y-2">
                                                                        {order.items.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-medium">
                                                                                        {item.quantity}
                                                                                    </span>
                                                                                    <div>
                                                                                        <span className="text-gray-700">{item.product?.name || "Produk tidak ditemukan"}</span>
                                                                                        {item.product?.description && (
                                                                                            <p className="text-xs text-gray-500 mt-0.5">{item.product.description.substring(0, 60)}{item.product.description.length > 60 ? '...' : ''}</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <div className="text-gray-600">
                                                                                        {currency}{((item.product?.offerPrice || item.product?.price) * item.quantity).toLocaleString()}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {currency}{(item.product?.offerPrice || item.product?.price).toLocaleString()} x {item.quantity}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2 mt-1 mb-3">
                                                                    {order.items.slice(0, 2).map((item, idx) => (
                                                                        <div key={idx} className="flex items-center justify-between text-sm">
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-medium">
                                                                                    {item.quantity}
                                                                                </span>
                                                                                <span className="text-gray-700">{item.product?.name || "Produk tidak ditemukan"}</span>
                                                                            </div>
                                                                            <span className="text-gray-600">
                                                                                {currency}{((item.product?.offerPrice || item.product?.price) * item.quantity).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                    {order.items.length > 2 && (
                                                                        <div className="text-xs text-gray-500 italic">
                                                                            + {order.items.length - 2} item lainnya...
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            
                                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="font-medium text-gray-700">Total Pesanan:</span>
                                                                    <span className="font-bold text-emerald-600">
                                                                        {currency}{orderTotal.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Informasi waktu dan aksi */}
                                                <div className="md:w-64 flex flex-col justify-between">
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>{formattedDate}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>{formattedTime}</span>
                                                        </div>
                                                        {order.statusUpdatedAt && (
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>Diperbarui: {new Date(order.statusUpdatedAt).toLocaleTimeString('id-ID')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Dropdown untuk mengubah status */}
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                                        <div className="relative">
                                                            <select 
                                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                                                                value={order.status || "Menunggu Konfirmasi"}
                                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                                disabled={updatingOrderId === order._id}
                                                            >
                                                                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                                                                <option value="Sedang Disiapkan">Sedang Disiapkan</option>
                                                                <option value="Sudah Siap">Sudah Siap</option>
                                                                <option value="Selesai">Selesai</option>
                                                                <option value="Dibatalkan">Dibatalkan</option>
                                                            </select>
                                                            {updatingOrderId === order._id && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
                                                                    <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;