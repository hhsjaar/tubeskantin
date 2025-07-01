import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Notification from "@/models/Notification";

export async function POST(request) {
  await connectDB();

  try {
    const { userId, title, message } = await request.json();

    if (!userId || !title || !message) {
      return NextResponse.json({ success: false, message: "Semua data harus diisi" }, { status: 400 });
    }

    const notif = await Notification.create({
      userId,
      title,
      message,
    });

    return NextResponse.json({ success: true, data: notif });
  } catch (error) {
    console.error("Gagal membuat notifikasi:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
