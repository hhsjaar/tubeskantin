// app/search/SearchPage.jsx
'use client';

import { useSearchParams } from 'next/navigation'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaLeaf } from 'react-icons/fa';

const SearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

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

  // Fungsi untuk mengurutkan hasil
  const sortResults = (order) => {
    setSortOrder(order)
    let sortedResults = [...results]
    
    switch(order) {
      case 'price-asc':
        sortedResults.sort((a, b) => a.offerPrice - b.offerPrice)
        break
      case 'price-desc':
        sortedResults.sort((a, b) => b.offerPrice - a.offerPrice)
        break
      case 'carbon-asc':
        sortedResults.sort((a, b) => {
          const carbonA = (a.karbonMakanan + a.karbonPengolahan + a.karbonTransportasiLimbah) / 3
          const carbonB = (b.karbonMakanan + b.karbonPengolahan + b.karbonTransportasiLimbah) / 3
          return carbonA - carbonB
        })
        break
      default:
        // Default sorting (by relevance)
        break
    }
    
    setResults(sortedResults)
  }

  // Animasi untuk container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Animasi untuk item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section dengan Background Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#479C25]/20 via-white to-blue-50 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#479C25]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col items-center px-6 md:px-16 lg:px-32 pt-12 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#479C25] to-blue-500 bg-clip-text text-transparent mb-4">
              Hasil Pencarian
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaSearch className="text-[#479C25]" />
              <p className="text-lg md:text-xl font-medium text-gray-700">"{query}"</p>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#479C25] to-blue-400 rounded-full mx-auto mt-2"></div>
          </motion.div>
          
          {/* Filter dan Sort Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 hover:text-[#479C25]"
              >
                <FaFilter className={showFilters ? "text-[#479C25]" : "text-gray-500"} />
                Filter
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <select 
                  value={sortOrder}
                  onChange={(e) => sortResults(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#479C25]/30 focus:border-[#479C25] shadow-sm"
                >
                  <option value="default">Relevansi</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="carbon-asc">Emisi Karbon: Terendah</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full">
              {results.length} produk ditemukan
            </div>
          </motion.div>
          
          {/* Filter Panel */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl mx-auto mt-4 p-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Kantin</h3>
                  <div className="space-y-2">
                    {['Semua Kantin', 'Kantin UI', 'Kantin TN', 'Kantin Berkah'].map((kantin) => (
                      <label key={kantin} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#479C25] transition-colors">
                        <input type="checkbox" className="rounded text-[#479C25] focus:ring-[#479C25]" />
                        {kantin}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Rentang Harga</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479C25]/30 focus:border-[#479C25]"
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#479C25]/30 focus:border-[#479C25]"
                      />
                    </div>
                    <button className="w-full py-1.5 bg-[#479C25]/10 hover:bg-[#479C25]/20 text-[#479C25] text-sm font-medium rounded-lg transition-colors duration-300">
                      Terapkan
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Emisi Karbon</h3>
                  <div className="space-y-2">
                    {['Semua', 'Rendah (<1kg CO₂e)', 'Sedang (1-2kg CO₂e)', 'Tinggi (>2kg CO₂e)'].map((level) => (
                      <label key={level} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#479C25] transition-colors">
                        <input type="checkbox" className="rounded text-[#479C25] focus:ring-[#479C25]" />
                        <div className="flex items-center gap-1.5">
                          {level.includes('Rendah') && <FaLeaf className="text-green-500 h-3.5 w-3.5" />}
                          {level}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Results Section */}
      <div className="px-6 md:px-16 lg:px-32 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#479C25]"></div>
          </div>
        ) : results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-gray-500 max-w-md">Coba gunakan kata kunci yang berbeda atau kurangi filter untuk melihat lebih banyak hasil.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 w-full"
          >
            {results.map((product, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </>
  )
}

export default SearchPage;
