import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    portionSize: { type: String, required: true }, // Ukuran porsi
    calories: { type: Number, required: true }, // Kalori
    totalFat: { type: Number, required: true }, // Lemak total (dalam gram)
    cholesterol: { type: Number, required: true }, // Kolesterol (dalam mg)
    sodium: { type: Number, required: true }, // Natrium (Garam) (dalam mg)
    totalCarbohydrates: { type: Number, required: true }, // Karbohidrat total (dalam gram)
    protein: { type: Number, required: true }, // Protein (dalam gram)
    vitaminD: { type: Number, required: true }, // Vitamin D (dalam IU atau mg)
    calcium: { type: Number, required: true }, // Kalsium (dalam mg)
    iron: { type: Number, required: true }, // Zat Besi (dalam mg)
    potassium: { type: Number, required: true }, // Kalium (dalam mg)
    vitaminA: { type: Number, required: true }, // Vitamin A (dalam IU atau mcg)
    vitaminC: { type: Number, required: true }, // Vitamin C (dalam mg)
    
    // Karbon Jejak
    karbonMakanan: { type: Number, required: true }, // Jejak karbon untuk makanan (kg CO₂e)
    karbonPengolahan: { type: Number, required: true }, // Jejak karbon untuk pengolahan (kg CO₂e)
    karbonTransportasiLimbah: { type: Number, required: true }, // Jejak karbon untuk transportasi dan limbah (kg CO₂e)
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;