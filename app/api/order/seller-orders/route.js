import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import authBem from "@/lib/authBem";
import authKandok from "@/lib/authkandok";
import authKantek from "@/lib/authkantek";
import authKansip from "@/lib/authkansip";
import authKantel from "@/lib/authkantel";
import authBerkah from "@/lib/authberkah";
import authKantintn from "@/lib/authkantintn";
import authTaniamart from "@/lib/authtaniamart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    const isBem = await authBem(userId);

    // Jika bukan seller atau BEM, cek apakah dia dari salah satu kantin
    if (!isSeller && !isBem) {
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

    // Populate both product and user data
    const orders = await Order.find({}).populate("items.product");
    
    // Manually populate user data since userId is a string, not ObjectId
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId);
        return {
          ...order.toObject(),
          user: user ? {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl
          } : null
        };
      })
    );

    return NextResponse.json({ success: true, orders: ordersWithUsers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
