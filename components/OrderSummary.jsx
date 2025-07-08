import { kantinNameToIdMap } from "@/lib/kantinMap";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products} = useAppContext();

  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const totalBeforeDiscount = subtotal + tax;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountValue);
  const [snapOpened, setSnapOpened] = useState(false);


  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      return toast.error("Please enter a promo code");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/promo-codes/validate", // sesuaikan endpoint validasi promo
        { code: promoCode.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Asumsi promo.value sudah dalam bentuk angka diskon langsung
        setDiscountValue(data.promo.value);
        setIsPromoApplied(true);
        toast.success(`Promo code applied! You saved ${currency}${data.promo.value}`);
      } else {
        setDiscountValue(0);
        setIsPromoApplied(false);
        toast.error(data.message || "Invalid promo code");
      }
    } catch (error) {
      setDiscountValue(0);
      setIsPromoApplied(false);
      toast.error(error.message);
    }
  };

  const createOrder = async () => {
    if (!user) return toast("Please login to place order", { icon: "⚠️" });

    // Ambil array produk dalam cart
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

    if (cartItemsArray.length === 0) {
      return toast.error("Cart is empty");
    }

    // Validasi: semua item dari kantin yang sama
    const firstKantin = cartItemsArray[0].kantin;
    const isSameKantin = cartItemsArray.every((item) => item.kantin === firstKantin);

    if (!isSameKantin) {
      return toast.error("Semua produk dalam keranjang harus dari kantin yang sama");
    }

    const kantinId = kantinNameToIdMap[firstKantin];

    try {
      const { data } = await axios.post("/api/checkout", {
        kantinId,
        customerName: user.name || user.email,
        total: totalAfterDiscount,
      });

      if (data.snapToken && data.clientKey) {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", data.clientKey);
        document.body.appendChild(script);

        script.onload = () => {
  setSnapOpened(true); // ⬅️ aktifkan tombol
  window.snap.pay(data.snapToken, {
  onPending: () => {
    handleFakeSuccess(); // <-- ini akan simpan order ke DB
  },
});

};

      } else {
        toast.error("Gagal membuat token pembayaran");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat checkout");
    }
  };
  const handleFakeSuccess = async () => {
  try {
    if (!user) {
      toast("Please login to place order", { icon: "⚠️" });
      return;
    }

    let cartItemsArray = Object.keys(cartItems).map((key) => ({
      product: key,
      quantity: cartItems[key],
    }));

    const token = await getToken();

    const { data } = await axios.post(
      "/api/order/create",
      {
        items: cartItemsArray,
        promoCode: isPromoApplied ? promoCode.trim() : null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.success) {
      toast.success("Pembayaran sukses");
      setCartItems({});
      router.push("/order-placed");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-grow outline-none p-2.5 text-gray-600 border"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={applyPromoCode} className="bg-orange-600 text-white px-6 py-2 hover:bg-orange-700">
            Apply
          </button>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {subtotal}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {tax}
            </p>
          </div>
          {isPromoApplied && (
            <div className="flex justify-between text-green-600 font-medium">
              <p>Discount</p>
              <p>
                -{currency}
                {discountValue}
              </p>
            </div>
          )}
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {totalAfterDiscount}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Bayar Sekarang
      </button>
      {/* ⬇️ Ini bagian yang kamu maksud: Tambahkan di sini */}
    {snapOpened && (
  <div className="fixed bottom-8 right-8 z-50">
    <button
      className="bg-green-600 text-white px-4 py-3 rounded shadow-lg hover:bg-green-700 transition-all"
      onClick={() => {
        toast.success("Pembayaran disimulasikan berhasil");
        setCartItems({});
        setSnapOpened(false);
        router.push("/order-placed");
      }}
    >
      Sudah Bayar
    </button>
  </div>
)}

  </div>
);
};

export default OrderSummary;
