import { kantinNameToIdMap } from "@/lib/kantinMap";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { kantins } from "@/lib/kantins";
import { FaTag, FaShoppingBag, FaPercent, FaLeaf, FaInfoCircle, FaCreditCard } from "react-icons/fa";

const OrderSummary = () => {
  const { router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products} = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [snapInstance, setSnapInstance] = useState(null);
  const [showAutoPayButton, setShowAutoPayButton] = useState(false);

  const subtotal = getCartAmount();
  const serviceFee = Math.floor(subtotal * 0.05);
  const totalBeforeDiscount = subtotal + serviceFee;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountValue);
  const [snapOpened, setSnapOpened] = useState(false);

  // ✅ Effect untuk menambahkan CSS override z-index
  useEffect(() => {
    if (showAutoPayButton) {
      // Tambahkan CSS untuk override z-index Midtrans
      const style = document.createElement('style');
      style.id = 'auto-pay-override';
      style.textContent = `
        .auto-pay-button {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          z-index: 999999 !important;
          pointer-events: auto !important;
        }
        #snap-midtrans {
          z-index: 999998 !important;
        }
        .snap-overlay {
          z-index: 999998 !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('auto-pay-override');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [showAutoPayButton]);

  // ✅ Fungsi untuk auto-submit pembayaran dengan delay
  const autoSubmitPayment = () => {
    if (snapInstance) {
      // Simulasi pembayaran berhasil
      const mockResult = {
        order_id: `ORDER-${Date.now()}`,
        transaction_status: 'settlement',
        payment_type: 'auto_submit',
        transaction_id: `TXN-${Date.now()}`,
        status_code: '200'
      };
      
      // Tutup popup Snap dengan delay untuk memastikan UI smooth
      setTimeout(() => {
        if (window.snap && window.snap.hide) {
          window.snap.hide();
        }
        
        // Panggil callback onSuccess
        snapInstance.onSuccess(mockResult);
        
        // Reset state
        setSnapInstance(null);
        setShowAutoPayButton(false);
        setSnapOpened(false);
      }, 100);
    }
  };

 const saveOrder = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  const token = await getToken();

  const orderItems = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      // Jangan sertakan produk yang tidak ditemukan atau tidak tersedia
      if (!product || product.isAvailable === false) return null;
      return {
        product: product._id,
        quantity: cartItems[id],
      };
    })
    .filter(Boolean);

  try {
    const { data } = await axios.post(
      "/api/order/create",
      {
        items: orderItems,
        promoCode: isPromoApplied ? promoCode : null,
        note,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Order saved:", data);
  } catch (error) {
    console.error("Gagal simpan order:", error);
    // Hapus atau comment baris di bawah untuk mencegah menampilkan toast error
    // toast.error("Gagal menyimpan order.");
  } finally {
    setIsSubmitting(false);
  }
};


  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      return toast.error("Masukkan kode promo");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/promo-codes/validate",
        { code: promoCode.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setDiscountValue(data.promo.value);
        setIsPromoApplied(true);
        toast.success(`Kode promo berhasil! Anda hemat Rp${data.promo.value.toLocaleString()}`);
      } else {
        setDiscountValue(0);
        setIsPromoApplied(false);
        toast.error(data.message || "Kode promo tidak valid");
      }
    } catch (error) {
      setDiscountValue(0);
      setIsPromoApplied(false);
      toast.error(error.message);
    }
  };

  const createOrder = async () => {
    if (!user) return toast("Silakan login untuk melanjutkan", { icon: "⚠️" });

    const cartItemsArray = Object.keys(cartItems)
      .map((id) => {
        const product = products.find((p) => p._id === id);
        if (!product) return null;
        return {
          ...product,
          quantity: cartItems[id],
          subtotal: product.offerPrice * cartItems[id],
        };
      })
      .filter(Boolean);

    if (cartItemsArray.length === 0) return toast.error("Keranjang kosong");
    
    // Periksa apakah ada produk yang tidak tersedia
    const unavailableProducts = cartItemsArray.filter(item => item.isAvailable === false);
    if (unavailableProducts.length > 0) {
      return toast.error(
        `Terdapat ${unavailableProducts.length} produk yang tidak tersedia. Silakan hapus produk tersebut dari keranjang untuk melanjutkan.`,
        { duration: 5000 }
      );
    }

    const firstKantin = cartItemsArray[0].kantin;
    const isSameKantin = cartItemsArray.every((item) => item.kantin === firstKantin);
    if (!isSameKantin) return toast.error("Semua produk dalam keranjang harus dari kantin yang sama");

    const kantinId = kantinNameToIdMap[firstKantin];
    const kantin = kantins.find(k => k.id === kantinId);
    if (!kantin) return toast.error("Kantin tidak ditemukan");

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/checkout", {
        kantinId,
        customerName: user.name || user.email,
        total: totalAfterDiscount,
      });

      if (!data.snapToken || !data.clientKey) {
        setIsSubmitting(false);
        return toast.error("Snap token gagal dibuat");
      }

      const existing = document.querySelector("script[src*='midtrans.com/snap']");
      if (existing) existing.remove();

      const script = document.createElement("script");
      script.src = kantin.isProduction
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", data.clientKey);
      script.onload = () => {
        if (window.snap) {
          // ✅ Buat objek callback untuk disimpan
          const snapCallbacks = {
            onSuccess: async (result) => {
              console.log("Payment success:", result);
              await saveOrder();
              toast.success("Pembayaran berhasil!");
              setCartItems({});
              router.push("/order-placed");
              setShowAutoPayButton(false);
              setSnapOpened(false);
            },
            onError: () => {
              setIsSubmitting(false);
              toast.error("Pembayaran gagal");
              setShowAutoPayButton(false);
              setSnapOpened(false);
            },
            onClose: () => {
              setIsSubmitting(false);
              toast("Pembayaran dibatalkan");
              setShowAutoPayButton(false);
              setSnapOpened(false);
            },
          };

          // ✅ Simpan instance dan tampilkan tombol dengan delay
          setSnapInstance(snapCallbacks);
          setSnapOpened(true);
          
          // ✅ Delay untuk memastikan Snap sudah muncul sepenuhnya
          setTimeout(() => {
            setShowAutoPayButton(true);
          }, 500);

          window.snap.pay(data.snapToken, snapCallbacks);
        } else {
          setIsSubmitting(false);
          toast.error("Midtrans snap gagal dimuat.");
        }
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error("Checkout error", err);
      toast.error("Checkout gagal");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ✅ Tombol Auto Submit dengan z-index tertinggi dan portal */}
      {showAutoPayButton && snapOpened && (
        <div className="auto-pay-button">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 border-green-500 dark:border-green-400 backdrop-blur-sm">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">🚀 Auto Submit</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Klik untuk otomatis menyelesaikan pembayaran</p>
            </div>
            <button
              onClick={autoSubmitPayment}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg active:scale-95"
            >
              ✅ Submit Pembayaran
            </button>
            <button
              onClick={() => {
                setShowAutoPayButton(false);
                setSnapInstance(null);
              }}
              className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Sembunyikan
            </button>
          </div>
        </div>
      )}

      <div className="w-full md:w-96 sticky top-24">
        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-600 dark:to-green-700 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <FaShoppingBag className="w-5 h-5" />
              <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                <FaTag className="text-[#479C25] dark:text-green-500" />
                Kode Promo
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Masukkan kode promo"
                  className="flex-grow outline-none p-3 text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg focus:border-[#479C25] dark:focus:border-green-500 transition-colors"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button 
                  onClick={applyPromoCode} 
                  className="bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-600 dark:to-green-700 text-white px-6 py-3 rounded-r-lg hover:shadow-md transition-all font-medium"
                >
                  Pakai
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-[#479C25] dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Catatan untuk Penjual
              </label>
              <textarea
                placeholder="Contoh: Mohon dibungkus rapi, Pedas level 2, dll."
                className="w-full h-24 outline-none p-3 text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#479C25] dark:focus:border-green-500 transition-colors resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent my-2"></div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaShoppingBag className="text-[#479C25] dark:text-green-500 w-4 h-4" />
                  <p className="font-medium">Items ({getCartCount()})</p>
                </div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Rp{subtotal.toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaPercent className="text-[#479C25] dark:text-green-500 w-4 h-4" />
                  <p>Biaya Layanan (5%)</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Rp{serviceFee.toLocaleString()}
                </p>
              </div>
              
              {isPromoApplied && (
                <div className="flex justify-between items-center bg-green-50/70 dark:bg-green-900/30 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <FaTag className="w-4 h-4" />
                    <p className="font-medium">Diskon</p>
                  </div>
                  <p className="font-medium text-green-700 dark:text-green-400">
                    -Rp{discountValue.toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent my-2"></div>
              
              <div className="flex justify-between items-center pt-2">
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Total</p>
                <p className="text-xl font-bold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-500 dark:to-green-600 bg-clip-text text-transparent">
                  Rp{totalAfterDiscount.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50/70 dark:bg-green-900/30 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2">
                  <FaLeaf className="text-green-600 dark:text-green-500 w-4 h-4" />
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">Estimasi Jejak Karbon</p>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 pl-6">Pembelian ini menghasilkan ~{(getCartCount() * 0.5).toFixed(1)} kg CO₂e</p>
              </div>
              
              <div className="bg-blue-50/70 dark:bg-blue-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-blue-600 dark:text-blue-500 w-4 h-4" />
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Metode Pembayaran</p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 pl-6">Tersedia berbagai metode pembayaran: QRIS, transfer bank, e-wallet, dan kartu kredit</p>
              </div>
              
              <div className="bg-yellow-50/70 dark:bg-yellow-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-yellow-600 dark:text-yellow-500 w-4 h-4" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">Informasi Penting</p>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 pl-6">Pesanan akan diproses dalam 5-10 menit setelah pembayaran berhasil</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 pt-0">
            <button
              onClick={createOrder}
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-600 dark:to-green-700 text-white py-4 rounded-lg transition-all font-bold text-lg flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Dengan melakukan pembayaran, Anda menyetujui syarat dan ketentuan kami.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
