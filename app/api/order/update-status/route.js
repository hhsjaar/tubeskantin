import connectDB from "@/config/db";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import authSeller from "@/lib/authSeller";
import authKandok from "@/lib/authkandok";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    
    // Verifikasi apakah pengguna adalah seller atau kandok
    const isSeller = await authSeller(userId);
    const isKandok = !isSeller ? await authKandok(userId) : false;
    
    if (!isSeller && !isKandok) {
      return NextResponse.json(
        { success: false, message: "Tidak diizinkan mengubah status pesanan" },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "ID pesanan dan status diperlukan" },
        { status: 400 }
      );
    }
    
    // Validasi status
    const validStatuses = ["Menunggu Konfirmasi", "Sedang Disiapkan", "Sudah Siap", "Selesai", "Dibatalkan"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }
    
    // Cari dan update pesanan
    const order = await Order.findById(orderId).populate("items.product");
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Update status
    order.status = status;
    order.statusUpdatedAt = new Date();
    await order.save();
    
    // Kirim notifikasi ke pengguna
    let notificationMessage = "";
    switch (status) {
      case "Sedang Disiapkan":
        notificationMessage = "Pesanan Anda sedang disiapkan oleh penjual.";
        break;
      case "Sudah Siap":
        notificationMessage = "Pesanan Anda sudah siap dan dapat diambil.";
        break;
      case "Selesai":
        notificationMessage = "Pesanan Anda telah selesai. Terima kasih telah berbelanja!";
        break;
      case "Dibatalkan":
        notificationMessage = "Pesanan Anda telah dibatalkan.";
        break;
      default:
        notificationMessage = `Status pesanan Anda telah diperbarui menjadi ${status}.`;
    }
    
    await Notification.create({
      userId: order.userId,
      title: "Update Status Pesanan",
      message: notificationMessage,
    });
    
    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      order
    });
    
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}