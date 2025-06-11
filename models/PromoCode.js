import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Ganti jadi String, bukan ObjectId
  code: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  expiresAt: { type: Date, default: null },
  used: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);
