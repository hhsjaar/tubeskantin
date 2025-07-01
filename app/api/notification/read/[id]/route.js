import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Notification from "@/models/Notification";

export async function PATCH(request, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const notif = await Notification.findById(id);
    if (!notif) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    notif.isRead = true;
    await notif.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
