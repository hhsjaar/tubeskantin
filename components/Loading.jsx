import React from 'react'
import { FaLeaf } from 'react-icons/fa'

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
            <div className="relative">
                {/* Lingkaran luar dengan efek glass morphism */}
                <div className="absolute inset-0 rounded-full h-24 w-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/20 shadow-xl animate-pulse"></div>
                
                {/* Lingkaran berputar dengan gradient hijau */}
                <div className="animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-[#479C25] border-b-[#3a7d1f] shadow-lg"></div>
                
                {/* Icon daun di tengah */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaLeaf className="text-[#479C25] h-8 w-8 animate-pulse" />
                </div>
            </div>
            
            {/* Teks loading dengan efek gradient */}
            <div className="mt-6 text-center">
                <p className="text-lg font-semibold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] bg-clip-text text-transparent animate-pulse">Memuat...</p>
                <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
            </div>
        </div>
    )
}

export default Loading