import connectDB from "@/config/db";
import PromoCode from "@/models/PromoCode";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { code } = await request.json();

    if (!code || code.trim() === "") {
      return NextResponse.json({ success: false, message: "Kode promo harus diisi" }, { status: 400 });
    }

    const promo = await PromoCode.findOne({ code, userId });

    if (!promo) {
      return NextResponse.json({ success: false, message: "Kode promo tidak ditemukan" }, { status: 200 });
    }

    if (promo.used) {
      return NextResponse.json({ success: false, message: "Kode promo sudah digunakan" }, { status: 200 });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: "Kode promo sudah kadaluarsa" }, { status: 200 });
    }

    // Promo valid
    return NextResponse.json({ success: true, promo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
