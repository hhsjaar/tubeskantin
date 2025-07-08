import connectDB from '@/config/db';
import Product from '@/models/Product';
import authkandok from '@/lib/authkandok';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isAuthorized = authkandok(userId);

    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const fields = [
      "name", "description", "category", "kantin",
      "price", "offerPrice", "portionSize"
    ];

    const data = {};
    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null) data[field] = value;
    }

    const images = formData.getAll('images');
    let imageUrls = [];
    for (const file of images) {
      if (typeof file === 'object' && file.arrayBuffer) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/${filename}`);
      }
    }
    if (imageUrls.length > 0) {
      data.image = imageUrls;
    }

    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}