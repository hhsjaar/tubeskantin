import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Notification from '@/models/Notification';

export async function PUT(_, { params }) {
  await connectDB();
  const { id } = params;

  await Notification.findByIdAndUpdate(id, { isRead: true });

  return NextResponse.json({ success: true, message: 'Notifikasi dibaca' });
}
