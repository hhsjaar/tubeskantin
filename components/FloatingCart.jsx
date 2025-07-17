'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FloatingCart = () => {
  const { getCartCount, getCartAmount, cartItems, products, updateCartQuantity, addToCart } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Jika berada di halaman cart, jangan tampilkan floating cart
  if (pathname === '/cart') {
    return null;
  }

  const cartCount = getCartCount();
  const totalAmount = getCartAmount();

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${cartCount > 0 ? 'animate-fade-in' : 'hidden'}`}>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-800 border border-[#479c26]/20 dark:border-green-500/20 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative group hover:scale-105 flex items-center gap-4"
      >
        <div className="flex items-center gap-3">
            <div className="relative">
              <Image src={assets.cart_icon} alt="cart" width={24} height={24} className="text-[#479c26] dark:invert" />
              <div className="absolute -top-2 -right-2 bg-[#479c26] dark:bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Rp {totalAmount.toLocaleString()}
            </div>
          </div>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 overflow-hidden transform transition-transform duration-300 ease-in-out animate-slide-up">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-gray-200">Keranjang Belanja</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {Object.keys(cartItems).length > 0 ? (
              Object.keys(cartItems).map((itemId) => {
                const product = products.find((p) => p._id === itemId);
                if (!product) return null;
                return (
                  <div key={itemId} className="flex items-center gap-3 border-b dark:border-gray-700 pb-3">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover mix-blend-multiply dark:mix-blend-normal"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rp {product.offerPrice.toLocaleString('id-ID')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => updateCartQuantity(itemId, cartItems[itemId] - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Image src={assets.decrease_arrow} alt="decrease" width={16} height={16} className="dark:invert" />
                        </button>
                        <span className="text-sm dark:text-gray-300">{cartItems[itemId]}</span>
                        <button 
                          onClick={() => addToCart(itemId)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Image src={assets.increase_arrow} alt="increase" width={16} height={16} className="dark:invert" />
                        </button>
                        <button 
                          onClick={() => updateCartQuantity(itemId, 0)}
                          className="ml-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">Keranjang kosong</p>
            )}
          </div>

          {Object.keys(cartItems).length > 0 && (
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium dark:text-gray-300">Total:</span>
                <span className="text-lg font-semibold text-[#479c26] dark:text-green-500">
                  Rp {totalAmount.toLocaleString()}
                </span>
              </div>
              <Link
                href="/cart"
                className="block w-full bg-[#479c26] dark:bg-green-600 text-white text-center py-2 rounded-md hover:bg-[#479c26]/90 dark:hover:bg-green-700 transition-colors duration-300"
              >
                Lihat Keranjang
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingCart;