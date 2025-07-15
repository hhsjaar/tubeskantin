import React, { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { FaLeaf, FaStore, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {

    const { currency, router } = useAppContext();
    
    // State untuk menyimpan emisi karbon
    const [carbonEmission, setCarbonEmission] = useState(null);

    // Fungsi untuk menghitung emisi karbon rata-rata
    const calculateCarbonEmission = (karbonMakanan, karbonPengolahan, karbonTransportasiLimbah) => {
        const totalCarbon = karbonMakanan + karbonPengolahan + karbonTransportasiLimbah;
        return (totalCarbon / 3).toFixed(2);  // Menghitung rata-rata dan membulatkan hasil ke dua angka desimal
    };

    // Mengambil data karbon emisi produk
    useEffect(() => {
        // Misalkan data produk memiliki properti yang berisi emisi karbon
        const { karbonMakanan, karbonPengolahan, karbonTransportasiLimbah } = product;

        // Menghitung emisi karbon rata-rata
        const carbon = calculateCarbonEmission(karbonMakanan, karbonPengolahan, karbonTransportasiLimbah);
        setCarbonEmission(carbon); // Menyimpan emisi karbon yang dihitung ke state
    }, [product]);

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="group flex flex-col items-start gap-1 max-w-[200px] w-full cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
        >
            {/* Card dengan efek glass morphism */}
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/20">
                {/* Badge Kantin - Diperbarui dengan warna hijau [#479C25] */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 border border-white/30">
                    <FaStore className="h-3.5 w-3.5" />
                    <span className="tracking-wide">{product.kantin || 'Kantin UI'}</span>
                </div>
                
                {/* Gambar Produk dengan Overlay Gradient */}
                <div className="relative w-full h-52 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="group-hover:scale-110 transition-all duration-500 object-cover w-full h-full"
                        width={800}
                        height={800}
                    />
                    
                    {/* Tombol Beli yang muncul saat hover - warna diubah ke hijau */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="px-4 py-1.5 bg-white/90 hover:bg-white text-[#479C25] rounded-full text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-1.5 transition-all">
                            <FaShoppingCart className="h-3 w-3" />
                            Beli Sekarang
                        </button>
                    </div>
                </div>
                
                {/* Informasi Produk */}
                <div className="p-3">
                    {/* Nama Produk */}
                    <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                    
                    {/* Emisi Karbon dengan Desain Modern */}
                    <div className="mt-1.5 flex items-center gap-1.5 bg-green-50/70 rounded-lg px-2 py-1">
                        <FaLeaf className="text-green-500 h-3.5 w-3.5" />
                        <p className="text-xs text-green-600 font-medium">
                            {carbonEmission ? `~${carbonEmission} kg CO₂e/porsi` : 'Memuat data emisi...'}
                        </p>
                    </div>
                    
                    {/* Harga dengan Desain Modern - warna diubah ke hijau */}
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-bold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] bg-clip-text text-transparent">
                            {currency}{product.offerPrice}
                        </p>
                        
                        {/* Jumlah Terjual (jika ada) */}
                        {typeof product.orderCount === 'number' && (
                            <span className="text-xs text-yellow-700 font-medium bg-yellow-100/80 rounded-full px-2 py-0.5">
                                {product.orderCount} terjual
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
