"use client"; // Next.js app router CSR directive

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BankSampahPage() {
  const [bankSampahData, setBankSampahData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [sampah, setSampah] = useState("");
  const [jumlahSampah, setJumlahSampah] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [fotoSampah, setFotoSampah] = useState(null);

  // Ambil data Bank Sampah
  const fetchBankSampahData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/bank-sampah");
      if (data.success) {
        setBankSampahData(data.bankSampah);
      } else {
        setError(data.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBankSampahData();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sampah || !jumlahSampah || !lokasi || !fotoSampah) {
      alert("Mohon isi semua field yang diperlukan.");
      return;
    }

    const formData = new FormData();
    formData.append("sampah", sampah);
    formData.append("jumlahSampah", jumlahSampah);
    formData.append("lokasi", lokasi);
    formData.append("catatan", catatan);
    formData.append("fotoSampah", fotoSampah);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/bank-sampah", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        alert("Data berhasil ditambahkan!");
        // Reset form
        setSampah("");
        setJumlahSampah("");
        setLokasi("");
        setCatatan("");
        setFotoSampah(null);
        // Refresh data
        fetchBankSampahData();
      } else {
        alert(data.message || "Gagal mengirim data");
      }
    } catch (err) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Bank Sampah</h1>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Jenis Sampah</label>
          <input
            type="text"
            value={sampah}
            onChange={(e) => setSampah(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Jumlah Sampah (kg)</label>
          <input
            type="number"
            value={jumlahSampah}
            onChange={(e) => setJumlahSampah(e.target.value)}
            required
            min={0}
            step="0.01"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Lokasi</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Catatan (opsional)</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Foto Sampah</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoSampah(e.target.files[0])}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Data"}
        </button>
      </form>

      {/* Display List */}
      <h2 className="text-xl font-semibold mb-4">Data Bank Sampah Terbaru</h2>

      {loading && !bankSampahData.length && <p>Loading data...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && bankSampahData.length === 0 && <p>Belum ada data.</p>}

      <ul className="space-y-4">
        {bankSampahData.map((item) => (
          <li key={item._id} className="border rounded p-4 flex gap-4 items-center">
            <img
              src={item.fotoSampah}
              alt="Foto Sampah"
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex flex-col gap-1">
              <p><strong>Jenis Sampah:</strong> {item.sampah}</p>
              <p><strong>Jumlah:</strong> {item.jumlahSampah} kg</p>
              <p><strong>Lokasi:</strong> {item.lokasi}</p>
              {item.catatan && <p><strong>Catatan:</strong> {item.catatan}</p>}

              {/* Tampilkan info user yang submit (populate) */}
              {item.userId && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <img
                    src={item.userId.imageUrl}
                    alt={item.userId.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>Dikirim oleh: {item.userId.name}</span>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Dikirim: {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
