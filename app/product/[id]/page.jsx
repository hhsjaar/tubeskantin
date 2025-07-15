'use client';
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
    const { id } = useParams();

    const { products, router, addToCart, user } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10 bg-gradient-to-b from-white to-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="px-5 lg:px-16 xl:px-20">
                        <div className="rounded-2xl overflow-hidden bg-white shadow-lg mb-6 transition-all duration-300 hover:shadow-xl">
                            <Image
                                src={mainImage || productData.image[0]}
                                alt={productData.name}
                                className="w-full h-auto object-cover"
                                width={1280}
                                height={720}
                                priority
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {productData.image.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setMainImage(image);
                                        setSelectedImage(index);
                                    }}
                                    className={`cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:scale-105 ${selectedImage === index ? 'ring-2 ring-[#479C25] ring-offset-2' : ''}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${productData.name} - gambar ${index + 1}`}
                                        className="w-full h-auto object-cover"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {productData.name}
                            </h1>
                            <span className="px-3 py-1 bg-[#479C25]/10 text-[#479C25] font-medium rounded-full text-sm">
                                {productData.category}
                            </span>
                        </div>
                       
                        <p className="text-gray-600 mt-3 leading-relaxed">
                            {productData.description}
                        </p>
                        
                        <div className="mt-6 flex items-center">
                            <p className="text-4xl font-bold text-[#479C25]">
                                Rp{productData.offerPrice}
                            </p>
                            {productData.price > productData.offerPrice && (
                                <p className="ml-3 text-lg text-gray-500 line-through">
                                    Rp{productData.price}
                                </p>
                            )}
                        </div>
                        
                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        {/* Nutritional Info */}
                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#479C25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Informasi Nilai Gizi
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Ukuran Porsi</span>
                                    <p className="font-semibold">{productData.portionSize}</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Kalori</span>
                                    <p className="font-semibold">{productData.calories} kcal</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Total Lemak</span>
                                    <p className="font-semibold">{productData.totalFat} g</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Kolesterol</span>
                                    <p className="font-semibold">{productData.cholesterol} mg</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Sodium</span>
                                    <p className="font-semibold">{productData.sodium} mg</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Karbohidrat</span>
                                    <p className="font-semibold">{productData.totalCarbohydrates} g</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Protein</span>
                                    <p className="font-semibold">{productData.protein} g</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Vitamin D</span>
                                    <p className="font-semibold">{productData.vitaminD} IU</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Kalsium</span>
                                    <p className="font-semibold">{productData.calcium} mg</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Zat Besi</span>
                                    <p className="font-semibold">{productData.iron} mg</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Kalium</span>
                                    <p className="font-semibold">{productData.potassium} mg</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Vitamin A</span>
                                    <p className="font-semibold">{productData.vitaminA} IU</p>
                                </div>
                                <div className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-gray-600 font-medium">Vitamin C</span>
                                    <p className="font-semibold">{productData.vitaminC} mg</p>
                                </div>
                            </div>
                        </div>

                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        {/* Carbon Footprint Info */}
                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#479C25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Jejak Emisi Karbon
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col p-4 rounded-lg bg-[#479C25]/5 border border-[#479C25]/20">
                                    <span className="text-gray-700 font-medium">Karbon Makanan</span>
                                    <p className="font-semibold text-lg">{productData.karbonMakanan} kg CO₂e</p>
                                </div>
                                <div className="flex flex-col p-4 rounded-lg bg-[#479C25]/5 border border-[#479C25]/20">
                                    <span className="text-gray-700 font-medium">Karbon Pengolahan</span>
                                    <p className="font-semibold text-lg">{productData.karbonPengolahan} kg CO₂e</p>
                                </div>
                                <div className="flex flex-col p-4 rounded-lg bg-[#479C25]/5 border border-[#479C25]/20">
                                    <span className="text-gray-700 font-medium">Karbon Transportasi</span>
                                    <p className="font-semibold text-lg">{productData.karbonTransportasiLimbah} kg CO₂e</p>
                                </div>
                            </div>
                        </div>

                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        <div className="flex items-center mt-6 gap-4">
                            <button 
                                onClick={() => addToCart(productData._id)} 
                                className="w-full py-4 bg-white border-2 border-[#479C25] text-[#479C25] font-bold rounded-xl hover:bg-[#479C25]/5 transition-all duration-300 shadow-sm flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Tambah ke Keranjang
                            </button>
                            <button 
                                onClick={() => { addToCart(productData._id); router.push(user ? '/cart' : '') }} 
                                className="w-full py-4 bg-[#479C25] text-white font-bold rounded-xl hover:bg-[#3a8020] transition-all duration-300 shadow-md flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-white rounded-2xl shadow-md py-10 px-6 mt-16">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="text-3xl font-bold">Produk <span className="text-[#479C25]">Unggulan</span></h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-[#479C25]/30 via-[#479C25] to-[#479C25]/30 mt-3 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full">
                        {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                    </div>
                    <button className="mt-10 px-8 py-3 border-2 border-[#479C25] text-[#479C25] font-medium rounded-xl hover:bg-[#479C25]/5 transition-all duration-300 flex items-center">
                        <span>Lihat Lebih Banyak</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
            <Footer />
        </>
    ) : <Loading />
};

export default Product;
