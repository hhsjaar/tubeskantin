import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/config/db'
import Product from '@/models/Product'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Daftar kantin kampus
const KANTIN_LIST = [
  "Kantin Teknik", 
  "Kantin Kodok", 
  "Kantin Telkom", 
  "Kantin Sipil", 
  "Kantin Berkah", 
  "Kantin Tata Niaga", 
  "Tania Mart"
]

// Kategori prompt untuk segmentasi kebutuhan pengguna
const PROMPT_CATEGORIES = {
  KESEHATAN: [
    'menu sehat', 'makanan sehat', 'makanan bergizi', 'makanan seimbang',
    'rendah kalori', 'rendah gula', 'rendah garam', 'rendah karbon', 'vegetarian',
    'makanan untuk lansia', 'makanan untuk penderita diabetes', 'menu diet', 'nutrisi lengkap'
  ],
  KECANTIKAN: [
    'anti jerawat', 'jerawatan', 'kulit sehat', 'bikin glowing', 'glowing', 'kulit cerah'
  ],
  ENERGI: [
    'nambah energi', 'ngantuk', 'fokus belajar', 'anti stres', 'biar semangat',
    'bikin melek', 'hilangin capek', 'mood booster'
  ],
  EKONOMIS: [
    'murah', 'hemat', 'terjangkau', 'low budget', 'dompet tipis', 'broke student'
  ],
  PREFERENSI: [
    'enak', 'cepet kenyang', 'ngenyangin', 'cemilan', 'sarapan', 'cepat saji', 'ringan',
    'nambah berat badan', 'protein tinggi', 'kenyang lama', 'ga ribet', 'grab and go'
  ]
}

// ========== [GET] Endpoint: Statistik Produk & Kantin ==========
export async function GET() {
  try {
    await connectDB()

    const kantinStats = {}
    for (const kantin of KANTIN_LIST) {
      kantinStats[kantin] = await Product.countDocuments({ kantin })
    }

    const products = await Product.find()
      .select('name description offerPrice image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()

    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      products
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}

// ========== [POST] Endpoint: Rekomendasi Makanan ==========
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

    const kantinStats = {}
    for (const kantin of KANTIN_LIST) {
      kantinStats[kantin] = await Product.countDocuments({ kantin })
    }

    const products = await Product.find()
      .select('name description offerPrice image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()

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

    // Ringkasan produk agar efisien token
    const summarizedProducts = products.map(p => ({
      name: p.name,
      kantin: p.kantin,
      calories: p.calories,
      protein: p.protein,
      totalFat: p.totalFat,
      totalCarbohydrates: p.totalCarbohydrates,
      karbon: {
        makanan: p.karbonMakanan,
        pengolahan: p.karbonPengolahan,
        transportasi: p.karbonTransportasiLimbah
      }
    }))

    const systemPrompt = `
Kamu adalah asisten AI gizi kampus yang memahami kebutuhan mahasiswa muda dan dosen/lansia.

Berikut adalah daftar makanan dari berbagai kantin kampus:
${JSON.stringify(summarizedProducts)}

Permintaan pengguna: "${prompt}"
${identifiedCategories.length > 0 ? `Topik terkait: ${identifiedCategories.join(', ')}` : ''}

Tugasmu:
1. Beri penjelasan singkat kenapa rekomendasi ini cocok (1-2 kalimat)
2. Daftarkan 3–5 makanan yang direkomendasikan, dengan format:
   - [Nama Makanan] dari [Kantin] – [Kalori] kkal, [Protein]g protein
3. Tambahkan tips tambahan jika relevan (opsional)

Gunakan gaya bahasa sesuai gaya pengguna. Jika kasual (mahasiswa), gunakan bahasa santai. Jika formal (dosen/orang tua), gunakan bahasa sopan dan informatif.
    `.trim()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 700
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
