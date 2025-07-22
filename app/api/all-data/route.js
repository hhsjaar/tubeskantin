import connectDB from '@/config/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        await connectDB()

        // Get query parameters untuk filtering
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const kantin = searchParams.get('kantin')
        const maxCalories = searchParams.get('maxCalories')
        const maxCarbon = searchParams.get('maxCarbon')
        const limit = parseInt(searchParams.get('limit')) || 500 // Default 500 produk
        const compact = searchParams.get('compact') === 'true' // Mode ringkas untuk lebih banyak data
        const menuCountOnly = searchParams.get('menuCountOnly') === 'true' // Mode hanya menampilkan jumlah menu

        // Jika hanya ingin mendapatkan jumlah menu per kantin
        if (menuCountOnly) {
            const menuCounts = await Product.aggregate([
                { $group: { _id: "$kantin", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
            
            // Format data untuk respons
            const kantinMenuCounts = {}
            menuCounts.forEach(item => {
                if (item._id) { // Pastikan kantin tidak null/undefined
                    kantinMenuCounts[item._id] = item.count
                }
            })
            
            return NextResponse.json({
                success: true,
                menuCounts: kantinMenuCounts,
                totalKantin: Object.keys(kantinMenuCounts).length,
                totalMenu: Object.values(kantinMenuCounts).reduce((a, b) => a + b, 0),
                timestamp: new Date().toISOString()
            })
        }

        let query = {}

        // Filter berdasarkan kategori
        if (category) {
            query.category = { $regex: category, $options: 'i' }
        }

        // Filter berdasarkan kantin
        if (kantin) {
            query.kantin = kantin
        }

        // Filter berdasarkan kalori maksimal
        if (maxCalories) {
            query.calories = { $lte: parseInt(maxCalories) }
        }

        // Filter berdasarkan jejak karbon maksimal
        if (maxCarbon) {
            query.$expr = {
                $lte: [
                    { $add: ['$karbonMakanan', '$karbonPengolahan', '$karbonTransportasiLimbah'] },
                    parseInt(maxCarbon)
                ]
            }
        }

        // Pilih field berdasarkan mode compact atau full
        let selectFields
        if (compact) {
            // Mode compact: hanya field penting untuk menghemat token
            selectFields = {
                name: 1,
                category: 1,
                kantin: 1,
                calories: 1,
                protein: 1,
                totalFat: 1,
                karbonMakanan: 1,
                karbonPengolahan: 1,
                karbonTransportasiLimbah: 1,
                price: 1,
                offerPrice: 1
            }
        } else {
            // Mode full: semua field nutrisi
            selectFields = {
                name: 1,
                description: 1,
                price: 1,
                offerPrice: 1,
                category: 1,
                kantin: 1,
                portionSize: 1,
                calories: 1,
                totalFat: 1,
                cholesterol: 1,
                sodium: 1,
                totalCarbohydrates: 1,
                protein: 1,
                vitaminA: 1,
                vitaminC: 1,
                vitaminD: 1,
                calcium: 1,
                iron: 1,
                potassium: 1,
                karbonMakanan: 1,
                karbonPengolahan: 1,
                karbonTransportasiLimbah: 1,
                orderCount: 1
            }
        }

        // Ambil produk dengan batasan yang fleksibel
        const products = await Product.find(query)
            .sort({ orderCount: -1, createdAt: -1 })
            .limit(Math.min(limit, 1000)) // Maksimal 1000 produk
            .select(selectFields)
            .lean()

        // Hitung jumlah menu per kantin dari hasil query
        const kantinMenuCounts = {}
        products.forEach(product => {
            if (product.kantin) {
                kantinMenuCounts[product.kantin] = (kantinMenuCounts[product.kantin] || 0) + 1
            }
        })

        // Format data berdasarkan mode
        let aiOptimizedData
        if (compact) {
            // Format ultra-compact untuk dataset besar
            aiOptimizedData = products.map(product => {
                const totalCarbon = product.karbonMakanan + product.karbonPengolahan + product.karbonTransportasiLimbah
                return {
                    id: product._id,
                    nama: product.name,
                    kategori: product.category,
                    kantin: product.kantin,
                    kalori: product.calories,
                    protein: product.protein,
                    lemak: product.totalFat,
                    karbon: totalCarbon,
                    harga: product.offerPrice,
                    tags: generateCompactTags(product, totalCarbon)
                }
            })
        } else {
            // Format lengkap untuk dataset sedang
            aiOptimizedData = products.map(product => {
                const totalCarbon = product.karbonMakanan + product.karbonPengolahan + product.karbonTransportasiLimbah
                
                return {
                    id: product._id,
                    nama: product.name,
                    deskripsi: product.description,
                    harga: product.offerPrice,
                    kategori: product.category,
                    kantin: product.kantin,
                    porsi: product.portionSize,
                    
                    nutrisi: {
                        kalori: product.calories,
                        lemak: product.totalFat,
                        kolesterol: product.cholesterol,
                        sodium: product.sodium,
                        karbohidrat: product.totalCarbohydrates,
                        protein: product.protein,
                        vitaminA: product.vitaminA,
                        vitaminC: product.vitaminC,
                        vitaminD: product.vitaminD,
                        kalsium: product.calcium,
                        zatBesi: product.iron,
                        kalium: product.potassium
                    },
                    
                    jejakKarbon: {
                        total: totalCarbon,
                        detail: [product.karbonMakanan, product.karbonPengolahan, product.karbonTransportasiLimbah]
                    },
                    
                    kategoriRekomendasi: generateRecommendationCategories(product, totalCarbon)
                }
            })
        }

        // Sistem adaptif untuk mengelola ukuran response
        let finalData = aiOptimizedData
        let responseData = {
            success: true,
            totalProduk: finalData.length,
            mode: compact ? 'compact' : 'full',
            produk: finalData,
            menuPerKantin: kantinMenuCounts, // Tambahkan informasi jumlah menu per kantin
            totalKantin: Object.keys(kantinMenuCounts).length,
            metadata: {
                timestamp: new Date().toISOString(),
                optimizedForAI: true,
                tokenLimit: '8000',
                maxProducts: limit,
                filters: { category, kantin, maxCalories, maxCarbon }
            }
        }

        // Cek ukuran response dan adaptasi otomatis
        let responseString = JSON.stringify(responseData)
        const estimatedTokens = Math.ceil(responseString.length / 4) // Estimasi 4 karakter per token
        
        if (estimatedTokens > 7500) { // Sisakan buffer 500 token
            // Strategi pengurangan bertahap
            let reductionFactor = 7500 / estimatedTokens
            let targetCount = Math.floor(finalData.length * reductionFactor)
            
            // Prioritaskan produk populer dan beragam kantin
            const kantinGroups = {}
            finalData.forEach(product => {
                if (!kantinGroups[product.kantin]) kantinGroups[product.kantin] = []
                kantinGroups[product.kantin].push(product)
            })
            
            // Ambil produk secara merata dari setiap kantin
            const balancedProducts = []
            const kantinNames = Object.keys(kantinGroups)
            const perKantin = Math.ceil(targetCount / kantinNames.length)
            
            kantinNames.forEach(kantin => {
                balancedProducts.push(...kantinGroups[kantin].slice(0, perKantin))
            })
            
            finalData = balancedProducts.slice(0, targetCount)
            
            responseData.produk = finalData
            responseData.totalProduk = finalData.length
            responseData.metadata.truncated = true
            responseData.metadata.originalCount = aiOptimizedData.length
            responseData.metadata.reason = 'Token limit optimization - balanced selection'
            responseData.metadata.estimatedTokens = estimatedTokens
        }

        return NextResponse.json(responseData)

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message,
            timestamp: new Date().toISOString()
        })
    }
}

// Fungsi helper untuk tag compact
function generateCompactTags(product, totalCarbon) {
    const tags = []
    
    if (product.calories <= 300) tags.push('LC') // Low Calorie
    if (product.protein >= 15) tags.push('HP') // High Protein
    if (totalCarbon <= 2) tags.push('ECO') // Eco Friendly
    if (product.totalFat <= 5) tags.push('LF') // Low Fat
    
    return tags
}

// Fungsi helper untuk kategori rekomendasi lengkap
function generateRecommendationCategories(product, totalCarbon) {
    const categories = []
    
    // Rekomendasi berdasarkan kalori
    if (product.calories <= 300) categories.push('rendah-kalori')
    if (product.calories >= 500) categories.push('tinggi-kalori')
    
    // Rekomendasi berdasarkan protein
    if (product.protein >= 15) categories.push('tinggi-protein')
    if (product.protein >= 20) categories.push('diet-protein')
    
    // Rekomendasi berdasarkan jejak karbon
    if (totalCarbon <= 2) categories.push('ramah-lingkungan')
    if (totalCarbon <= 1) categories.push('sangat-ramah-lingkungan')
    if (totalCarbon >= 5) categories.push('tinggi-emisi')
    
    // Rekomendasi berdasarkan lemak
    if (product.totalFat <= 5) categories.push('rendah-lemak')
    if (product.totalFat >= 20) categories.push('tinggi-lemak')
    
    // Rekomendasi berdasarkan sodium
    if (product.sodium <= 300) categories.push('rendah-garam')
    if (product.sodium >= 1000) categories.push('tinggi-garam')
    
    // Rekomendasi berdasarkan vitamin
    if (product.vitaminC >= 10) categories.push('tinggi-vitamin-c')
    if (product.vitaminA >= 100) categories.push('tinggi-vitamin-a')
    
    // Rekomendasi berdasarkan kategori makanan
    if (product.category.toLowerCase().includes('sayur')) categories.push('vegetarian')
    if (product.category.toLowerCase().includes('buah')) categories.push('buah-segar')
    if (product.category.toLowerCase().includes('nasi')) categories.push('karbohidrat-utama')
    
    // Rekomendasi diet khusus
    if (product.calories <= 400 && product.totalFat <= 10) categories.push('diet-sehat')
    if (product.protein >= 15 && product.totalFat <= 8) categories.push('diet-fitness')
    if (totalCarbon <= 2 && product.calories <= 350) categories.push('eco-diet')
    
    return categories
}