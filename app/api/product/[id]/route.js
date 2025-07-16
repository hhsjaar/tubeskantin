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

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  try {
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
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Verifikasi apakah produk milik kantin yang sesuai
    const kantinUser = isKandok || isKantek || isKansip || isKantel || isBerkah || isKantintn || isTaniamart;
    if (String(product.seller) !== String(kantinUser._id)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  try {
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
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const formData = await request.formData();

    const updatedData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      kantin: formData.get('kantin'),
      price: formData.get('price'),
      offerPrice: formData.get('offerPrice'),
      portionSize: formData.get('portionSize'),
    };

    // Handle new uploaded images (optional)
    const images = formData.getAll('images');
    if (images && images.length > 0 && images[0].name !== 'undefined') {
      const uploadedPaths = [];

      for (const image of images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = Date.now() + '-' + image.name;
        const filePath = path.join(process.cwd(), 'public/uploads', fileName);
        await writeFile(filePath, buffer);
        uploadedPaths.push(`/uploads/${fileName}`);
      }

      updatedData.image = uploadedPaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
