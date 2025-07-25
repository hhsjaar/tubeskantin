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
import crypto from "crypto";

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
    const { items, promoCode, note, midtransOrderId } = body;

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

    // Hitung biaya layanan 5%
    const tax = Math.floor(amount * 0.05);

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

    // Format items
    const formattedItems = items.map((item) => {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return {
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
      };
    });

    // ✅ Buat order ID yang unik dengan kombinasi userId dan timestamp
    const orderId = midtransOrderId || `ORDER-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ✅ Cek duplikasi yang lebih ketat dengan atomic operation
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Cek duplikasi dalam transaksi
        const recentOrder = await Order.findOne({
          $or: [
            { orderId },
            {
              userId,
              date: { $gte: new Date(Date.now() - 60000) }, // 1 menit terakhir
              total: total, // Same total amount
              amount: amount // Same subtotal
            }
          ]
        }).session(session);
    
        if (recentOrder) {
          throw new Error('DUPLICATE_ORDER');
        }
    
        // Buat order baru dalam transaksi
        const newOrder = new Order({
          orderId,
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
          note: note || "",
        });
    
        await newOrder.save({ session });
        
        // Update orderCount untuk setiap produk yang dibeli
        for (const item of items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { orderCount: item.quantity } },
            { session }
          );
        }
    
        // Tandai promo sudah digunakan
        if (promo) {
          promo.used = true;
          await promo.save({ session });
        }
    
        // Clear user cart
        const user = await User.findById(userId);
        if (user) {
          user.cartItems = {};
          await user.save({ session });
        }
    
        return newOrder;
      });
    } catch (error) {
      if (error.message === 'DUPLICATE_ORDER') {
        return NextResponse.json(
          { success: false, message: "Terdeteksi Duplikat Pesanan. Silakan tunggu beberapa saat sebelum memesan kembali." },
          { status: 409 }
        );
      }
      throw error;
    } finally {
      await session.endSession();
    }

    // ✅ Tambahkan Notifikasi
    await Notification.create({
      userId,
      title: "Pesanan Berhasil",
      message: `Pesanan kamu dengan total Rp${total.toLocaleString()} sedang diproses.`,
    });

    // Hapus pengiriman event ke Inngest untuk menghindari duplikasi data
    // await inngest.send({
    //   name: "order/created",
    //   data: {
    //     userId,
    //     items,
    //     amount: total,
    //     date: newOrder.date,
    //     orderId: newOrder._id.toString(),
    //   },
    // });

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
