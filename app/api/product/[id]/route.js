// app/api/product/[id]/route.js
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import authKandok from '@/lib/authkandok';
import authKantek from '@/lib/authkantek';
import authKansip from '@/lib/authkansip';
import authKantel from '@/lib/authkantel';
import authBerkah from '@/lib/authberkah';
import authKantintn from '@/lib/authkantintn';
import authTaniamart from '@/lib/authtaniamart';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary - TAMBAHKAN INI
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request, { params }) {
  try {
    console.log('GET request received for product');
    await connectDB();
    const { id } = await params; // Await params sebelum mengakses id
    console.log('Product ID:', id);
    const product = await Product.findById(id);
    if (!product) {
      console.log('Product not found:', id);
      return NextResponse.json({ success: false, message: 'Produk Tidak Ada' }, { status: 404 });
    }
    console.log('Product found:', product.name);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log('DELETE request received');
    const { userId } = getAuth(request);
    
    // Verifikasi apakah pengguna adalah dari salah satu kantin
    const isKandok = await authKandok(userId);
    const isKantek = await authKantek(userId);
    const isKansip = await authKansip(userId);
    const isKantel = await authKantel(userId);
    const isBerkah = await authBerkah(userId);
    const isKantintn = await authKantintn(userId);
    const isTaniamart = await authTaniamart(userId);

    if (!isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
      return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses' }, { status: 403 });
    }

    await connectDB();

    const { id } = await params; // Await params sebelum mengakses id
    console.log('Deleting product ID:', id);
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Produk tidak ada' }, { status: 404 });
    }

    // Verifikasi apakah produk milik kantin yang sesuai
    const kantinUser = isKandok || isKantek || isKansip || isKantel || isBerkah || isKantintn || isTaniamart;
    if (String(product.seller) !== String(kantinUser._id)) {
      return NextResponse.json({ success: false, message: 'Dilarang!' }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);
    console.log('Product deleted successfully:', id);
    return NextResponse.json({ success: true, message: 'Produk dihapus' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PATCH(request, { params }) {
  try {
    console.log('PATCH request received');
    const { userId } = getAuth(request);
    
    // Verifikasi apakah pengguna adalah dari salah satu kantin
    const isKandok = await authKandok(userId);
    const isKantek = await authKantek(userId);
    const isKansip = await authKansip(userId);
    const isKantel = await authKantel(userId);
    const isBerkah = await authBerkah(userId);
    const isKantintn = await authKantintn(userId);
    const isTaniamart = await authTaniamart(userId);

    if (!isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
      return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses' }, { status: 403 });
    }

    await connectDB();
    
    const data = await request.json();
    const { isAvailable } = data;
    
    const { id } = await params; // Await params sebelum mengakses id
    console.log('Updating availability for product ID:', id, 'to:', isAvailable);
    
    // Hanya memperbarui status ketersediaan produk
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { isAvailable }, 
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Produk tidak ada' }, { status: 404 });
    }

    console.log('Product availability updated successfully');
    return NextResponse.json({ 
      success: true, 
      message: `Produk ${isAvailable ? 'tersedia' : 'tidak tersedia'}`, 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  try {
    console.log('PUT request received for product update');
    const { userId } = getAuth(request);
    
    // Verifikasi apakah pengguna adalah dari salah satu kantin
    const isKandok = await authKandok(userId);
    const isKantek = await authKantek(userId);
    const isKansip = await authKansip(userId);
    const isKantel = await authKantel(userId);
    const isBerkah = await authBerkah(userId);
    const isKantintn = await authKantintn(userId);
    const isTaniamart = await authTaniamart(userId);

    if (!isKandok && !isKantek && !isKansip && !isKantel && !isBerkah && !isKantintn && !isTaniamart) {
      console.log('Access denied for user:', userId);
      return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses' }, { status: 403 });
    }

    await connectDB();

    const formData = await request.formData();
    const { id } = await params;
    console.log('Updating product ID:', id);

    // Get current product to preserve existing data
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      console.log('Product not found for update:', id);
      return NextResponse.json({ success: false, message: 'Produk tidak ada' }, { status: 404 });
    }

    console.log('Current product images:', currentProduct.image);

    const updatedData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      kantin: formData.get('kantin'),
      price: formData.get('price'),
      offerPrice: formData.get('offerPrice'),
      portionSize: formData.get('portionSize'),
      
      // Tambahkan nutrition fields
      calories: formData.get('calories') || 0,
      totalFat: formData.get('totalFat') || 0,
      cholesterol: formData.get('cholesterol') || 0,
      sodium: formData.get('sodium') || 0,
      totalCarbohydrates: formData.get('totalCarbohydrates') || 0,
      protein: formData.get('protein') || 0,
      vitaminD: formData.get('vitaminD') || 0,
      calcium: formData.get('calcium') || 0,
      iron: formData.get('iron') || 0,
      potassium: formData.get('potassium') || 0,
      vitaminA: formData.get('vitaminA') || 0,
      vitaminC: formData.get('vitaminC') || 0,
      
      // Tambahkan carbon footprint fields
      karbonMakanan: formData.get('karbonMakanan') || 0,
      karbonPengolahan: formData.get('karbonPengolahan') || 0,
      karbonTransportasiLimbah: formData.get('karbonTransportasiLimbah') || 0,
    };

    console.log('Updated data:', updatedData);

    // Handle images - combine existing and new images
    const newImages = formData.getAll('images');
    const existingImages = formData.getAll('existingImages');
    
    console.log('New images received:', newImages.length);
    console.log('Existing images received:', existingImages);
    
    let finalImages = [];
    
    // Add existing images (URLs from Cloudinary)
    if (existingImages && existingImages.length > 0) {
      const validExistingImages = existingImages.filter(img => img && img.trim() !== '' && img !== 'undefined');
      finalImages = [...validExistingImages];
      console.log('Valid existing images:', validExistingImages);
    }
    
    // Upload new images to Cloudinary
    if (newImages && newImages.length > 0) {
      const validNewImages = newImages.filter(img => img && img.name && img.name !== 'undefined' && img.size > 0);
      
      if (validNewImages.length > 0) {
        console.log('Processing', validNewImages.length, 'new images with Cloudinary');
        
        try {
          const uploadResults = await Promise.all(
            validNewImages.map(async (file) => {
              const arrayBuffer = await file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { 
                    resource_type: 'auto',
                    folder: 'quickcart-products'
                  },
                  (error, result) => {
                    if (error) {
                      console.error('Cloudinary upload error:', error);
                      reject(error);
                    } else {
                      console.log('Image uploaded to Cloudinary:', result.secure_url);
                      resolve(result.secure_url);
                    }
                  }
                );
                stream.end(buffer);
              });
            })
          );

          finalImages = [...finalImages, ...uploadResults];
          console.log('All images uploaded successfully to Cloudinary');
        } catch (uploadError) {
          console.error('Error uploading images to Cloudinary:', uploadError);
          return NextResponse.json({ 
            success: false, 
            message: 'Gagal mengupload gambar ke Cloudinary' 
          }, { status: 500 });
        }
      }
    }
    
    console.log('Final images array:', finalImages);
    
    // Update images
    if (finalImages.length > 0) {
      updatedData.image = finalImages;
    } else {
      // Keep existing images if no new images provided
      updatedData.image = currentProduct.image || [];
    }

    console.log('Final updated data with images:', updatedData);

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      console.log('Failed to update product:', id);
      return NextResponse.json({ success: false, message: 'Gagal memperbarui produk' }, { status: 500 });
    }

    console.log('Product updated successfully:', updatedProduct.name);
    console.log('Updated product images:', updatedProduct.image);
    return NextResponse.json({ success: true, message: 'Produk diperbarui', product: updatedProduct });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
