import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/config/db'
import Product from '@/models/Product'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Fungsi untuk mendapatkan statistik kantin
async function getKantinStats() {
  try {
    await connectDB()
    
    // Daftar semua kantin
    const kantinList = [
      "Kantin Teknik", 
      "Kantin Kodok", 
      "Kantin Telkom", 
      "Kantin Sipil", 
      "Kantin Berkah", 
      "Kantin Tata Niaga", 
      "Tania Mart"
    ]
    
    // Menghitung jumlah produk per kantin
    const kantinStats = {}
    
    for (const kantin of kantinList) {
      const count = await Product.countDocuments({ kantin })
      kantinStats[kantin] = count
    }
    
    return kantinStats
  } catch (error) {
    console.error('Error getting kantin stats:', error)
    return {}
  }
}

// Fungsi untuk mendapatkan semua produk dengan filter
async function getProducts(filter = {}) {
  try {
    await connectDB()
    
    const products = await Product.find(filter)
      .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()
    
    return products
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

// Fungsi untuk menganalisis prompt dan merekomendasikan makanan
async function analyzePromptAndRecommendFood(prompt, products) {
  try {
    // Membuat prompt untuk OpenAI
    const systemPrompt = `
Kamu adalah asisten AI yang ahli dalam nutrisi, makanan sehat, dan jejak karbon makanan. 
Tugas kamu adalah menganalisis permintaan pengguna dan merekomendasikan makanan dari kantin kampus yang sesuai dengan kebutuhan mereka.

Berikut adalah daftar makanan yang tersedia di kantin kampus dengan informasi nutrisi dan jejak karbon:
${JSON.stringify(products, null, 2)}

Berdasarkan permintaan pengguna, rekomendasikan 3-5 makanan yang paling sesuai. Pertimbangkan:
1. Nilai gizi (kalori, protein, karbohidrat, lemak, dll)
2. Jejak karbon (karbonMakanan, karbonPengolahan, karbonTransportasiLimbah)
3. Kantin tempat makanan tersedia

Berikan respons dalam format berikut:
1. Penjelasan singkat mengapa makanan ini direkomendasikan (1-2 kalimat)
2. Daftar makanan yang direkomendasikan dengan format:
   - [Nama Makanan] dari [Nama Kantin] - [Kalori] kkal, [Protein]g protein, [Total Jejak Karbon]kg CO2e
3. Tips singkat untuk pola makan sehat dan ramah lingkungan (opsional)

Gunakan bahasa yang sama dengan yang digunakan pengguna dalam permintaannya (Indonesia atau Inggris).
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('OpenAI Error:', error)
    return 'Maaf, terjadi kesalahan saat memproses rekomendasi makanan.'
  }
}

// Endpoint GET untuk mendapatkan statistik kantin
export async function GET() {
  try {
    const kantinStats = await getKantinStats()
    const products = await getProducts()
    
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
    
    // Mendapatkan statistik kantin
    const kantinStats = await getKantinStats()
    
    // Mendapatkan semua produk
    const products = await getProducts()
    
    // Menganalisis prompt dan merekomendasikan makanan
    const recommendation = await analyzePromptAndRecommendFood(prompt, products)
    
    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      recommendation
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal memproses rekomendasi makanan' 
    }, { status: 500 })
  }
}