import connectDB from '@/config/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'

// GET - Mengambil semua data produk untuk AI
export async function GET(request) {
    try {
        await connectDB()

        // Get query parameters untuk filtering
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const kantin = searchParams.get('kantin')
        const maxCalories = searchParams.get('maxCalories')
        const maxCarbon = searchParams.get('maxCarbon')
        const limit = parseInt(searchParams.get('limit')) || 500
        const compact = searchParams.get('compact') === 'true'
        const refresh = searchParams.get('refresh') === 'true' // Parameter untuk refresh data

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

        // Jika refresh=true, update semua data produk dengan timestamp terbaru
        if (refresh) {
            await Product.updateMany({}, { 
                $set: { 
                    lastUpdated: new Date(),
                    dataVersion: Date.now() // Tambahkan versi data untuk tracking
                }
            })
        }

        // Pilih field berdasarkan mode compact atau full
        let selectFields
        if (compact) {
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
                offerPrice: 1,
                orderCount: 1,
                lastUpdated: 1
            }
        } else {
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
                orderCount: 1,
                lastUpdated: 1,
                createdAt: 1
            }
        }

        // Ambil produk dengan data terbaru
        const products = await Product.find(query)
            .sort({ orderCount: -1, lastUpdated: -1, createdAt: -1 })
            .limit(Math.min(limit, 1000))
            .select(selectFields)
            .lean()

        // Hitung total produk untuk statistik
        const totalCount = await Product.countDocuments(query)

        // Format data berdasarkan mode
        let aiOptimizedData
        if (compact) {
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
                    jumlahPesan: product.orderCount || 0,
                    terakhirUpdate: product.lastUpdated,
                    tags: generateCompactTags(product, totalCarbon)
                }
            })
        } else {
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
                    jumlahPesan: product.orderCount || 0,
                    terakhirUpdate: product.lastUpdated,
                    
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
            totalProdukDatabase: totalCount,
            mode: compact ? 'compact' : 'full',
            produk: finalData,
            metadata: {
                timestamp: new Date().toISOString(),
                optimizedForAI: true,
                tokenLimit: '8000',
                maxProducts: limit,
                refreshed: refresh,
                filters: { category, kantin, maxCalories, maxCarbon }
            }
        }

        // Cek ukuran response dan adaptasi otomatis
        let responseString = JSON.stringify(responseData)
        const estimatedTokens = Math.ceil(responseString.length / 4)
        
        if (estimatedTokens > 7500) {
            let reductionFactor = 7500 / estimatedTokens
            let targetCount = Math.floor(finalData.length * reductionFactor)
            
            // Prioritaskan produk dengan update terbaru dan populer
            const kantinGroups = {}
            finalData.forEach(product => {
                if (!kantinGroups[product.kantin]) kantinGroups[product.kantin] = []
                kantinGroups[product.kantin].push(product)
            })
            
            const balancedProducts = []
            const kantinNames = Object.keys(kantinGroups)
            const perKantin = Math.ceil(targetCount / kantinNames.length)
            
            kantinNames.forEach(kantin => {
                // Urutkan berdasarkan update terbaru dan popularitas
                kantinGroups[kantin].sort((a, b) => {
                    const dateA = new Date(a.terakhirUpdate || 0)
                    const dateB = new Date(b.terakhirUpdate || 0)
                    if (dateB - dateA !== 0) return dateB - dateA
                    return (b.jumlahPesan || 0) - (a.jumlahPesan || 0)
                })
                balancedProducts.push(...kantinGroups[kantin].slice(0, perKantin))
            })
            
            finalData = balancedProducts.slice(0, targetCount)
            
            responseData.produk = finalData
            responseData.totalProduk = finalData.length
            responseData.metadata.truncated = true
            responseData.metadata.originalCount = aiOptimizedData.length
            responseData.metadata.reason = 'Token limit optimization - prioritized recent updates'
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

// PUT - Update jumlah menu/produk
export async function PUT(request) {
    try {
        await connectDB()
        
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: user not logged in" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { action, productId, productIds, increment, orderCount } = body

        let result

        switch (action) {
            case 'increment':
                // Increment order count untuk produk tertentu
                if (productId) {
                    result = await Product.findByIdAndUpdate(
                        productId,
                        { 
                            $inc: { orderCount: increment || 1 },
                            $set: { lastUpdated: new Date() }
                        },
                        { new: true }
                    )
                }
                break

            case 'set':
                // Set order count ke nilai tertentu
                if (productId && typeof orderCount === 'number') {
                    result = await Product.findByIdAndUpdate(
                        productId,
                        { 
                            $set: { 
                                orderCount: orderCount,
                                lastUpdated: new Date()
                            }
                        },
                        { new: true }
                    )
                }
                break

            case 'bulk-increment':
                // Bulk increment untuk multiple produk
                if (productIds && Array.isArray(productIds)) {
                    result = await Product.updateMany(
                        { _id: { $in: productIds } },
                        { 
                            $inc: { orderCount: increment || 1 },
                            $set: { lastUpdated: new Date() }
                        }
                    )
                }
                break

            case 'reset-all':
                // Reset semua order count (hanya untuk admin)
                result = await Product.updateMany(
                    {},
                    { 
                        $set: { 
                            orderCount: 0,
                            lastUpdated: new Date()
                        }
                    }
                )
                break

            case 'refresh-data':
                // Refresh semua data dengan timestamp baru
                result = await Product.updateMany(
                    {},
                    { 
                        $set: { 
                            lastUpdated: new Date(),
                            dataVersion: Date.now()
                        }
                    }
                )
                break

            default:
                return NextResponse.json(
                    { success: false, message: "Invalid action. Use: increment, set, bulk-increment, reset-all, or refresh-data" },
                    { status: 400 }
                )
        }

        if (!result) {
            return NextResponse.json(
                { success: false, message: "Update failed or product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Successfully executed ${action}`,
            result: result,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}

// PATCH - Update data produk tertentu
export async function PATCH(request) {
    try {
        await connectDB()
        
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: user not logged in" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId, updates } = body

        if (!productId || !updates) {
            return NextResponse.json(
                { success: false, message: "productId and updates are required" },
                { status: 400 }
            )
        }

        // Tambahkan timestamp update
        updates.lastUpdated = new Date()

        const result = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!result) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product: result,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}

// Fungsi helper untuk tag compact
function generateCompactTags(product, totalCarbon) {
    const tags = []
    
    if (product.calories <= 300) tags.push('LC') // Low Calorie
    if (product.protein >= 15) tags.push('HP') // High Protein
    if (totalCarbon <= 2) tags.push('ECO') // Eco Friendly
    if (product.totalFat <= 5) tags.push('LF') // Low Fat
    if ((product.orderCount || 0) >= 10) tags.push('POP') // Popular
    
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
    
    // Rekomendasi berdasarkan popularitas
    if ((product.orderCount || 0) >= 20) categories.push('sangat-populer')
    if ((product.orderCount || 0) >= 10) categories.push('populer')
    if ((product.orderCount || 0) <= 2) categories.push('jarang-dipesan')
    
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