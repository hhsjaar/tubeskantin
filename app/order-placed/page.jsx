'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa'

const OrderPlaced = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/my-orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [router]);

  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-4'>
      {/* Card dengan efek glass morphism */}
      <div className="w-full max-w-md bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Animasi sukses */}
        <div className="relative mb-6">
          {/* Lingkaran luar dengan efek pulse */}
          <div className="absolute inset-0 rounded-full h-32 w-32 bg-gradient-to-br from-[#479C25]/20 to-[#3a7d1f]/10 animate-pulse"></div>
          
          {/* Lingkaran berputar dengan gradient hijau */}
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-[#479C25] border-b-[#3a7d1f] shadow-lg"></div>
          
          {/* Icon centang di tengah */}
          <div className="absolute inset-0 flex items-center justify-center">
            <FaCheckCircle className="text-[#479C25] h-16 w-16" />
          </div>
        </div>
        
        {/* Teks sukses dengan efek gradient */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#479C25] to-[#3a7d1f] bg-clip-text text-transparent mb-3">
          Pesanan Berhasil
        </h1>
        
        {/* Pesan konfirmasi */}
        <p className="text-gray-600 text-center mb-6">
          Terima kasih telah berbelanja di Ngantin. Pesanan Anda sedang diproses.
        </p>
        
        {/* Countdown dengan efek modern */}
        <div className="bg-gray-100/70 rounded-full px-5 py-2 flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-[#479C25] animate-pulse"></div>
          <p className="text-sm text-gray-600">
            Mengarahkan ke pesanan Anda dalam <span className="font-semibold">{countdown}</span> detik...
          </p>
        </div>
        
        {/* Tombol untuk langsung ke halaman pesanan */}
        <button 
          onClick={() => router.push('/my-orders')} 
          className="w-full py-3 px-4 bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1 duration-300"
        >
          <FaShoppingBag className="h-4 w-4" />
          Lihat Pesanan Saya
        </button>
      </div>
    </div>
  )
}

export default OrderPlaced
