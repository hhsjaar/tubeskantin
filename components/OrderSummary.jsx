import { kantinNameToIdMap } from "@/lib/kantinMap";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { kantins } from "@/lib/kantins"; // ⬅️ Tambahkan baris ini


const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products} = useAppContext();
const [isSubmitting, setIsSubmitting] = useState(false); // prevent double

  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const totalBeforeDiscount = subtotal + tax;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountValue);
  const [snapOpened, setSnapOpened] = useState(false);

  const saveOrder = async () => {
  if (isSubmitting) return; // ✅ prevent double submit
  setIsSubmitting(true);

  const token = await getToken();

  const orderItems = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      if (!product) return null;
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
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Order saved:", data);
  } catch (error) {
    console.error("Gagal simpan order:", error);
    toast.error("Gagal menyimpan order.");
  } finally {
    setIsSubmitting(false); // reset flag
  }
};


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

  if (cartItemsArray.length === 0) return toast.error("Cart is empty");

  const firstKantin = cartItemsArray[0].kantin;
  const isSameKantin = cartItemsArray.every((item) => item.kantin === firstKantin);
  if (!isSameKantin) return toast.error("Semua produk dalam keranjang harus dari kantin yang sama");

  const kantinId = kantinNameToIdMap[firstKantin];
  const kantin = kantins.find(k => k.id === kantinId);
  if (!kantin) return toast.error("Kantin tidak ditemukan");

  try {
    const { data } = await axios.post("/api/checkout", {
      kantinId,
      customerName: user.name || user.email,
      total: totalAfterDiscount,
    });

    if (!data.snapToken || !data.clientKey) {
      return toast.error("Snap token gagal dibuat");
    }

    // ✅ Hapus script snap lama jika ada
    const existing = document.querySelector("script[src*='midtrans.com/snap']");
    if (existing) existing.remove();

    // ✅ Inject script Snap sesuai environment
    const script = document.createElement("script");
    script.src = kantin.isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", data.clientKey);
    script.onload = () => {
      // ✅ Pastikan snap tersedia setelah load
      if (window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: async () => {
            await saveOrder();
            toast.success("Pembayaran berhasil!");
            setCartItems({});
            router.push("/order-placed");
          },
          onError: () => toast.error("Pembayaran gagal"),
          onClose: () => toast("Pembayaran dibatalkan"),
        });
      } else {
        toast.error("Midtrans snap gagal dimuat.");
      }
    };
    document.body.appendChild(script);
  } catch (err) {
    console.error("Checkout error", err);
    toast.error("Checkout gagal");
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
  </div>
);
};

export default OrderSummary;
