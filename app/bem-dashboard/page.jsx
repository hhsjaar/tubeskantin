"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { FaRecycle, FaLeaf, FaCoins, FaChartLine, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaImage, FaTimes, FaArrowLeft, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
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
              Kelola program TrashBack dan berikan reward kepada mahasiswa yang berkontribusi untuk lingkungan kampus yang lebih bersih.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-6 md:px-16 lg:px-32 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-[#479C25]">
                  <FaRecycle size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalTrashback}</h3>
                  <p className="text-sm text-gray-500">Total TrashBack</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-[#479C25]">
                  <FaUser size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                  <p className="text-sm text-gray-500">Partisipan Aktif</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-[#479C25]">
                  <FaCoins size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalPromos}</h3>
                  <p className="text-sm text-gray-500">Promo Diberikan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="container mx-auto px-6 md:px-16 lg:px-32 mb-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-6 md:px-16 lg:px-32">
          {/* Detail View */}
          {detailView && selectedTrashback && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 md:p-8">
              <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
                  <button 
                    onClick={closeDetailView}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaArrowLeft className="text-gray-700" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">Detail TrashBack</h2>
                  <button 
                    onClick={closeDetailView}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaTimes className="text-gray-700" />
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Image Gallery */}
                  <div className="mb-6">
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                      <img 
                        src={imageGallery[currentImageIndex]} 
                        alt="Foto Sampah" 
                        className="w-full h-full object-contain"
                      />
                      
                      {imageGallery.length > 1 && (
                        <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 gap-2">
                          {imageGallery.map((_, index) => (
                            <button 
                              key={index} 
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {imageGallery.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {imageGallery.map((img, index) => (
                          <button 
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${index === currentImageIndex ? 'border-[#479C25]' : 'border-transparent'}`}
                          >
                            <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Detail Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
                          <FaRecycle />
                        </div>
                        <div>
  <h3 className="font-semibold text-gray-700">Jenis Sampah</h3>
  <p className="text-gray-900">
    {Array.isArray(selectedTrashback.sampah) 
      ? selectedTrashback.sampah.join(", ") 
      : selectedTrashback.sampah}
  </p>
</div>
</div>

<div className="flex items-start gap-3">
  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
    <FaLeaf />
  </div>
  <div>
    <h3 className="font-semibold text-gray-700">Jumlah</h3>
    <p className="text-gray-900">
      {Array.isArray(selectedTrashback.jumlahSampah)
        ? selectedTrashback.jumlahSampah.join(", ") + " buah"
        : selectedTrashback.jumlahSampah + " buah"}
    </p>
  </div>
</div>

                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Lokasi</h3>
                          <p className="text-gray-900">{selectedTrashback.lokasi}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedTrashback.catatan && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
                            <FaFileAlt />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-700">Catatan</h3>
                            <p className="text-gray-900 break-words">{selectedTrashback.catatan}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Tanggal</h3>
                          <p className="text-gray-900">
                            {new Date(selectedTrashback.createdAt).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
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
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#479C25] flex-shrink-0 mt-1">
                            <FaUser />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-700">Pengirim</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <img
                                src={selectedTrashback.userId.imageUrl || "/default-user.png"}
                                alt={selectedTrashback.userId.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-gray-900">{selectedTrashback.userId.name}</span>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Data TrashBack */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <FaRecycle className="text-[#479C25]" /> Data TrashBack Terbaru
              </h2>

              {loading && !bankSampahList.length && (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-[#479C25] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {!loading && bankSampahList.length === 0 && (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <FaRecycle className="mx-auto text-gray-300 text-4xl mb-4" />
                  <p className="text-gray-500">Belum ada data TrashBack.</p>
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
                        ${isSelected ? "bg-green-50 border-green-500 shadow-md" : "bg-white hover:shadow-md border-gray-100"}`}
                    >
                      <div className="relative group">
                         <img
    src={
      Array.isArray(item.fotoSampah)
        ? item.fotoSampah[0] || "/default-image.jpg"
        : item.fotoSampah || "/default-image.jpg"
    }
    alt="Foto Sampah"
    className="w-24 h-24 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
    onClick={(e) => {
      e.stopPropagation();
      showTrashbackDetail(item);
    }}
  />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <FaImage className="text-white text-xl" />
                        </div>
                      </div>
                      <div className="flex-1 text-sm sm:text-base text-gray-700">
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
                          <p className="text-xs text-gray-400">
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
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <FaCoins className="text-[#479C25]" /> Input Promo dari TrashBack
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Pilih TrashBack
                  </label>
                  <select
                    value={selectedBankSampahId}
                    onChange={(e) => setSelectedBankSampahId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300 bg-white"
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
                  <label className="block text-gray-700 font-medium mb-2">Kode Promo</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan Kode Promo"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nominal Promo (Rp)
                  </label>
                  <input
                    type="number"
                    value={promoValue}
                    onChange={(e) => setPromoValue(e.target.value)}
                    required
                    min={1}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#479C25] focus:border-transparent transition-all duration-300"
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
        </div>
      </div>
    </>
  );
}

// Image Gallery sudah mendukung multiple images, tidak perlu diubah
