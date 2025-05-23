import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { FaLeaf } from "react-icons/fa";



const ProductCard = ({ product }) => {

    const { currency, router } = useAppContext()

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
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            

            {/* Emisi Karbon & Logo Daun */}
            <div className="flex items-center gap-2">
                <FaLeaf className="text-green-400 h-4 w-4" />
                <p className="text-xs text-green-400">~1.1 kg CO₂e /porsi</p>
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

export default ProductCard
