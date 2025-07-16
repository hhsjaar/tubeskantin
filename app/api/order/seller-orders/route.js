import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import authKandok from "@/lib/authkandok";
import authKantek from "@/lib/authkantek";
import authKansip from "@/lib/authkansip";
import authKantel from "@/lib/authkantel";
import authBerkah from "@/lib/authberkah";
import authKantintn from "@/lib/authkantintn";
import authTaniamart from "@/lib/authtaniamart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    // Jika bukan seller, cek apakah dia dari salah satu kantin
    if (!isSeller) {
      const isKandok = await authKandok(userId);
      const isKantek = await authKantek(userId);
      const isKansip = await authKansip(userId);
      const isKantel = await authKantel(userId);
      const isBerkah = await authBerkah(userId);
      const isKantintn = await authKantintn(userId);
      const isTaniamart = await authTaniamart(userId);

      if (!isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
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
