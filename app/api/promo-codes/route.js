import connectDB from "@/config/db";
import PromoCode from "@/models/PromoCode";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }
    await connectDB();

    const promos = await PromoCode.find({ userId, used: false }).sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ success: true, promos }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
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
      return new Response(
        JSON.stringify({ success: false, message: "Data tidak lengkap" }),
        { status: 400 }
      );
    }

    // Cek duplikat kode promo
    const existing = await PromoCode.findOne({ code });
    if (existing) {
      return new Response(
        JSON.stringify({ success: false, message: "Kode promo sudah ada" }),
        { status: 400 }
      );
    }

    // Simpan promo
    const promo = await PromoCode.create({
      userId,
      code,
      value,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    console.log("Promo created:", promo);

    return new Response(
      JSON.stringify({ success: true, promo }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/promo-codes:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
