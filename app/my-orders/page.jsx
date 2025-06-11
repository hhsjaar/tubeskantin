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
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-center mt-6">You have no orders yet.</p>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  {/* Info Produk */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      src={assets.box_icon}
                      alt="box_icon"
                      width={64}
                      height={64}
                      className="max-w-16 max-h-16 object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base">
                        {/* Tampilkan nama produk + qty, jika produk tidak tersedia tulis "Unknown Product" */}
                        {order.items
                          .map(
                            (item) =>
                              `${item.product?.name ?? "Unknown Product"} x ${
                                item.quantity ?? 0
                              }`
                          )
                          .join(", ")}
                      </span>
                      <span>Items: {order.items.length}</span>
                    </div>
                  </div>

                  {/* Ringkasan Harga */}
                  <div className="my-auto text-right">
                    <p>
                      <strong>Amount:</strong> {currency}
                      {order.amount?.toLocaleString() ?? "0"}
                      <br />
                      <strong>Tax:</strong> {currency}
                      {order.tax?.toLocaleString() ?? "0"}
                      <br />
                      <strong>Discount:</strong> {currency}
                      {order.discount?.toLocaleString() ?? "0"}
                      <br />
                      <strong>Total:</strong> {currency}
                      {order.total?.toLocaleString() ?? "0"}
                      {order.promoCode && (
                        <>
                          <br />
                          <em className="text-green-600">
                            Promo code applied: {order.promoCode}
                          </em>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Info Pembayaran dan Tanggal */}
                  <div className="my-auto text-right">
                    <p className="flex flex-col">
                      <span>Method: COD</span>
                      <span>
                        Date:{" "}
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : "Unknown"}
                      </span>
                      <span>Payment: Pending</span>
                    </p>
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
