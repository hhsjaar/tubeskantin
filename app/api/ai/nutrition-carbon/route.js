import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const { name, description } = await req.json()

    const prompt = `
Nama Produk: ${name}
Deskripsi: ${description}

Bayangkan kamu adalah ahli gizi dan sustainability yang bertugas menilai makanan dari kantin kampus. Makanan ini bukan dari restoran mewah, tapi dari kantin mahasiswa biasa dengan porsi hemat dan harga terjangkau.

Tugas kamu adalah:
1. Menganalisis estimasi nilai gizi dan jejak karbon dari makanan ini.
2. Memberikan hasil dalam format JSON seperti berikut, TANPA PENJELASAN TAMBAHAN:

{
  "calories": number, // sekitar 200–600 kkal
  "totalFat": number, // gram
  "cholesterol": number, // mg
  "sodium": number, // mg
  "totalCarbohydrates": number, // gram
  "protein": number, // gram
  "vitaminD": number, // IU
  "calcium": number, // mg
  "iron": number, // mg
  "potassium": number, // mg
  "vitaminA": number, // IU
  "vitaminC": number, // mg
  "karbonMakanan": number, // kg CO2e, biasanya 0.1–0.6
  "karbonPengolahan": number, // kg CO2e
  "karbonTransportasiLimbah": number // kg CO2e
}

Gunakan estimasi paling masuk akal sesuai standar kantin mahasiswa Indonesia. Tidak perlu menyertakan penjelasan apa pun, cukup JSON saja.
`


    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const rawContent = completion.choices[0].message.content
    const parsed = JSON.parse(rawContent)

    return NextResponse.json({ success: true, ...parsed })
  } catch (error) {
    console.error('OpenAI Error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memproses data AI' }, { status: 500 })
  }
}
