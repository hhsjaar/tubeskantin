"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BemDashboard() {
  const [bankSampahList, setBankSampahList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError(data.message || "Gagal ambil data TrashBack");
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

    const bankSampah = bankSampahList.find((bs) => bs._id === selectedBankSampahId);
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
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-6">
        BEM Dashboard
      </h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* Layout Grid: 1 kolom di mobile, 2 kolom di desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Data TrashBack */}
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Data TrashBack Terbaru
          </h2>

          {loading && !bankSampahList.length && (
            <p className="text-gray-500">Memuat data...</p>
          )}
          {!loading && bankSampahList.length === 0 && (
            <p className="text-gray-500">Belum ada data.</p>
          )}

          <ul className="space-y-4 overflow-x-auto max-h-[70vh] pr-2">
  {bankSampahList.map((item) => {
    const isSelected = selectedBankSampahId === item._id;
    return (
      <li
        key={item._id}
        onClick={() => setSelectedBankSampahId(item._id)}
        className={`cursor-pointer border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 transition
          ${isSelected ? "bg-green-50 border-green-500 shadow-md" : "bg-white hover:shadow-md"}`}
      >
        <img
          src={item.fotoSampah || "/default-image.jpg"}
          alt="Foto Sampah"
          className="w-24 h-24 object-cover rounded-md border border-gray-300"
        />
        <div className="flex-1 text-sm sm:text-base text-gray-700">
          <p>
            <strong>Jenis Sampah:</strong>{" "}
            {Array.isArray(item.sampah) ? item.sampah.join(", ") : item.sampah}
          </p>
          <p>
            <strong>Jumlah:</strong> {item.jumlahSampah} kg
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
          <p className="text-xs text-gray-400 mt-2">
            Dikirim: {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      </li>
    );
  })}
</ul>

        </div>

        {/* Right Column - Form Promo */}
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Input Promo dari TrashBack
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">
                Pilih TrashBack
              </label>
              <select
                value={selectedBankSampahId}
                onChange={(e) => setSelectedBankSampahId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
              <label className="block text-gray-600 font-medium">Kode Promo</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Masukkan Kode Promo"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">
                Nominal Promo (Rp)
              </label>
              <input
                type="number"
                value={promoValue}
                onChange={(e) => setPromoValue(e.target.value)}
                required
                min={1}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Masukkan Nominal Promo"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded mt-2 hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Tambahkan Promo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
