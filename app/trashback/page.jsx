"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";

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

    if (!lokasi || !fotoSampah.length) {
      alert("Mohon isi semua field yang diperlukan.");
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
        alert("Data berhasil ditambahkan!");
        setSampahList([{ sampah: "", jumlahSampah: 1 }]);
        setLokasi("");
        setCatatan("");
        setFotoSampah([]);
      } else {
        alert(data.message || "Gagal mengirim data");
      }
    } catch (err) {
      alert(err.message || "Terjadi kesalahan");
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
      <div className="min-h-screen px-4 py-10 md:px-10 flex flex-col lg:flex-row gap-10">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          {assets.banksampah ? (
            <Image
              src={assets.banksampah}
              alt="Bank Sampah"
              width={500}
              height={300}
              className="max-w-full h-auto rounded-md shadow-lg"
            />
          ) : (
            <p>Image not available</p>
          )}
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-md shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">TrashBack</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dynamic Sampah Input */}
            {sampahList.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center gap-3">
                <input
                  type="text"
                  value={item.sampah}
                  onChange={(e) => handleSampahChange(index, "sampah", e.target.value)}
                  required
                  className="flex-1 py-2 px-3 rounded border border-gray-400 w-full"
                  placeholder="Jenis Sampah"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={item.jumlahSampah <= 1}
                    onClick={() =>
                      handleSampahChange(index, "jumlahSampah", item.jumlahSampah - 1)
                    }
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.jumlahSampah}
                    onChange={(e) =>
                      handleSampahChange(index, "jumlahSampah", Math.max(1, +e.target.value))
                    }
                    className="w-16 text-center border rounded py-1"
                    min={1}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleSampahChange(index, "jumlahSampah", item.jumlahSampah + 1)
                    }
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSampah(index)}
                  className="text-red-500 text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSampah}
              className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded"
            >
              Tambah Jenis Sampah
            </button>

            {/* Lokasi */}
            <div>
              <label className="block mb-1 font-medium">Lokasi</label>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
                className="w-full py-2 px-3 border border-gray-400 rounded"
              >
                <option value="" disabled>Pilih Lokasi</option>
                <option value="Kantin Teknik">Kantin Teknik</option>
                <option value="Kantin Kodok">Kantin Kodok</option>
                <option value="Kantin Telkom">Kantin Telkom</option>
                <option value="Kantin Sipil">Kantin Sipil</option>
                <option value="Kantin TN 1">Kantin TN 1</option>
                <option value="Kantin TN 2">Kantin TN 2</option>
                <option value="Kantin TN 3">Kantin TN 3</option>
              </select>
            </div>

            {/* Catatan */}
            <div>
              <label className="block mb-1 font-medium">Catatan (opsional)</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full py-2 px-3 border border-gray-400 rounded resize-none"
                rows={3}
              />
            </div>

            {/* Foto Upload */}
            <div>
              <label className="block mb-2 font-medium">Foto Sampah</label>
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
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex justify-center items-center">
                    <p className="text-gray-500 text-sm">Upload</p>
                  </div>
                </label>

                {fotoSampah.map((file, index) => (
                  <div key={index} className="w-24 h-24 relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded font-medium"
            >
              {loading ? "Mengirim..." : "Kirim Data"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
