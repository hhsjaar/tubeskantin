'use client'
import { useSearchParams } from 'next/navigation'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from 'react'
import axios from 'axios'

const SearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/product/search?query=${query}`)
        setResults(res.data.product)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (query) fetchResults()
  }, [query])

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <h1 className="text-2xl font-medium">Hasil Pencarian: "{query}"</h1>
          <div className="w-16 h-0.5 bg-[#479C25] rounded-full"></div>
        </div>

        {loading ? (
          <p className="mt-12">Loading...</p>
        ) : results.length === 0 ? (
          <p className="mt-12">Tidak ada produk ditemukan.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
            {results.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SearchPage
