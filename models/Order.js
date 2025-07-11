import mongoose from "mongoose";
import Product from "./Product"; // ⬅️ WAJIB: daftarkan model Product dulu

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: String, required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // ✅ Harus cocok dengan model name: "Product"
        required: true,
      },
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

// ✅ Gunakan huruf besar di model name
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
