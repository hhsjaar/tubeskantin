import connectDB from "@/config/db";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import authSeller from "@/lib/authSeller";
import authKandok from "@/lib/authkandok";
import authKantek from "@/lib/authkantek";
import authKansip from "@/lib/authkansip";
import authKantel from "@/lib/authkantel";
import authBerkah from "@/lib/authberkah";
import authKantintn from "@/lib/authkantintn";
import authTaniamart from "@/lib/authtaniamart";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    
    // Verifikasi apakah pengguna adalah seller atau dari kantin
    const isSeller = await authSeller(userId);
    const isKandok = !isSeller ? await authKandok(userId) : false;
    const isKantek = !isSeller ? await authKantek(userId) : false;
    const isKansip = !isSeller ? await authKansip(userId) : false;
    const isKantel = !isSeller ? await authKantel(userId) : false;
    const isBerkah = !isSeller ? await authBerkah(userId) : false;
    const isKantintn = !isSeller ? await authKantintn(userId) : false;
    const isTaniamart = !isSeller ? await authTaniamart(userId) : false;
    
    if (!isSeller && !isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
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
    console.error("Gagal memperbarui status pesanan:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}