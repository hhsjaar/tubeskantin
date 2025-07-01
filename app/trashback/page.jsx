"use client"; // Next.js app router CSR directive

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image"; // Import Image from next/image
import { assets } from "@/assets/assets";

export default function BankSampahPage() {
  const [bankSampahData, setBankSampahData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [sampahList, setSampahList] = useState([
    { sampah: "", jumlahSampah: 1 },
  ]);
  const [lokasi, setLokasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [fotoSampah, setFotoSampah] = useState([]);

  // Ambil data Bank Sampah

  // Handle form submit
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        alert("Data berhasil ditambahkan!");
        // Reset form
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

  // Handle foto upload
  const handleFotoChange = (e) => {
    setFotoSampah([...e.target.files]);
  };

  // Handle Sampah and jumlahSampah
  const handleSampahChange = (index, field, value) => {
    const updatedSampahList = [...sampahList];
    updatedSampahList[index][field] = value;
    setSampahList(updatedSampahList);
  };

  // Add new Sampah entry
  const addSampah = () => {
    setSampahList([...sampahList, { sampah: "", jumlahSampah: 1 }]);
  };

  // Remove Sampah entry
  const removeSampah = (index) => {
    const updatedSampahList = sampahList.filter((_, i) => i !== index);
    setSampahList(updatedSampahList);
  };

  const imageSrc = assets.banksampah || null;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen justify-between p-10">
        {/* Left Side: Image */}
        <div className="flex-1 flex justify-center items-center">
          {assets.banksampah ? (
            <Image
              className="max-w-full h-auto rounded-md shadow-lg"
              src={assets.banksampah}
              alt="Bank Sampah"
              width={500}
              height={300}
            />
          ) : (
            <p>Image not available</p> // Optional placeholder
          )}
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-white p-6 rounded-md shadow-lg">
          <h1 className="text-2xl font-bold mb-4">TrashBack</h1>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sampah List with Dynamic Input */}
            {sampahList.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-base font-medium">Jenis Sampah</p>
                  <input
                    type="text"
                    value={item.sampah}
                    onChange={(e) =>
                      handleSampahChange(index, "sampah", e.target.value)
                    }
                    required
                    className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full"
                    placeholder="Jenis Sampah"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSampahChange(
                        index,
                        "jumlahSampah",
                        item.jumlahSampah - 1
                      )
                    }
                    className="px-3 py-1 bg-gray-300 rounded"
                    disabled={item.jumlahSampah <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.jumlahSampah}
                    onChange={(e) =>
                      handleSampahChange(
                        index,
                        "jumlahSampah",
                        Math.max(1, e.target.value)
                      )
                    }
                    className="outline-none py-2 px-3 rounded border border-gray-500/40 w-16"
                    min={1}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleSampahChange(
                        index,
                        "jumlahSampah",
                        item.jumlahSampah + 1
                      )
                    }
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSampah(index)}
                  className="text-red-500"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSampah}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Tambah Jenis Sampah
            </button>

            {/* Lokasi */}
            <div>
              <p className="text-base font-medium">Lokasi</p>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
                className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full"
              >
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
              <p className="text-base font-medium">Catatan (opsional)</p>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full resize-none"
                rows={3}
              />
            </div>

            {/* Foto Sampah */}
            <div>
              <p className="text-base font-medium">Foto Sampah</p>
              <div className="mt-2 flex items-start gap-4 flex-wrap">
  {/* Upload Box */}
  <label htmlFor="fotoSampah" className="cursor-pointer">
    <input
      type="file"
      id="fotoSampah"
      accept="image/*"
      onChange={handleFotoChange}
      multiple
      required
      hidden
    />
    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex justify-center items-center">
      <p className="text-gray-500 text-sm">Upload</p>
    </div>
  </label>

  {/* Preview Images */}
  <div className="flex flex-wrap gap-3">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded"
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
