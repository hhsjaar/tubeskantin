"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { FaLeaf, FaMapMarkerAlt, FaFileAlt, FaCamera, FaPlus, FaMinus, FaTrash, FaRecycle, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";

export default function BankSampahPage() {
  const [bankSampahData, setBankSampahData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sampahList, setSampahList] = useState([{ sampah: "", jumlahSampah: 1 }]);
  const [lokasi, setLokasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [fotoSampah, setFotoSampah] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!lokasi || sampahList.some(item => !item.sampah) || fotoSampah.length === 0) {
      toast.error("Mohon isi semua field yang diperlukan.");
      return;
    }
  
    const formData = new FormData();
    sampahList.forEach((item) => {
      formData.append("sampah", item.sampah);
      formData.append("jumlahSampah", item.jumlahSampah);
    });
    formData.append("lokasi", lokasi);
    formData.append("catatan", catatan);
    fotoSampah.forEach((file) => {
      formData.append("fotoSampah", file);
    });
  
    try {
      setLoading(true);
      const { data } = await axios.post("/api/bank-sampah", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (data.success) {
        toast.success("Data berhasil ditambahkan!");
        setSampahList([{ sampah: "", jumlahSampah: 1 }]);
        setLokasi("");
        setCatatan("");
        setFotoSampah([]);
      } else {
        toast.error(data.message || "Gagal mengirim data");
      }
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = (e) => {
    setFotoSampah([...e.target.files]);
  };

  const handleSampahChange = (index, field, value) => {
    const updated = [...sampahList];
    updated[index][field] = value;
    setSampahList(updated);
  };

  const addSampah = () => {
    setSampahList([...sampahList, { sampah: "", jumlahSampah: 1 }]);
  };

  const removeSampah = (index) => {
    const updated = sampahList.filter((_, i) => i !== index);
    setSampahList(updated);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Hero Section with Enhanced Gradient */}
        <div className="relative bg-gradient-to-br from-[#479C25] via-[#3f8a20] to-[#3a7d1f] dark:from-[#2d6317] dark:via-[#245213] dark:to-[#1f4011] py-16 px-6 md:px-16 lg:px-32 rounded-b-3xl shadow-lg dark:shadow-green-900/40 overflow-hidden mb-10 transition-all duration-300">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-5"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-br from-[#3a7d1f] to-[#479C25] dark:from-[#2d6317] dark:to-[#1f4011] rounded-full filter blur-3xl opacity-30 dark:opacity-40"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-bl from-[#479C25] to-[#3a7d1f] dark:from-[#1f4011] dark:to-[#2d6317] rounded-full filter blur-3xl opacity-30 dark:opacity-40"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <FaRecycle className="inline-block" /> TrashBack
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Daur ulang sampah Anda dan dapatkan reward! Program peduli lingkungan untuk kampus yang lebih bersih dan hijau.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 lg:px-32 py-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Image with Card Effect */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {assets.banksampah ? (
                  <div className="relative">
                    <Image
                      src={assets.banksampah}
                      alt="Bank Sampah"
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Program TrashBack</h2>
                        <p className="text-sm text-gray-200">
                          Inisiatif untuk mengurangi sampah di lingkungan kampus melalui sistem reward
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Image not available</p>
                  </div>
                )}
              </div>

              {/* Info Cards with Enhanced Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 shadow-md dark:shadow-green-900/20 border border-green-100 dark:border-green-900/20 hover:shadow-lg dark:hover:shadow-green-900/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 mb-3">
                    <FaLeaf />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Ramah Lingkungan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Berkontribusi dalam mengurangi sampah dan polusi lingkungan</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 shadow-md dark:shadow-green-900/20 border border-green-100 dark:border-green-900/20 hover:shadow-lg dark:hover:shadow-green-900/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#479C25] dark:text-green-400 mb-3">
                    <FaRecycle />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Dapatkan Reward</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tukarkan sampah daur ulang Anda dengan berbagai reward menarik</p>
                </div>
              </div>
            </div>

            {/* Right: Form with Enhanced Glass Effect */}
            <div className="w-full lg:w-1/2">
              <div className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl dark:shadow-green-900/20 border border-gray-100 dark:border-green-900/20">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <FaRecycle className="text-[#479C25] dark:text-green-400" /> Form TrashBack
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dynamic Sampah Input with Enhanced Design */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FaTrash className="text-[#479C25] dark:text-green-400" /> Jenis Sampah
                    </label>
                    
                    {sampahList.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-100/50 dark:border-green-900/20 transition-all duration-300 hover:shadow-md dark:hover:shadow-green-900/30 group"
                      >
                        <input
                          type="text"
                          value={item.sampah}
                          onChange={(e) => handleSampahChange(index, "sampah", e.target.value)}
                          required
                          className="flex-1 py-2.5 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-[#479C25] dark:focus:ring-green-500 transition-all duration-300"
                          placeholder="Jenis Sampah"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={item.jumlahSampah <= 1}
                            onClick={() =>
                              handleSampahChange(index, "jumlahSampah", item.jumlahSampah - 1)
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${item.jumlahSampah <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            <FaMinus size={12} />
                          </button>
                          <input
                            type="number"
                            value={item.jumlahSampah}
                            onChange={(e) =>
                              handleSampahChange(index, "jumlahSampah", Math.max(1, +e.target.value))
                            }
                            className="w-16 text-center border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#479C25]"
                            min={1}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSampahChange(index, "jumlahSampah", item.jumlahSampah + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSampah(index)}
                          className="text-red-500 hover:text-red-700 transition-all duration-300 p-2 rounded-full hover:bg-red-50"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSampah}
                      className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-br from-[#479C25] via-[#3f8a20] to-[#3a7d1f] dark:from-[#2d6317] dark:via-[#245213] dark:to-[#1f4011] text-white rounded-lg shadow-md hover:shadow-lg dark:shadow-green-900/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95"
                    >
                      <FaPlus size={12} /> Tambah Jenis Sampah
                    </button>
                  </div>

                  {/* Lokasi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-[#479C25] dark:text-green-400" /> Lokasi
                    </label>
                    <select
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      required
                      className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479C25] dark:focus:ring-green-500 transition-all duration-300"
                    >
                      <option value="" disabled>Pilih Lokasi</option>
                      <option value="Kantin Teknik">Kantin Teknik</option>
                      <option value="Kantin Kodok">Kantin Kodok</option>
                      <option value="Kantin Telkom">Kantin Telkom</option>
                      <option value="Kantin Sipil">Kantin Sipil</option>
                      <option value="Kantin TN 1">Kantin Berkah</option>
                      <option value="Kantin TN 2">Kantin Tata Niaga</option>
                      <option value="Kantin TN 3">Kantin Tania Mart</option>
                    </select>
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <FaFileAlt className="text-[#479C25]" /> Catatan (opsional)
                    </label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#479C25] transition-all duration-300"
                      rows={3}
                      placeholder="Tambahkan catatan atau deskripsi tentang sampah yang Anda kumpulkan"
                    />
                  </div>

                  {/* Foto Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                      <FaCamera className="text-[#479C25] dark:text-green-400" /> Foto Sampah
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label htmlFor="fotoSampah" className="cursor-pointer">
                        <input
                          type="file"
                          id="fotoSampah"
                          accept="image/*"
                          multiple
                          required
                          hidden
                          onChange={handleFotoChange}
                        />
                        <div className="w-28 h-28 border-2 border-dashed border-[#479C25]/40 rounded-xl flex flex-col justify-center items-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 group">
                          <FaUpload className="text-[#479C25] dark:text-green-400 mb-2 group-hover:scale-110 transition-all duration-300" />
                          <p className="text-[#479C25] dark:text-green-400 text-sm font-medium">Upload</p>
                        </div>
                      </label>

                      {fotoSampah.map((file, index) => (
                        <div key={index} className="w-28 h-28 relative rounded-xl overflow-hidden shadow-md dark:shadow-green-900/30 group hover:shadow-lg dark:hover:shadow-green-900/40 transition-all duration-300 hover:scale-105">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300"></div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Upload foto sampah yang akan Anda kumpulkan</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-[#479C25] via-[#3f8a20] to-[#3a7d1f] dark:from-[#2d6317] dark:via-[#245213] dark:to-[#1f4011] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg dark:shadow-green-900/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <FaRecycle className="transform group-hover:rotate-180 transition-transform duration-300" />
                        <span>Kirim Data</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
// Foto Upload section sudah mendukung multiple upload, tidak perlu diubah