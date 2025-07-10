import mongoose from "mongoose";
import Product from "./Product"; // ⬅️ WAJIB agar model 'Product' terdaftar sebelum digunakan

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // ✅ perbaikan di sini
      quantity: { type: Number, required: true },
    },
  ],
  amount: Number,
  tax: Number,
  discount: Number,
  total: Number,
  promoCode: String,
  date: Date,
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema); // Gunakan huruf besar juga di model name

export default Order;
