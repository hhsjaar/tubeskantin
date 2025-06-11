import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Notification from '@/models/Notification';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // Verifikasi apakah user terotorisasi (BEM)
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User not authorized' });
    }

    const { message, type, priority, actionUrl, userId: targetUserId } = await request.json();

    // Menghubungkan ke database MongoDB
    await connectDB();

    // Menyimpan notifikasi ke MongoDB
    const newNotification = await Notification.create({
      userId: targetUserId,  // Kirim notifikasi kepada user yang dipilih
      message,
      type,
      priority,
      actionUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil dikirim dan disimpan!',
      newNotification,
    });
  } catch (error) {
    // Tangani error jika ada
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
