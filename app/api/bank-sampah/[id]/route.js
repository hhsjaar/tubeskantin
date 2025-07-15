import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import BankSampah from "@/models/BankSampah";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { promoCode, promoValue } = body;

    const updated = await BankSampah.findByIdAndUpdate(
      id,
      {
        promoCode,
        promoValue: promoValue ? Number(promoValue) : null,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Promo berhasil diperbarui", bankSampah: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}