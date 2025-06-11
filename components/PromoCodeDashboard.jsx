"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PromoCodeDashboard() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state untuk input kode promo baru (biasanya hanya untuk admin/BEM)
  const [code, setCode] = useState("");
  const [nominal, setNominal] = useState("");
  const [description, setDescription] = useState("");
  const [expireAt, setExpireAt] = useState("");

  // Ambil promo user
  const fetchPromos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/promocodes");
      if (data.success) {
        setPromos(data.promos);
      } else {
        setError(data.message || "Gagal mengambil data promo");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Submit kode promo baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !nominal) {
      alert("Kode dan nominal harus diisi");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/promocodes", {
        code,
        nominal: Number(nominal),
        description,
        expireAt: expireAt ? new Date(expireAt).toISOString() : undefined,
      });

      if (data.success) {
        alert("Kode promo berhasil ditambahkan");
        setCode("");
        setNominal("");
        setDescription("");
        setExpireAt("");
        fetchPromos();
      } else {
        alert(data.message || "Gagal menambahkan kode promo");
      }
    } catch (err) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Dashboard Kode Promo BEM</h2>

      {/* Form input kode promo */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div>
          <label className="block mb-1 font-semibold">Kode Promo</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Contoh: BEM2025DISC"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Nominal Diskon (Rp)</label>
          <input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            required
            min={0}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Deskripsi (opsional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Misal: Diskon makan dari BEM"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Tanggal Expire (opsional)</label>
          <input
            type="date"
            value={expireAt}
            onChange={(e) => setExpireAt(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Tambah Kode Promo"}
        </button>
      </form>

      {/* List promo yang belum dipakai */}
      <h3 className="text-lg font-semibold mb-3">Kode Promo Anda</h3>

      {loading && promos.length === 0 && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && promos.length === 0 && <p>Tidak ada kode promo aktif.</p>}

      <ul className="space-y-3">
        {promos.map((promo) => (
          <li key={promo._id} className="border rounded p-3">
            <p>
              <strong>{promo.code}</strong> — Rp {promo.nominal.toLocaleString("id-ID")}
            </p>
            {promo.description && <p>{promo.description}</p>}
            {promo.expireAt && (
              <p className="text-sm text-gray-500">
                Expire: {new Date(promo.expireAt).toLocaleDateString("id-ID")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
