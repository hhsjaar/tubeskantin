import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import BankSampah from '@/models/BankSampah';

export async function GET() {
  try {
    await connectDB();
    const bankSampah = await BankSampah.find({});
    return NextResponse.json({ success: true, bankSampah });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
