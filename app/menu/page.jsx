'use client'
import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation';

const AllProducts = () => {
    const { products } = useAppContext();
    const [selectedKantin, setSelectedKantin] = useState("All");
    const searchParams = useSearchParams();

    useEffect(() => {
        const kantinParam = searchParams.get('kantin');
        if (kantinParam) {
            setSelectedKantin(decodeURIComponent(kantinParam));
        }
    }, [searchParams]);

    // Daftar kantin berdasarkan model schema
    const kantinList = [
        "All",
        "Kantin Teknik", 
        "Kantin Kodok", 
        "Kantin Telkom", 
        "Kantin Sipil", 
        "Kantin TN 1", 
        "Kantin TN 2", 
        "Kantin TN 3"
    ];

    // Filter produk berdasarkan kantin yang dipilih
    const filteredProducts = useMemo(() => {
        if (selectedKantin === "All") {
            return products;
        }
        return products.filter(product => product.kantin === selectedKantin);
    }, [products, selectedKantin]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                {/* Header Section */}
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">Menu</p>
                    <div className="w-16 h-0.5 bg-[#479C25] rounded-full"></div>
                </div>

                {/* Kantin Filter Section */}
                <div className="w-full mt-8">
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {kantinList.map((kantin) => (
                            <button
                                key={kantin}
                                onClick={() => setSelectedKantin(kantin)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                                    selectedKantin === kantin
                                        ? 'bg-[#479C25] text-white border-[#479C25] shadow-md'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#479C25] hover:text-[#479C25]'
                                }`}
                            >
                                {kantin}
                            </button>
                        ))}
                    </div>
                    
                    {/* Info produk yang ditampilkan */}
                    <div className="mt-4 text-gray-600">
                        <p className="text-sm">
                            {selectedKantin === "All" 
                                ? `Menampilkan semua produk (${filteredProducts.length} item)` 
                                : `Menampilkan produk dari ${selectedKantin} (${filteredProducts.length} item)`
                            }
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-8 pb-14 w-full">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Tidak ada produk dari {selectedKantin}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;