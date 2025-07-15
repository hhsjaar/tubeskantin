// models/BankSampah.js
import mongoose from "mongoose";

const bankSampahSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    sampah: { type: [String], required: true }, // Diubah menjadi array string
    jumlahSampah: { type: [Number], required: true }, // Diubah menjadi array number
    lokasi: { type: String, required: true },
    catatan: { type: String },
    fotoSampah: { type: [String], required: true }, // Diubah menjadi array string
    promoCode: { type: String },
    promoValue: { type: Number },
  },
  { timestamps: true }
);
    
export default mongoose.models.BankSampah ||
  mongoose.model("BankSampah", bankSampahSchema);
