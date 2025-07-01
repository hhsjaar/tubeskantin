import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Notification from "@/models/Notification";

export async function GET(request, { params }) {
  await connectDB();
  const userId = params.userId;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
