import { kantinNameToIdMap } from "@/lib/kantinMap";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products } = useAppContext();

  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [snapScriptLoaded, setSnapScriptLoaded] = useState(false);

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const totalBeforeDiscount = subtotal + tax;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountValue);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      return toast.error("Please enter a promo code");
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

    if (cartItemsArray.length === 0) {
      return toast.error("Cart is empty");
    }

    const firstKantin = cartItemsArray[0].kantin;
    const isSameKantin = cartItemsArray.every((item) => item.kantin === firstKantin);

    if (!isSameKantin) {
      return toast.error("Semua produk dalam keranjang harus dari kantin yang sama");
    }

    const kantinId = kantinNameToIdMap[firstKantin];

    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/checkout",
        {
          kantinId,
          customerName: user.name || user.email,
          total: totalAfterDiscount,
          items: cartItemsArray,
          promoCode: isPromoApplied ? promoCode.trim() : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.snapToken && data.clientKey) {
        // Load Snap.js production
        if (!snapScriptLoaded) {
          const script = document.createElement("script");
          script.src = "https://app.midtrans.com/snap/snap.js"; // PRODUCTION!
          script.setAttribute("data-client-key", data.clientKey);
          document.body.appendChild(script);
          script.onload = () => {
            setSnapScriptLoaded(true);
            triggerPayment(data.snapToken);
          };
        } else {
          triggerPayment(data.snapToken);
        }
      } else {
        toast.error("Gagal membuat token pembayaran");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat checkout");
    }
  };

  const triggerPayment = (snapToken) => {
    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        toast.success("Pembayaran berhasil!");
        setCartItems({});
        router.push("/order-placed");
      },
      onPending: function (result) {
        toast("Menunggu pembayaran...", { icon: "⏳" });
      },
      onError: function (result) {
        toast.error("Pembayaran gagal.");
        console.error(result);
      },
      onClose: function () {
        toast("Transaksi dibatalkan.");
      },
    });
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
            <p className="text-gray-800">{currency}{subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{tax}</p>
          </div>
          {isPromoApplied && (
            <div className="flex justify-between text-green-600 font-medium">
              <p>Discount</p>
              <p>-{currency}{discountValue}</p>
            </div>
          )}
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{totalAfterDiscount}</p>
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
