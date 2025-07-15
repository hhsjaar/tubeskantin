'use client'
import { useState, useMemo, useEffect, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation';
import { FaStore, FaUtensils, FaCoffee, FaIceCream, FaHamburger, FaFilter, FaSearch } from "react-icons/fa";

// Separate component for search params logic
const MenuContent = () => {
    const { products } = useAppContext();
    const [selectedKantin, setSelectedKantin] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const kantinParam = searchParams.get('kantin');
        const searchParam = searchParams.get('search');
        
        if (kantinParam) {
            setSelectedKantin(decodeURIComponent(kantinParam));
        }
        
        if (searchParam) {
            setSearchTerm(decodeURIComponent(searchParam));
        }
    }, [searchParams]);

    // Daftar kantin berdasarkan model schema
    const kantinList = [
        "All",
        "Kantin Teknik", 
        "Kantin Kodok", 
        "Kantin Telkom", 
        "Kantin Sipil", 
        "Kantin Berkah", 
        "Kantin Tata Niaga", 
        "Tania Mart"
    ];

    // Daftar kategori makanan
    const categoryList = [
        { id: "All", name: "Semua", icon: <FaUtensils /> },
        { id: "Makanan Berat", name: "Makanan Berat", icon: <FaHamburger /> },
        { id: "Makanan Ringan", name: "Makanan Ringan", icon: <FaIceCream /> },
        { id: "Minuman", name: "Minuman", icon: <FaCoffee /> },
    ];

    // Filter produk berdasarkan kantin, kategori, dan pencarian
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filter berdasarkan kantin
            const kantinMatch = selectedKantin === "All" || product.kantin === selectedKantin;
            
            // Filter berdasarkan kategori
            const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
            
            // Filter berdasarkan pencarian
            const searchMatch = searchTerm === "" || 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return kantinMatch && categoryMatch && searchMatch;
        });
    }, [products, selectedKantin, selectedCategory, searchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section with Gradient Background */}
            <div className="relative bg-gradient-to-r from-[#479C25] to-[#3a7d1f] py-16 px-6 md:px-16 lg:px-32 rounded-b-3xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3a7d1f] rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#479C25] rounded-full filter blur-3xl opacity-20"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Menu</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">Temukan berbagai pilihan makanan dan minuman dari kantin-kantin di kampus</p>
                    
                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari makanan atau minuman..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 px-5 pl-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/40 shadow-md focus:outline-none focus:ring-2 focus:ring-[#479C25] text-gray-700"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#479C25]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-16 lg:px-32 py-8">
                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 backdrop-filter backdrop-blur-lg bg-opacity-80 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <FaFilter className="text-[#479C25]" />
                        <h2 className="text-xl font-bold text-gray-800">Filter</h2>
                    </div>
                    
                    {/* Kantin Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                            <FaStore className="text-[#479C25]" /> Kantin
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {kantinList.map((kantin) => (
                                <button
                                    key={kantin}
                                    onClick={() => setSelectedKantin(kantin)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        selectedKantin === kantin
                                            ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {kantin}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Kategori Filter */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                            <FaUtensils className="text-[#479C25]" /> Kategori
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categoryList.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                        selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-[#479C25] to-[#3a7d1f] text-white shadow-md transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Info produk yang ditampilkan */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
                    <p className="text-gray-600 font-medium">
                        {selectedKantin === "All" && selectedCategory === "All"
                            ? `Semua produk (${filteredProducts.length})`
                            : selectedKantin === "All"
                                ? `${selectedCategory} (${filteredProducts.length})`
                                : selectedCategory === "All"
                                    ? `${selectedKantin} (${filteredProducts.length})`
                                    : `${selectedKantin} - ${selectedCategory} (${filteredProducts.length})`
                        }
                    </p>
                    
                    {/* Reset Filter Button */}
                    {(selectedKantin !== "All" || selectedCategory !== "All" || searchTerm !== "") && (
                        <button 
                            onClick={() => {
                                setSelectedKantin("All");
                                setSelectedCategory("All");
                                setSearchTerm("");
                            }}
                            className="text-sm text-[#479C25] hover:text-[#3a7d1f] font-medium"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-[#479C25]">
                                    <FaUtensils className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-800">Tidak ada produk ditemukan</h3>
                                <p className="text-gray-500 max-w-md">
                                    Tidak ada produk yang sesuai dengan filter yang dipilih. Coba ubah filter atau reset filter untuk melihat produk lainnya.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AllProducts = () => {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                    <div className="p-8 rounded-xl bg-white shadow-lg">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-4 border-[#479C25] border-t-transparent animate-spin"></div>
                            <p className="text-gray-600 font-medium">Loading menu...</p>
                        </div>
                    </div>
                </div>
            }>
                <MenuContent />
            </Suspense>
            <Footer />
        </>
    );
};

export default AllProducts;