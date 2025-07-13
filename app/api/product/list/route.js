import connectDB from '@/config/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        await connectDB()

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const sort = searchParams.get('sort')

        let query = {}
        let sortOptions = {}

        // Apply sorting based on query parameter
        if (sort === 'popular') {
            // Sort by order count for popular items
            sortOptions.orderCount = -1 // -1 for descending order
        } else if (sort === 'new') {
            // Sort by creation date for new items
            sortOptions.createdAt = -1
        }

        const products = await Product.find(query)
            .sort(sortOptions)
            .select('name description price offerPrice image category kantin orderCount createdAt portionSize calories totalFat cholesterol sodium totalCarbohydrates protein vitaminD calcium iron potassium vitaminA vitaminC karbonMakanan karbonPengolahan karbonTransportasiLimbah') // Select specific fields
            .lean() // Convert to plain JavaScript objects

        return NextResponse.json({ success: true, products })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}