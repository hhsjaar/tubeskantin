import React, { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { FaLeaf, FaStore, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext();
    const [carbonEmission, setCarbonEmission] = useState(null);

    const calculateCarbonEmission = (karbonMakanan, karbonPengolahan, karbonTransportasiLimbah) => {
        const totalCarbon = karbonMakanan + karbonPengolahan + karbonTransportasiLimbah;
        return (totalCarbon / 3).toFixed(2);
    };

    useEffect(() => {
        const { karbonMakanan, karbonPengolahan, karbonTransportasiLimbah } = product;
        const carbon = calculateCarbonEmission(karbonMakanan, karbonPengolahan, karbonTransportasiLimbah);
        setCarbonEmission(carbon);
    }, [product]);

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="group flex flex-col items-start gap-1 max-w-[200px] w-full cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                {/* Badge Kantin */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-600 dark:to-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 border border-white/30 dark:border-black/20">
                    <FaStore className="h-3.5 w-3.5" />
                    <span className="tracking-wide">{product.kantin || 'Kantin UI'}</span>
                </div>
                
                {/* Gambar Produk dengan Overlay */}
                <div className="relative w-full h-52 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent dark:from-black/60 z-[1] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="group-hover:scale-110 transition-all duration-500 object-cover w-full h-full"
                        width={800}
                        height={800}
                    />
                    
                    {/* Tombol Beli */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="px-4 py-1.5 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 text-[#479C25] dark:text-green-400 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-1.5 transition-all border border-transparent dark:border-green-500/20">
                            <FaShoppingCart className="h-3 w-3" />
                            Beli Sekarang
                        </button>
                    </div>
                </div>
                
                {/* Informasi Produk */}
                <div className="p-3 bg-white dark:bg-gray-800/95 rounded-b-xl transition-all duration-300">
                    {/* Nama Produk */}
                    <h3 className="font-medium text-gray-800 dark:text-gray-100 truncate">{product.name}</h3>
                    
                    {/* Emisi Karbon */}
                    <div className="mt-1.5 flex items-center gap-1.5 bg-green-50/70 dark:bg-green-900/30 rounded-lg px-2 py-1">
                        <FaLeaf className="text-green-500 dark:text-green-400 h-3.5 w-3.5" />
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {carbonEmission ? `~${carbonEmission} kg CO₂e/porsi` : 'Memuat data emisi...'}
                        </p>
                    </div>
                    
                    {/* Harga dan Jumlah Terjual */}
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-bold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                            {currency}{product.offerPrice.toLocaleString('id-ID')}
                        </p>
                        
                        {typeof product.orderCount === 'number' && (
                            <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium bg-yellow-100/80 dark:bg-yellow-900/30 rounded-full px-2 py-0.5 border border-yellow-200/50 dark:border-yellow-700/30">
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
