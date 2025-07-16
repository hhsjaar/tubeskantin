"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

import Loading from "@/components/Loading";

const EditProduct = () => {
  const { getToken } = useAppContext();
  const { id } = useParams();
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(true); // ubah ke false kalau ingin muncul


  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Makanan Berat");
  const [kantin, setKantin] = useState("Kantin Berkah");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const product = data.product;

          setName(product.name || "");
          setDescription(product.description || "");
          setCategory(product.category || "Makanan Berat");
          setKantin(product.kantin || "Kantin Berkah");
          setPrice(product.price || "");
          setOfferPrice(product.offerPrice || "");
          setPortionSize(product.portionSize || "");
          
          if (product.images && Array.isArray(product.images)) {
            setFiles(product.images); // Jika image berupa URL string
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("kantin", kantin);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("portionSize", portionSize);

    for (let i = 0; i < files.length; i++) {
      if (files[i] instanceof File) {
        formData.append("images", files[i]);
      }
    }

    try {
      const token = await getToken();
      const res = await axios.put(`/api/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Produk berhasil diperbarui");
        router.push("/berkah/product-list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Gagal memperbarui produk");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#479C25]/90 to-[#3a7d1f]/80 rounded-xl p-6 mb-8 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Edit Produk</h1>
            <p className="mt-2 opacity-80">Perbarui informasi produk Anda</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Foto Produk */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">Foto Produk</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <label
                      key={index}
                      htmlFor={`image${index}`}
                      className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors flex items-center justify-center aspect-square"
                    >
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...files];
                          updatedFiles[index] = e.target.files[0];
                          setFiles(updatedFiles);
                        }}
                        type="file"
                        id={`image${index}`}
                        className="hidden"
                        accept="image/*"
                      />
                      {files[index] ? (
                        <Image
                          src={
                            files[index] instanceof File
                              ? URL.createObjectURL(files[index])
                              : files[index]
                          }
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">Klik untuk upload</p>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Informasi Produk */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">Informasi Produk</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Produk
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      placeholder="Masukkan nama produk"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      id="category"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Makanan Berat">Makanan Berat</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Gorengan">Gorengan</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Produk
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Deskripsikan produk Anda"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Harga dan Detail */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">Harga dan Detail</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="kantin" className="block text-sm font-medium text-gray-700 mb-1">
                      Kantin
                    </label>
                    <input
                      type="text"
                      id="kantin"
                      className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm cursor-not-allowed"
                      value={kantin}
                      readOnly
                    />
                  </div>

                  <div className={isHidden ? "hidden" : ""}>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga Asli
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        className="block w-full pl-10 pr-12 rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga 
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        id="offerPrice"
                        className="block w-full pl-10 pr-12 rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        placeholder="0"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="portionSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Ukuran Porsi
                    </label>
                    <input
                      type="text"
                      id="portionSize"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Contoh: 250ml, 1 porsi"
                      value={portionSize}
                      onChange={(e) => setPortionSize(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => router.push('/berkah/product-list')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
