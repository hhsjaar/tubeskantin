import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Notification from "@/models/Notification";

export async function PATCH(request, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Notifikasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}
