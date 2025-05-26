'use client'
import { useSearchParams } from 'next/navigation'
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
        const res = await axios.get(`/api/products/search?query=${query}`)
        setResults(res.data.products)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (query) fetchResults()
  }, [query])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Hasil Pencarian: "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>Tidak ada produk ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg">
              <h2 className="font-bold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="text-green-600">Rp {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
