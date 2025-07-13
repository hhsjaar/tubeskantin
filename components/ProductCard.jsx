import React, { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { FaLeaf } from "react-icons/fa";

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
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-full h-full rounded-lg"
                    width={800}
                    height={800}
                />
                
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            
            {/* Emisi Karbon & Logo Daun */}
            <div className="flex items-center gap-2">
                <FaLeaf className="text-green-400 h-4 w-4" />
                <p className="text-xs text-green-400">{carbonEmission ? `~${carbonEmission} kg CO₂e /porsi` : 'Memuat data emisi...'}</p>
                {/* {typeof product.orderCount === 'number' && (
                  <span className="ml-2 text-xs text-yellow-600 font-semibold bg-yellow-100 rounded-full px-2 py-0.5">
                    {product.orderCount} terjual
                  </span>
                )} */}
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
                    Beli
                </button>
            </div>
        </div>
    )
}

export default ProductCard;
