"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BemPromoInput() {
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

    // Cari userId dari bank sampah yang dipilih
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
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Input Promo dari Bank Sampah</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Pilih Data Bank Sampah</label>
          <select
            value={selectedBankSampahId}
            onChange={(e) => setSelectedBankSampahId(e.target.value)}
            className="w-full border rounded px-3 py-2"
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
          <label className="block mb-1 font-semibold">Kode Promo</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nominal Promo (Rp)</label>
          <input
            type="number"
            value={promoValue}
            onChange={(e) => setPromoValue(e.target.value)}
            required
            min={1}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Tambahkan Promo"}
        </button>
      </form>
    </div>
  );
}
