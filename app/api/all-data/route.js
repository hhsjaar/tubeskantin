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
    
    // Parameter untuk memilih jenis data
    const includeProducts = searchParams.get('products') !== 'false';
    const includeUsers = searchParams.get('users') !== 'false';
    const includeOrders = searchParams.get('orders') !== 'false';
    const includeTrashback = searchParams.get('trashback') !== 'false';
    const includePromoCodes = searchParams.get('promo_codes') !== 'false';
    const includeNotifications = searchParams.get('notifications') !== 'false';
    const includeAddresses = searchParams.get('addresses') !== 'false';
    
    // Parameter pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Parameter untuk memilih hanya satu jenis data
    const dataType = searchParams.get('dataType'); // 'products', 'users', 'orders', etc.
    
    // Parameter untuk rekomendasi makanan
    const recommendation = searchParams.get('recommendation'); // 'daily', 'lowCarbon', 'diet', 'healthy', 'balanced'
    
    // Objek untuk menyimpan semua data
    const allData = {};
    
    // Fungsi untuk mendapatkan rekomendasi makanan berdasarkan kriteria
    async function getRecommendedProducts(criteria, limit) {
      let query = {};
      let sort = {};
      
      switch(criteria) {
        case 'daily':
          // Rekomendasi makanan harian - seimbang nutrisi
          sort = { protein: -1, totalCarbohydrates: -1, calories: 1 };
          break;
        case 'lowCarbon':
          // Makanan dengan jejak karbon rendah
          query = { 
            $expr: { 
              $lt: [{ $add: ["$karbonMakanan", "$karbonPengolahan", "$karbonTransportasiLimbah"] }, 10] 
            } 
          };
          sort = { karbonMakanan: 1, karbonPengolahan: 1, karbonTransportasiLimbah: 1 };
          break;
        case 'diet':
          // Makanan untuk diet - rendah kalori, tinggi protein
          query = { calories: { $lt: 300 } };
          sort = { protein: -1, calories: 1 };
          break;
        case 'healthy':
          // Makanan sehat - tinggi vitamin dan mineral
          sort = { 
            vitaminA: -1, 
            vitaminC: -1, 
            vitaminD: -1, 
            calcium: -1, 
            iron: -1, 
            potassium: -1 
          };
          break;
        case 'balanced':
          // Makanan seimbang - proporsi nutrisi yang baik
          sort = { 
            protein: -1, 
            totalCarbohydrates: -1, 
            totalFat: 1, 
            sodium: 1, 
            cholesterol: 1 
          };
          break;
        default:
          // Tidak ada kriteria khusus, kembalikan produk populer
          sort = { orderCount: -1 };
      }
      
      return await Product.find(query)
        .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah')
        .sort(sort)
        .limit(limit)
        .lean();
    }
    
    // Jika ada parameter rekomendasi, prioritaskan itu
    if (recommendation) {
      const recommendedProducts = await getRecommendedProducts(recommendation, limit);
      allData.products = recommendedProducts;
      allData.recommendation = recommendation;
      allData.recommendationInfo = {
        type: recommendation,
        count: recommendedProducts.length,
        criteria: recommendation
      };
      
      return NextResponse.json({ 
        success: true, 
        data: allData,
        timestamp: new Date().toISOString()
      });
    }
    
    // Jika dataType ditentukan, hanya ambil jenis data tersebut
    if (dataType) {
      switch(dataType) {
        case 'products':
          const products = await Product.find()
            .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah')
            .skip(skip)
            .limit(limit)
            .lean();
          const totalProducts = await Product.countDocuments();
          allData.products = products;
          allData.pagination = {
            total: totalProducts,
            page,
            limit,
            totalPages: Math.ceil(totalProducts / limit)
          };
          break;
        case 'users':
          const users = await User.find()
            .select('name email imageUrl')
            .skip(skip)
            .limit(limit)
            .lean();
          const totalUsers = await User.countDocuments();
          allData.users = users;
          allData.pagination = {
            total: totalUsers,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit)
          };
          break;
        case 'orders':
          const orders = await Order.find()
            .populate({
              path: 'items.product',
              select: 'name image offerPrice kantin'
            })
            .skip(skip)
            .limit(limit)
            .lean();
          const totalOrders = await Order.countDocuments();
          allData.orders = orders;
          allData.pagination = {
            total: totalOrders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit)
          };
          break;
        case 'trashback':
          const bankSampah = await BankSampah.find()
            .populate('userId', 'name email imageUrl')
            .skip(skip)
            .limit(limit)
            .lean();
          const totalTrashback = await BankSampah.countDocuments();
          allData.trashback = bankSampah;
          allData.pagination = {
            total: totalTrashback,
            page,
            limit,
            totalPages: Math.ceil(totalTrashback / limit)
          };
          break;
        case 'promoCodes':
          const promoCodes = await PromoCode.find()
            .skip(skip)
            .limit(limit)
            .lean();
          const totalPromoCodes = await PromoCode.countDocuments();
          allData.promoCodes = promoCodes;
          allData.pagination = {
            total: totalPromoCodes,
            page,
            limit,
            totalPages: Math.ceil(totalPromoCodes / limit)
          };
          break;
        case 'notifications':
          const notifications = await Notification.find()
            .skip(skip)
            .limit(limit)
            .lean();
          const totalNotifications = await Notification.countDocuments();
          allData.notifications = notifications;
          allData.pagination = {
            total: totalNotifications,
            page,
            limit,
            totalPages: Math.ceil(totalNotifications / limit)
          };
          break;
        case 'addresses':
          const addresses = await Address.find()
            .skip(skip)
            .limit(limit)
            .lean();
          const totalAddresses = await Address.countDocuments();
          allData.addresses = addresses;
          allData.pagination = {
            total: totalAddresses,
            page,
            limit,
            totalPages: Math.ceil(totalAddresses / limit)
          };
          break;
        default:
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid dataType parameter' 
          }, { status: 400 });
      }
    } else {
      // Jika tidak ada dataType, ambil semua jenis data yang diminta dengan pagination
      // Ambil data produk jika diminta
      if (includeProducts) {
        const products = await Product.find()
          .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah')
          .skip(skip)
          .limit(limit)
          .lean();
        allData.products = products;
      }
      
      // Ambil data pengguna jika diminta
      if (includeUsers) {
        const users = await User.find()
          .select('name email imageUrl')
          .skip(skip)
          .limit(limit)
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
          .skip(skip)
          .limit(limit)
          .lean();
        allData.orders = orders;
      }
      
      // Ambil data bank sampah (trashback) jika diminta
      if (includeTrashback) {
        const bankSampah = await BankSampah.find()
          .populate('userId', 'name email imageUrl')
          .skip(skip)
          .limit(limit)
          .lean();
        allData.trashback = bankSampah;
      }
      
      // Ambil data kode promo jika diminta
      if (includePromoCodes) {
        const promoCodes = await PromoCode.find()
          .skip(skip)
          .limit(limit)
          .lean();
        allData.promoCodes = promoCodes;
      }
      
      // Ambil data notifikasi jika diminta
      if (includeNotifications) {
        const notifications = await Notification.find()
          .skip(skip)
          .limit(limit)
          .lean();
        allData.notifications = notifications;
      }
      
      // Ambil data alamat jika diminta
      if (includeAddresses) {
        const addresses = await Address.find()
          .skip(skip)
          .limit(limit)
          .lean();
        allData.addresses = addresses;
      }
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

// Parameter untuk memilih field tertentu
const select = searchParams.get('select');
let selectFields = {};

if (select) {
  const fieldList = select.split(',');
  fieldList.forEach(field => {
    selectFields[field] = 1;
  });
}

// Gunakan selectFields dalam query database
if (Object.keys(selectFields).length > 0) {
  // Contoh penggunaan dalam case 'products'
  if (dataType === 'products' || (includeProducts && !dataType)) {
    const products = await Product.find()
      .select(selectFields)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Parameter untuk chunking
    const chunk = parseInt(searchParams.get('chunk') || '1');
    const chunkSize = parseInt(searchParams.get('chunkSize') || '10');
    const skipChunk = (chunk - 1) * chunkSize;
    
    // Gunakan skipChunk dan chunkSize untuk pagination
    if (dataType === 'products') {
      const products = await Product.find()
        .select('name description price offerPrice image category kantin')
        .skip(skipChunk)
        .limit(chunkSize)
        .lean();
      const totalProducts = await Product.countDocuments();
      allData.products = products;
      allData.chunking = {
        total: totalProducts,
        chunk,
        chunkSize,
        totalChunks: Math.ceil(totalProducts / chunkSize)
      };
    } else if (includeProducts) {
      allData.products = products;
    }
  }
  
  // Lakukan hal yang sama untuk jenis data lainnya
  // ...
}

// Parameter untuk kompresi data
const compress = searchParams.get('compress') === 'true';

// Fungsi untuk mengompres objek
function compressObject(obj) {
  if (!compress) return obj;
  
  const result = {};
  const keysToKeep = ['id', 'name', 'price', 'image'];
  
  keysToKeep.forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  
  return result;
}

// Kompres data sebelum mengembalikan respons
if (allData.products) {
  allData.products = allData.products.map(compressObject);
}

// Parameter untuk membatasi ukuran respons
const maxTokens = parseInt(searchParams.get('maxTokens') || '8000');

// Fungsi untuk memperkirakan jumlah token dalam string
function estimateTokens(str) {
  return str.length / 4; // Perkiraan kasar: 1 token ≈ 4 karakter
}

// Batasi ukuran respons
let responseJSON = JSON.stringify({ 
  success: true, 
  data: allData,
  timestamp: new Date().toISOString()
});

if (estimateTokens(responseJSON) > maxTokens) {
  // Jika respons terlalu besar, kurangi jumlah data
  if (allData.products && allData.products.length > 3) {
    allData.products = allData.products.slice(0, 3);
    allData.truncated = true;
  }
  // Lakukan hal yang sama untuk jenis data lainnya
  
  responseJSON = JSON.stringify({ 
    success: true, 
    data: allData,
    truncated: true,
    timestamp: new Date().toISOString()
  });
}

return NextResponse.json(JSON.parse(responseJSON));
}

// ... existing code ...