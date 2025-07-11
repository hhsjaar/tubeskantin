import { kantins } from "@/lib/kantins";
import midtransClient from "midtrans-client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { kantinId, customerName, total } = body;

    // 1. Cari konfigurasi kantin
    const kantin = kantins.find(k => k.id === kantinId);
    if (!kantin) {
      return NextResponse.json(
        { success: false, message: "Kantin tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Buat client Snap berdasarkan environment kantin
    const snap = new midtransClient.Snap({
      isProduction: kantin.isProduction || false,
      serverKey: kantin.serverKey
    });

    // 3. Buat order ID unik
    const orderId = `ORDER-${kantinId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Konfigurasi transaksi
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: customerName,
      },
    };

    // 5. Buat transaksi ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 6. Kirim ke frontend
    return NextResponse.json({
      success: true,
      snapToken,
      clientKey: kantin.clientKey, // Kirim clientKey sesuai environment
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat transaksi", error: error.message },
      { status: 500 }
    );
  }
}
