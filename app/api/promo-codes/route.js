import connectDB from "@/config/db";
import PromoCode from "@/models/PromoCode";
import Notification from "@/models/Notification";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    await connectDB();

    const promos = await PromoCode.find({ userId, used: false }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, promos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/promo-codes: request received");

    await connectDB();

    const data = await request.json();
    console.log("Request JSON data:", data);

    const { userId, code, value, expiresAt } = data;

    if (!userId || !code || !value) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek duplikat kode promo
    const existing = await PromoCode.findOne({ code });
    if (existing) {
      return NextResponse.json({ success: false, message: "Kode promo sudah ada" }, { status: 400 });
    }

    // Simpan promo
    const promo = await PromoCode.create({
      userId,
      code,
      value,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    console.log("Promo created:", promo);
    await Notification.create({
      userId,
      title: "🎁 Kode Promo Baru!",
      message: `Kamu mendapatkan kode promo ${code} senilai Rp${value.toLocaleString()}. Gunakan segera ya sebelum kadaluarsa!`,
    });

    return NextResponse.json({ success: true, promo }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/promo-codes:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
