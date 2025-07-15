import connectDB from "@/config/db";
import PromoCode from "@/models/PromoCode";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authBem from "@/lib/authBem";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    
    // Verify BEM role
    const isBem = await authBem(userId);
    if (!isBem) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
    
    await connectDB();

    // Get all promo codes
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    const totalPromos = await PromoCode.countDocuments();

    return NextResponse.json({ 
      success: true, 
      promos,
      totalPromos
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}