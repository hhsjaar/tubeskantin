import connectDB from "@/config/db";
import PromoCode from "@/models/PromoCode";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authBem from "@/lib/authBem";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Anda tidak memiliki akses" }, { status: 401 });
    }
    
    // Verify BEM role
    const isBem = await authBem(userId);
    if (!isBem) {
      return NextResponse.json({ success: false, message: "Anda tidak admin" }, { status: 403 });
    }
    
    await connectDB();

    // Get code from query params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
    }

    // Find promo by code
    const promo = await PromoCode.findOne({ code });
    
    if (!promo) {
      return NextResponse.json({ success: false, message: "Promo not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      promo
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}