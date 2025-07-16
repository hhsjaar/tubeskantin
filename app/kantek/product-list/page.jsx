'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const kantekProducts = data.products.filter(
          (p) => p.kantin === "Kantin Teknik"
        );
        setProducts(kantekProducts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!confirm) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Produk berhasil dihapus");
        fetchSellerProduct(); // refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  // Filter produk berdasarkan kategori dan pencarian
  const filteredProducts = products
    .filter(product => {
      if (activeCategory === "all") return true;
      return product.category === activeCategory;
    })
    .filter(product => {
      if (!searchTerm.trim()) return true;
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // Mendapatkan kategori unik
  const categories = ["all", ...new Set(products.map(p => p.category))];

  // Statistik produk
  const productStats = {
    total: products.length,
    makananBerat: products.filter(p => p.category === "Makanan Berat").length,
    minuman: products.filter(p => p.category === "Minuman").length,
    gorengan: products.filter(p => p.category === "Gorengan").length,
    snack: products.filter(p => p.category === "Snack").length,
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <div className="flex-grow p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header dengan statistik */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-80">Total Produk</p>
                  <p className="text-2xl font-bold">{productStats.total}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-80">Makanan Berat</p>
                  <p className="text-2xl font-bold">{productStats.makananBerat}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-80">Minuman</p>
                  <p className="text-2xl font-bold">{productStats.minuman}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-80">Gorengan</p>
                  <p className="text-2xl font-bold">{productStats.gorengan}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-80">Snack</p>
                  <p className="text-2xl font-bold">{productStats.snack}</p>
                </div>
              </div>
            </div>

            {/* Toolbar dengan pencarian dan tombol tambah */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => router.push('/kantek/page')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center w-full md:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Tambah Produk
              </button>
            </div>

            {/* Tab untuk filter kategori */}
            <div className="flex flex-wrap items-center mb-6 bg-white rounded-lg shadow p-3 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex-shrink-0 transition-all mr-2 ${activeCategory === category ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {category === "all" ? "Semua Kategori" : category}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak Ada Produk</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? `Tidak ada produk yang cocok dengan pencarian "${searchTerm}"`
                    : activeCategory !== "all"
                    ? `Tidak ada produk dalam kategori "${activeCategory}"`
                    : "Belum ada produk yang ditambahkan"}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produk
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                          Kategori
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-14 w-14 relative rounded-md overflow-hidden border border-gray-200">
                                <Image
                                  src={product.image[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-medium text-emerald-600">Rp{product.offerPrice.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => router.push(`/product/${product._id}`)}
                                className="text-emerald-600 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 p-2 rounded-full transition-colors"
                                title="Lihat"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => router.push(`/kantek/product-list/edit/${product._id}`)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                                title="Hapus"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
