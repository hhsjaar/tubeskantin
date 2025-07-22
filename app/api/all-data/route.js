import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/config/db'
import Product from '@/models/Product'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Daftar kantin yang tersedia
const KANTIN_LIST = [
  "Kantin Teknik", 
  "Kantin Kodok", 
  "Kantin Telkom", 
  "Kantin Sipil", 
  "Kantin Berkah", 
  "Kantin Tata Niaga", 
  "Tania Mart"
]

// Endpoint GET untuk mendapatkan statistik kantin dan produk
export async function GET() {
  try {
    await connectDB()
    
    // Menghitung jumlah produk per kantin
    const kantinStats = {}
    for (const kantin of KANTIN_LIST) {
      kantinStats[kantin] = await Product.countDocuments({ kantin })
    }
    
    // Mendapatkan semua produk
    const products = await Product.find()
      .select('name description price image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()
    
    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      products
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// Endpoint POST untuk rekomendasi makanan berdasarkan prompt
export async function POST(req) {
  try {
    const { prompt } = await req.json()
    
    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        message: 'Prompt diperlukan untuk rekomendasi makanan' 
      }, { status: 400 })
    }
    
    await connectDB()
    
    // Menghitung jumlah produk per kantin
    const kantinStats = {}
    for (const kantin of KANTIN_LIST) {
      kantinStats[kantin] = await Product.countDocuments({ kantin })
    }
    
    // Mendapatkan produk untuk rekomendasi
    const products = await Product.find()
      .select('name description price image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()
    
    // Membuat prompt untuk OpenAI
    const systemPrompt = `
Kamu adalah asisten AI yang ahli dalam nutrisi dan jejak karbon makanan.
Berdasarkan permintaan pengguna, rekomendasikan 3-5 makanan dari daftar berikut yang paling sesuai:

${JSON.stringify(products, null, 2)}

Pertimbangkan nilai gizi (kalori, protein, karbohidrat, lemak) dan jejak karbon (karbonMakanan, karbonPengolahan, karbonTransportasiLimbah).

Berikan respons dalam format:
1. Penjelasan singkat mengapa makanan ini direkomendasikan (1-2 kalimat)
2. Daftar makanan yang direkomendasikan dengan format:
   - [Nama Makanan] dari [Nama Kantin] - [Kalori] kkal, [Protein]g protein, [Total Jejak Karbon]kg CO2e
3. Tips singkat untuk pola makan sehat dan ramah lingkungan (opsional)

Gunakan bahasa yang sama dengan yang digunakan pengguna dalam permintaannya.
`;

    // Mendapatkan rekomendasi dari OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      recommendation: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal memproses rekomendasi makanan' 
    }, { status: 500 })
  }
}