import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import BankSampah from "@/models/BankSampah";
import PromoCode from "@/models/PromoCode";
import Notification from "@/models/Notification";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Autentikasi pengguna (opsional, tergantung kebutuhan)
    const { userId } = getAuth(request);
    
    // Koneksi ke database
    await connectDB();
    
    // Ambil parameter query untuk filter dan pagination
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('products') !== 'false';
    const includeUsers = searchParams.get('users') !== 'false';
    const includeOrders = searchParams.get('orders') !== 'false';
    const includeTrashback = searchParams.get('trashback') !== 'false';
    const includePromoCodes = searchParams.get('promo_codes') !== 'false';
    const includeNotifications = searchParams.get('notifications') !== 'false';
    const includeAddresses = searchParams.get('addresses') !== 'false';
    
    // Objek untuk menyimpan semua data
    const allData = {};
    
    // Ambil data produk jika diminta
    if (includeProducts) {
      const products = await Product.find()
        .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah')
        .lean();
      allData.products = products;
    }
    
    // Ambil data pengguna jika diminta
    if (includeUsers) {
      const users = await User.find()
        .select('name email imageUrl')
        .lean();
      allData.users = users;
    }
    
    // Ambil data pesanan jika diminta
    if (includeOrders) {
      const orders = await Order.find()
        .populate({
          path: 'items.product',
          select: 'name image offerPrice kantin'
        })
        .lean();
      allData.orders = orders;
    }
    
    // Ambil data bank sampah (trashback) jika diminta
    if (includeTrashback) {
      const bankSampah = await BankSampah.find()
        .populate('userId', 'name email imageUrl')
        .lean();
      allData.trashback = bankSampah;
    }
    
    // Ambil data kode promo jika diminta
    if (includePromoCodes) {
      const promoCodes = await PromoCode.find().lean();
      allData.promoCodes = promoCodes;
    }
    
    // Ambil data notifikasi jika diminta
    if (includeNotifications) {
      const notifications = await Notification.find().lean();
      allData.notifications = notifications;
    }
    
    // Ambil data alamat jika diminta
    if (includeAddresses) {
      const addresses = await Address.find().lean();
      allData.addresses = addresses;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: allData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error fetching all data:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}