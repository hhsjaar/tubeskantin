import { inngest } from "@/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Notification from '@/models/Notification';
import Product from "@/models/Product";
import PromoCode from "@/models/PromoCode";
import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/config/db";
import mongoose from "mongoose";


export async function POST(request) {
  await connectDB();

  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: user not logged in" },
        { status: 401 }
      );
    }
    

    const body = await request.json();
    const { items, promoCode, note } = body; // <-- Tambahkan note

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada produk" },
        { status: 400 }
      );
    }

    // Ambil semua product sekaligus
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "Beberapa produk tidak ada" },
        { status: 404 }
      );
    }

    // Hitung subtotal amount
    let amount = 0;
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Hitung pajak 2%
    const tax = Math.floor(amount * 0.02);

    // Hitung diskon dari promo
    let discount = 0;
    let promo = null;
    if (promoCode) {
      promo = await PromoCode.findOne({
        code: promoCode,
        used: false,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      });

      if (!promo) {
        return NextResponse.json(
          { success: false, message: "Kode promo salah atau kadaluarsa" },
          { status: 400 }
        );
      }

      if (promo.isPercentage) {
        discount = Math.floor(amount * (promo.value / 100));
      } else {
        discount = promo.value;
      }
      if (discount > amount) discount = amount;
    }

    const total = amount + tax - discount;

    // Simpan order
const formattedItems = items.map((item) => {
  if (!mongoose.Types.ObjectId.isValid(item.product)) {
    throw new Error(`Invalid product ID: ${item.product}`);
  }
  return {
    product: new mongoose.Types.ObjectId(item.product),
    quantity: item.quantity,
  };
});

const orderId = `ORDER-${userId}-${Date.now()}`;
const existingOrder = await Order.findOne({ orderId });
if (existingOrder) {
  return NextResponse.json(
    { success: false, message: "Terdeteksi Duplikat Pesanan" },
    { status: 409 }
  );
}


const newOrder = new Order({
  orderId, // ✅ tambahkan ini
  userId,
  items: formattedItems,
  amount,
  tax,
  discount,
  total,
  promoCode: promoCode || null,
  date: new Date(),
  status: "Menunggu Konfirmasi",
  statusUpdatedAt: new Date(),
  note: note || "", // <-- Tambahkan ini
});


    // Simpan order dan update orderCount
    await newOrder.save();
    console.log("Order saved:", newOrder._id);

    // Update orderCount untuk setiap produk yang dibeli
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { orderCount: item.quantity } }
      );
    }

    // ✅ Tambahkan Notifikasi
await Notification.create({
  userId,
  title: "Pesanan Berhasil",
  message: `Pesanan kamu dengan total Rp${total.toLocaleString()} sedang diproses.`,
});


    // Tandai promo sudah digunakan
    if (promo) {
      promo.used = true;
      await promo.save();
      
    }
    

    // Kirim event Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        items,
        amount: total,
        date: newOrder.date,
        orderId: newOrder._id.toString(),
      },
    });

    // Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan Berhasil Dibuat",
      data: {
        orderId: newOrder._id,
        amount,
        tax,
        discount,
        total,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
