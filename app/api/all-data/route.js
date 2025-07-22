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

// Kategori prompt yang umum digunakan
const PROMPT_CATEGORIES = {
  KESEHATAN: [
    'menu sehat', 'makanan sehat', 'makanan bergizi', 'makanan seimbang',
    'makanan diet', 'rendah kalori', 'rendah karbon', 'vegetarian'
  ],
  KECANTIKAN: [
    'anti jerawat', 'bikin glowing', 'kulit sehat'
  ],
  ENERGI: [
    'nambah energi', 'ngantuk', 'fokus belajar', 'anti stres', 'ngilangin pusing'
  ],
  EKONOMIS: [
    'murah', 'hemat', 'terjangkau'
  ],
  PREFERENSI: [
    'enak', 'kenyang lama', 'cemilan', 'sarapan', 'cepat saji', 'ringan',
    'nambah berat badan', 'protein tinggi'
  ]
}

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
    
    // Mengidentifikasi kategori prompt untuk memberikan respons yang lebih relevan
    const promptLower = prompt.toLowerCase()
    const identifiedCategories = []
    
    for (const [category, keywords] of Object.entries(PROMPT_CATEGORIES)) {
      for (const keyword of keywords) {
        if (promptLower.includes(keyword)) {
          identifiedCategories.push(category)
          break
        }
      }
    }
    
    // Membuat prompt untuk OpenAI
    const systemPrompt = `
Kamu adalah asisten AI yang ahli dalam nutrisi, makanan sehat, dan rekomendasi makanan kantin kampus.

Berikut adalah daftar makanan yang tersedia di kantin kampus dengan informasi nutrisi dan jejak karbon:
${JSON.stringify(products, null, 2)}

Pengguna menanyakan: "${prompt}"

${identifiedCategories.length > 0 ? `Prompt ini terkait dengan kategori: ${identifiedCategories.join(', ')}` : ''}

Berdasarkan permintaan pengguna, berikan rekomendasi makanan yang paling sesuai. Pertimbangkan:

1. Jika terkait KESEHATAN: fokus pada nilai gizi, kalori, dan jejak karbon
2. Jika terkait KECANTIKAN: fokus pada makanan yang baik untuk kulit dan antioksidan
3. Jika terkait ENERGI: fokus pada makanan yang memberikan energi dan meningkatkan fokus
4. Jika terkait EKONOMIS: fokus pada makanan yang terjangkau namun tetap berkualitas
5. Jika terkait PREFERENSI: fokus pada rasa dan kepuasan

Berikan respons dalam format:
1. Penjelasan singkat mengapa makanan ini direkomendasikan (1-2 kalimat)
2. Daftar 3-5 makanan yang direkomendasikan dengan format:
   - [Nama Makanan] dari [Nama Kantin] - [Kalori] kkal, [Protein]g protein
3. Tips singkat yang relevan dengan permintaan pengguna (opsional)

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
      max_tokens: 800,
    })

    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      promptCategories: identifiedCategories,
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