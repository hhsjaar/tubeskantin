// api/user/data/route.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await connectDB();

    // Mengambil semua pengguna kecuali yang memiliki role 'seller' dan 'bem'
    const users = await User.find({
      role: { $nin: ['seller', 'bem','kandok', 'kantek', 'kantel', 'kansip','kantintn', 'berkah','taniamart'] }
    });

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
