'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const OrderPlaced = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/my-orders');
    }, 9000);

    return () => clearTimeout(timeout); // Cleanup
  }, [router]);

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='checkmark' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Pesanan Anda Berhasil</div>
      <p className="text-sm text-gray-500">Anda akan diarahkan ke halaman pesanan dalam beberapa detik...</p>
    </div>
  )
}

export default OrderPlaced
