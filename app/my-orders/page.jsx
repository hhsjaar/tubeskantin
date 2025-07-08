'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-gray-50">
        <div className="space-y-5">
          <h2 className="text-xl font-semibold mt-6 text-gray-800">🧾 Pesanan Saya</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-center mt-6 text-gray-500">Anda belum memiliki pesanan.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col md:flex-row gap-6"
                >
                  {/* Info Produk */}
                  <div className="flex-1 flex gap-5">
                    <Image
                      src={order.items[0]?.product?.image[0] || assets.box_icon}
                      alt={order.items[0]?.product?.name || "Produk"}
                      width={72}
                      height={72}
                      className="rounded-xl object-cover border"
                    />
                    <div className="flex flex-col justify-center gap-1">
                      <span className="font-medium text-base text-gray-800">
                        {order.items
                          .map(
                            (item) =>
                              `${item.product?.name ?? "Produk Tidak Dikenal"} x ${item.quantity ?? 0}`
                          )
                          .join(", ")}
                      </span>
                      <span className="text-sm text-gray-500">
                        Total Produk: {order.items.length}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.date ? new Date(order.date).toLocaleDateString() : "Tanggal tidak diketahui"}
                      </span>
                    </div>
                  </div>

                  {/* Info Harga */}
                  <div className="my-auto w-full md:w-1/2">
                    <table className="w-full text-sm text-gray-700">
                      <tbody>
                        <tr>
                          <td className="py-1">Subtotal</td>
                          <td className="py-1 text-right font-medium">{currency}{order.amount?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Pajak (2%)</td>
                          <td className="py-1 text-right font-medium">{currency}{order.tax?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr>
                          <td className="py-1">Diskon</td>
                          <td className="py-1 text-right text-orange-600 font-medium">- {currency}{order.discount?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr className="border-t pt-2">
                          <td className="py-2 font-semibold">Total</td>
                          <td className="py-2 text-right font-bold text-green-600">{currency}{order.total?.toLocaleString() ?? "0"}</td>
                        </tr>
                        {order.promoCode && (
                          <tr>
                            <td colSpan="2" className="text-xs text-green-700 text-right">
                              Kode promo digunakan: {order.promoCode}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
