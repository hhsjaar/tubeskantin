import { v2 as cloudinary } from "cloudinary";
import { getAuth } from '@clerk/nextjs/server'
import authSeller from "@/lib/authSeller";
import authKandok from "@/lib/authkandok";
import authKantek from "@/lib/authkantek";
import authKansip from "@/lib/authkansip";
import authKantel from "@/lib/authkantel";
import authBerkah from "@/lib/authberkah";
import authKantintn from "@/lib/authkantintn";
import authTaniamart from "@/lib/authtaniamart";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        
        if (!isSeller) {
            const isKandok = await authKandok(userId);
            const isKantek = await authKantek(userId);
            const isKansip = await authKansip(userId);
            const isKantel = await authKantel(userId);
            const isBerkah = await authBerkah(userId);
            const isKantintn = await authKantintn(userId);
            const isTaniamart = await authTaniamart(userId);
            
            if (!isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
                return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses' });
            }
        }

        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        
        // Menambahkan field kantin
        const kantin = formData.get('kantin');
        
        const portionSize = formData.get('portionSize');
        const calories = formData.get('calories');
        const totalFat = formData.get('totalFat');
        const cholesterol = formData.get('cholesterol');
        const sodium = formData.get('sodium');
        const totalCarbohydrates = formData.get('totalCarbohydrates');
        const protein = formData.get('protein');
        const vitaminD = formData.get('vitaminD');
        const calcium = formData.get('calcium');
        const iron = formData.get('iron');
        const potassium = formData.get('potassium');
        const vitaminA = formData.get('vitaminA');
        const vitaminC = formData.get('vitaminC');

        // Menambahkan karbon jejak
        const karbonMakanan = formData.get('karbonMakanan');
        const karbonPengolahan = formData.get('karbonPengolahan');
        const karbonTransportasiLimbah = formData.get('karbonTransportasiLimbah');

        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'Foto belum diupload' });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map(result => result.secure_url);

        await connectDB();
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            kantin,
            portionSize,
            calories: Number(calories),
            totalFat: Number(totalFat),
            cholesterol: Number(cholesterol),
            sodium: Number(sodium),
            totalCarbohydrates: Number(totalCarbohydrates),
            protein: Number(protein),
            vitaminD: Number(vitaminD),
            calcium: Number(calcium),
            iron: Number(iron),
            potassium: Number(potassium),
            vitaminA: Number(vitaminA),
            vitaminC: Number(vitaminC),
            image,
            karbonMakanan: Number(karbonMakanan),
            karbonPengolahan: Number(karbonPengolahan),
            karbonTransportasiLimbah: Number(karbonTransportasiLimbah),
            date: Date.now(),
        });

        return NextResponse.json({ success: true, message: 'Berhasil Upload', newProduct });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}