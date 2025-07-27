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
    'menu sehat', 'makanan sehat', 'makanan bergizi', 'makanan seimbang', 'gizi seimbang',
    'rendah kalori', 'rendah gula', 'rendah garam', 'rendah karbon', 'vegetarian', 'vegan',
    'makanan untuk lansia', 'makanan untuk penderita diabetes', 'menu diet', 'nutrisi lengkap',
    'vitamin', 'mineral', 'serat tinggi', 'antioksidan', 'superfood', 'organic', 'natural',
    'balanced diet', 'healthy eating', 'clean eating', 'wholesome', 'nutritious'
  ],
  KECANTIKAN: [
    'anti jerawat', 'jerawatan', 'kulit sehat', 'bikin glowing', 'glowing', 'kulit cerah',
    'anti aging', 'awet muda', 'kulit bersih', 'detox', 'cleansing', 'skincare dari dalam',
    'collagen', 'vitamin c', 'vitamin e', 'omega 3', 'antioksidan untuk kulit',
    'glow up', 'skin goals', 'clear skin', 'healthy skin', 'radiant skin'
  ],
  ENERGI: [
    'nambah energi', 'ngantuk', 'fokus belajar', 'anti stres', 'biar semangat',
    'bikin melek', 'hilangin capek', 'mood booster', 'boost energy', 'stamina',
    'konsentrasi', 'brain food', 'mental clarity', 'alertness', 'productivity',
    'anti lelah', 'fresh', 'revitalize', 'recharge', 'power up'
  ],
  EKONOMIS: [
    'murah', 'hemat', 'terjangkau', 'low budget', 'dompet tipis', 'broke student',
    'budget friendly', 'affordable', 'cheap eats', 'student budget', 'ekonomis',
    'value for money', 'bang for buck', 'cost effective', 'inexpensive'
  ],
  PREFERENSI: [
    'enak', 'cepet kenyang', 'ngenyangin', 'cemilan', 'sarapan', 'cepat saji', 'ringan',
    'nambah berat badan', 'protein tinggi', 'kenyang lama', 'ga ribet', 'grab and go',
    'comfort food', 'soul food', 'guilty pleasure', 'indulgent', 'satisfying',
    'filling', 'hearty', 'substantial', 'quick bite', 'on the go'
  ],
  GEN_Z_SLANG: [
    'bestie', 'periodt', 'no cap', 'fr fr', 'slaps', 'hits different', 'bussin',
    'fire', 'lowkey', 'highkey', 'mid', 'sus', 'bet', 'say less', 'vibes',
    'mood', 'aesthetic', 'slay', 'iconic', 'legend', 'queen', 'king',
    'main character energy', 'self care', 'glow up', 'that girl', 'soft life'
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
      .select('name description price offerPrice image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah isAvailable')
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

    const products = await Product.find({ isAvailable: { $ne: false } })
      .select('name description price offerPrice image kantin calories protein totalCarbohydrates totalFat karbonMakanan karbonPengolahan karbonTransportasiLimbah')
      .lean()

    const promptLower = prompt.toLowerCase()
    const identifiedCategories = []
    let isGenZStyle = false

    // Deteksi kategori dan gaya bahasa
    for (const [category, keywords] of Object.entries(PROMPT_CATEGORIES)) {
      for (const keyword of keywords) {
        if (promptLower.includes(keyword)) {
          identifiedCategories.push(category)
          if (category === 'GEN_Z_SLANG') {
            isGenZStyle = true
          }
          break
        }
      }
    }

    // Deteksi gaya bahasa informal/Gen Z
    const informalIndicators = ['gue', 'gw', 'lu', 'elu', 'dong', 'sih', 'nih', 'deh', 'banget', 'bgt', 'wkwk', 'hehe', 'hihi']
    const hasInformalLanguage = informalIndicators.some(indicator => promptLower.includes(indicator))
    
    if (hasInformalLanguage) {
      isGenZStyle = true
    }

    // Ringkasan produk dengan informasi lengkap untuk rekomendasi yang lebih akurat
    const detailedProducts = products.map(p => ({
      name: p.name,
      description: p.description || '',
      kantin: p.kantin,
      price: p.offerPrice || p.price,
      calories: p.calories || 0,
      protein: p.protein || 0,
      totalFat: p.totalFat || 0,
      totalCarbohydrates: p.totalCarbohydrates || 0,
      carbonFootprint: {
        makanan: p.karbonMakanan || 0,
        pengolahan: p.karbonPengolahan || 0,
        transportasi: p.karbonTransportasiLimbah || 0,
        total: (p.karbonMakanan || 0) + (p.karbonPengolahan || 0) + (p.karbonTransportasiLimbah || 0)
      }
    }))

    const systemPrompt = `
Kamu adalah NutriBot, asisten AI gizi kampus yang super update dan paham banget sama kebutuhan anak muda zaman now! 🔥

Data makanan dari kantin kampus:
${JSON.stringify(detailedProducts, null, 2)}

Permintaan user: "${prompt}"
Kategori terdeteksi: ${identifiedCategories.length > 0 ? identifiedCategories.join(', ') : 'General'}
Gaya bahasa: ${isGenZStyle ? 'Casual/Gen Z' : 'Formal'}

TUGAS UTAMA:
1. ANALISIS KEBUTUHAN: Pahami betul apa yang user mau (kesehatan, kecantikan, energi, budget, dll)
2. REKOMENDASI AKURAT: Pilih 4-6 makanan yang BENAR-BENAR sesuai dengan:
   - Nutrisi yang dibutuhkan (kalori, protein, lemak, karbohidrat)
   - Budget (jika disebutkan)
   - Tujuan spesifik (jerawat, energi, diet, dll)
   - Carbon footprint (untuk yang peduli lingkungan)

3. FORMAT JAWABAN:
   ${isGenZStyle ? `
   - Pembuka: Pake bahasa santai, emoji, slang Gen Z
   - Penjelasan: Kenapa rekomendasi ini cocok (2-3 kalimat)
   - List makanan: Format: "✨ [Nama] dari [Kantin] - Rp[Harga] (Kalori: [X]kkal, Protein: [X]g)"
   - Tips tambahan: Kasih saran praktis dengan bahasa gaul
   - Penutup: Motivasi/doa dengan emoji
   ` : `
   - Pembuka: Bahasa sopan dan informatif
   - Penjelasan: Analisis nutrisi yang mendalam
   - List makanan: Format: "• [Nama] dari [Kantin] - Rp[Harga] | Kalori: [X]kkal, Protein: [X]g, Lemak: [X]g"
   - Tips tambahan: Saran kesehatan yang evidence-based
   - Penutup: Profesional dan supportif
   `}

SPESIAL FOCUS:
- Untuk "makanan sehat/bergizi/seimbang": Prioritaskan yang tinggi protein, serat, vitamin, rendah lemak jenuh
- Untuk "anti jerawat": Fokus pada makanan rendah glikemik, tinggi omega-3, antioksidan, hindari dairy/processed food
- Untuk Gen Z vibes: Pake bahasa gaul, emoji, reference pop culture
- Untuk budget: Urutkan dari yang termurah, kasih alternatif

CONTOH RESPONS GEN Z:
"Bestie! Buat kulit glowing anti jerawat, nih rekomendasi yang bakal bikin kamu slay! ✨

Kenapa pilihan ini fire? Soalnya rendah glikemik, tinggi antioksidan, dan ga bikin hormonal imbalance yang trigger jerawat!

✨ Gado-gado dari Kantin Berkah - Rp15.000 (Kalori: 250kkal, Protein: 12g)
✨ Pecel Sayur dari Kantin Sipil - Rp12.000 (Kalori: 200kkal, Protein: 8g)

Tips queen: Minum air putih minimal 2L sehari, tidur cukup, dan jangan lupa sunscreen! Your skin will thank you later 💅

Semoga glowing terus ya bestie! 🌟"

JANGAN LUPA:
- Selalu sebutkan harga yang akurat
- Kalori dan protein harus sesuai data
- Kasih alasan ilmiah tapi dengan bahasa yang sesuai target
- Variasikan kantin yang direkomendasikan
    `.trim()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 7000
    })

    return NextResponse.json({ 
      success: true, 
      kantinStats,
      totalProducts: products.length,
      promptCategories: identifiedCategories,
      languageStyle: isGenZStyle ? 'casual' : 'formal',
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
