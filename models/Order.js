import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  amount: Number,
  tax: Number,
  discount: Number,
  total: Number,
  promoCode: String,
  date: Date,
});

const Order = mongoose.models.order || mongoose.model("order", OrderSchema);

export default Order;
