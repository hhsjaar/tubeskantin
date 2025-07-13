import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  date: { type: Number, required: true },
  orderCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  // INFORMASI KANTIN
  kantin: { 
    type: String, 
    required: true,
    enum: [
      "Kantin Teknik", 
      "Kantin Kodok", 
      "Kantin Telkom", 
      "Kantin Sipil", 
      "Kantin TN 1", 
      "Kantin TN 2", 
      "Kantin TN 3"
    ]
  },

  // INFORMASI NILAI GIZI
  portionSize: { type: String, required: true },
  calories: { type: Number, required: true },
  totalFat: { type: Number, required: true },
  cholesterol: { type: Number, required: true },
  sodium: { type: Number, required: true },
  totalCarbohydrates: { type: Number, required: true },
  protein: { type: Number, required: true },
  vitaminD: { type: Number, required: true },
  calcium: { type: Number, required: true },
  iron: { type: Number, required: true },
  potassium: { type: Number, required: true },
  vitaminA: { type: Number, required: true },
  vitaminC: { type: Number, required: true },

  // Karbon Jejak
  karbonMakanan: { type: Number, required: true },
  karbonPengolahan: { type: Number, required: true },
  karbonTransportasiLimbah: { type: Number, required: true },
  }, {
  timestamps: true // ✅ Tambahkan ini
});

// ✅ Gunakan nama model huruf besar konsisten
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
