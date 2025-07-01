import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import authKandok from "@/lib/authkandok"; // Pastikan file ini ada
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    // Jika bukan seller, cek apakah dia Kandok
    if (!isSeller) {
      const isKandok = await authKandok(userId);
      if (!isKandok) {
        return NextResponse.json({ success: false, message: "not authorized" });
      }
    }

    await connectDB();

    const orders = await Order.find({}).populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
