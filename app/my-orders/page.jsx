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
          <h2 className="text-lg font-medium mt-6">Pesanan Saya</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-center mt-6">Anda belum memiliki pesanan.</p>
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
                      src={order.items[0]?.product?.image[0] || assets.box_icon}  // Menampilkan gambar produk atau fallback ke ikon kotak
                      alt={order.items[0]?.product?.name || "Produk"}
                      width={64}
                      height={64}
                      className="max-w-16 max-h-16 object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base">
                        {/* Menampilkan nama produk + qty, jika produk tidak tersedia tulis "Produk Tidak Dikenal" */}
                        {order.items
                          .map(
                            (item) =>
                              `${item.product?.name ?? "Produk Tidak Dikenal"} x ${
                                item.quantity ?? 0
                              }`
                          )
                          .join(", ")}
                      </span>
                      <span>Jumlah Produk: {order.items.length}</span>
                    </div>
                  </div>

                  {/* Tabel Ringkasan Harga */}
                  <div className="my-auto w-full md:w-1/3">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td><strong>Jumlah:</strong></td>
                          <td>{currency}{order.amount?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr>
                          <td><strong>Pajak:</strong></td>
                          <td>{currency}{order.tax?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr>
                          <td><strong>Diskon:</strong></td>
                          <td>{currency}{order.discount?.toLocaleString() ?? "0"}</td>
                        </tr>
                        <tr>
                          <td><strong>Total:</strong></td>
                          <td>{currency}{order.total?.toLocaleString() ?? "0"}</td>
                        </tr>
                        {order.promoCode && (
                          <tr>
                            <td colSpan="2" className="text-green-600">
                              Kode promo diterapkan: {order.promoCode}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Info Pembayaran dan Tanggal */}
                  <div className="my-auto w-full md:w-1/3">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td><strong>Metode Pembayaran:</strong></td>
                          <td>COD</td>
                        </tr>
                        <tr>
                          <td><strong>Tanggal:</strong></td>
                          <td>{order.date ? new Date(order.date).toLocaleDateString() : "Tidak Diketahui"}</td>
                        </tr>
                        <tr>
                          <td><strong>Status Pembayaran:</strong></td>
                          <td>Menunggu</td>
                        </tr>
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
