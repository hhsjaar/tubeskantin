'use client'
import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import { useAppContext } from "@/context/AppContext";
import { FaArrowLeft, FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      
      {/* Hero Section dengan Gradient Hijau */}
      <div className="bg-gradient-to-br from-[#479C25]/90 to-[#3a7d1f]/80 text-white py-12 px-6 md:px-16 lg:px-32">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Keranjang Belanja</h1>
        <p className="text-white/80 max-w-2xl">Selesaikan pembelian Anda dan nikmati makanan lezat dengan dampak karbon yang rendah.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 py-10 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-[#479C25] to-[#3a7d1f] rounded-full"></span>
              <p className="text-2xl md:text-3xl text-gray-700 font-medium">
                Keranjang Anda
              </p>
            </div>
            <p className="text-lg md:text-xl px-4 py-1 bg-[#479C25]/10 text-[#479C25] rounded-full font-medium">{getCartCount()} Items</p>
          </div>
          
          {/* Cart Items */}
          {getCartCount() > 0 ? (
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full table-auto">
                  <thead className="text-left bg-gray-50/80">
                    <tr>
                      <th className="py-4 px-6 text-gray-600 font-medium text-sm uppercase tracking-wider">
                        Detail Produk
                      </th>
                      <th className="py-4 px-6 text-gray-600 font-medium text-sm uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="py-4 px-6 text-gray-600 font-medium text-sm uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="py-4 px-6 text-gray-600 font-medium text-sm uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.keys(cartItems).map((itemId) => {
                      const product = products.find(product => product._id === itemId);

                      if (!product || cartItems[itemId] <= 0) return null;

                      return (
                        <tr key={itemId} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="rounded-lg overflow-hidden bg-gray-100 p-2 h-20 w-20 flex items-center justify-center">
                                <Image
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="object-cover mix-blend-multiply"
                                  width={80}
                                  height={80}
                                />
                              </div>
                              <div>
                                <p className="text-gray-800 font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.kantin}</p>
                                <button
                                  className="mt-1 text-sm text-[#479C25] hover:text-[#3a7d1f] flex items-center gap-1"
                                  onClick={() => updateCartQuantity(product._id, 0)}
                                >
                                  <FaTrashAlt className="w-3 h-3" />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700 font-medium">Rp{product.offerPrice.toLocaleString()}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 w-fit">
                              <button 
                                onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#479C25] transition-colors"
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <input 
                                onChange={e => updateCartQuantity(product._id, Number(e.target.value))} 
                                type="number" 
                                value={cartItems[itemId]} 
                                className="w-10 text-center appearance-none outline-none bg-transparent"
                              />
                              <button 
                                onClick={() => addToCart(product._id)}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#479C25] transition-colors"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700 font-medium">Rp{(product.offerPrice * cartItems[itemId]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#479C25]/10 rounded-full flex items-center justify-center text-[#479C25]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800">Keranjang Anda Kosong</h3>
                <p className="text-gray-500 max-w-md">
                  Anda belum menambahkan produk apapun ke keranjang. Jelajahi menu kami untuk menemukan makanan lezat dan berkelanjutan.
                </p>
              </div>
            </div>
          )}
          
          <button 
            onClick={()=> router.push('/menu')} 
            className="group flex items-center mt-8 gap-2 text-[#479C25] hover:text-[#3a7d1f] font-medium transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Lanjutkan Belanja
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
