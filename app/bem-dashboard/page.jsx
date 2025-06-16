"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BemDashboard() {
  const [bankSampahList, setBankSampahList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input promo
  const [selectedBankSampahId, setSelectedBankSampahId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoValue, setPromoValue] = useState("");

  const fetchBankSampah = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/bank-sampah");
      if (data.success) {
        setBankSampahList(data.bankSampah);
      } else {
        setError(data.message || "Gagal ambil data bank sampah");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankSampah();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBankSampahId || !promoCode || !promoValue) {
      alert("Mohon isi semua field promo.");
      return;
    }

    const bankSampah = bankSampahList.find(bs => bs._id === selectedBankSampahId);
    if (!bankSampah || !bankSampah.userId?._id) {
      alert("Data user tidak ditemukan.");
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
        alert("Promo berhasil ditambahkan.");
        setPromoCode("");
        setPromoValue("");
        setSelectedBankSampahId("");
      } else {
        alert(data.message || "Gagal menambahkan promo");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">BEM Dashboard</h1>

      {/* Error Handling */}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Bank Sampah List with Images */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Data Bank Sampah Terbaru</h2>

          {loading && !bankSampahList.length && <p>Loading data...</p>}
          {!loading && bankSampahList.length === 0 && <p>Belum ada data.</p>}

          <ul className="space-y-6">
            {bankSampahList.map((item) => (
              <li key={item._id} className="border rounded-lg p-6 flex gap-6 items-center bg-white shadow-md hover:shadow-lg transition duration-300">
                {/* Image of Bank Sampah */}
                <img
                  src={item.fotoSampah || "/default-image.jpg"}
                  alt="Foto Sampah"
                  className="w-24 h-24 object-cover rounded-md border-2 border-gray-300"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    <strong>Jenis Sampah:</strong> {item.sampah}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Jumlah:</strong> {item.jumlahSampah} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Lokasi:</strong> {item.lokasi}
                  </p>
                  {item.catatan && (
                    <p className="text-sm text-gray-600">
                      <strong>Catatan:</strong> {item.catatan}
                    </p>
                  )}

                  {/* User Info */}
                  {item.userId && (
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                      <img
                        src={item.userId.imageUrl || "/default-user.png"} // Default image if no user image
                        alt={item.userId.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>Dikirim oleh: {item.userId.name}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Dikirim: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Promo Input Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Promo dari Bank Sampah</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">Pilih Bank Sampah</label>
              <select
                value={selectedBankSampahId}
                onChange={(e) => setSelectedBankSampahId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
              >
                <option value="">-- Pilih --</option>
                {bankSampahList.map((bs) => (
                  <option key={bs._id} value={bs._id}>
                    {bs.sampah} - {bs.userId?.name || "Unknown User"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Kode Promo</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                placeholder="Masukkan Kode Promo"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Nominal Promo (Rp)</label>
              <input
                type="number"
                value={promoValue}
                onChange={(e) => setPromoValue(e.target.value)}
                required
                min={1}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                placeholder="Masukkan Nominal Promo"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Tambahkan Promo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
