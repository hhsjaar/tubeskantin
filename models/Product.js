import mongoose from "mongoose";

// Cek apakah model sudah ada agar tidak dideklarasikan ulang
const ProductSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    date: { type: Number, required: true },

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

    // Jejak Karbon
    karbonMakanan: { type: Number, required: true },
    karbonPengolahan: { type: Number, required: true },
    karbonTransportasiLimbah: { type: Number, required: true },
});

// Gunakan nama model 'Product' (dengan huruf besar) secara konsisten
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
