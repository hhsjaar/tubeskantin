import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import BankSampah from "@/models/BankSampah";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

// GET handler: ambil data Bank Sampah dengan info user
export async function GET() {
  try {
    await connectDB();

    const bankSampahList = await BankSampah.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email imageUrl");

    return NextResponse.json({
      success: true,
      bankSampah: bankSampahList,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

// POST handler: tambah data bank sampah dari user
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      });
    }

    const formData = await request.formData();
    const sampah = formData.get("sampah");
    const jumlahSampah = formData.get("jumlahSampah");
    const lokasi = formData.get("lokasi");
    const catatan = formData.get("catatan") || "";
    const file = formData.get("fotoSampah");

    if (!sampah || !jumlahSampah || !lokasi || !file) {
      return NextResponse.json({
        success: false,
        message: "Data tidak lengkap",
      });
    }

    // Upload gambar ke Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "bank-sampah" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    await connectDB();

    const newBankSampah = await BankSampah.create({
      userId,
      sampah,
      jumlahSampah: Number(jumlahSampah),
      lokasi,
      catatan,
      fotoSampah: uploadResult.secure_url,
      // promoCode dan promoValue hanya akan diisi oleh BEM melalui PATCH
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil ditambahkan",
      bankSampah: newBankSampah,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}