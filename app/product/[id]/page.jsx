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
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="px-5 lg:px-16 xl:px-20">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                            <Image
                                src={mainImage || productData.image[0]}
                                alt="alt"
                                className="w-full h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {productData.image.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                                >
                                    <Image
                                        src={image}
                                        alt="alt"
                                        className="w-full h-auto object-cover mix-blend-multiply"
                                        width={1280}
                                        height={720}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                            {productData.name}
                        </h1>
                       
                        <p className="text-gray-600 mt-3">
                            {productData.description}
                        </p>
                        <p className="text-3xl font-medium mt-6">
                            Rp{productData.offerPrice}
                            <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                Rp{productData.price}
                            </span>
                        </p>
                        <hr className="bg-gray-600 my-6" />
                        <div className="overflow-x-auto">
                            <table className="table-auto border-collapse w-full max-w-72">
                                <tbody>
                                   
                                   
                                    <tr>
                                        <td className="text-gray-600 font-medium">Kategori</td>
                                        <td className="text-gray-800/50">
                                            {productData.category}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Nutritional Info */}
                        <div className="mt-6">
                            <h3 className="text-xl font-medium">Informasi Nilai Gizi</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Portion Size</span>
                                    <p>{productData.portionSize}</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Calories</span>
                                    <p>{productData.calories} kcal</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Total Fat</span>
                                    <p>{productData.totalFat} g</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Cholesterol</span>
                                    <p>{productData.cholesterol} mg</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Sodium</span>
                                    <p>{productData.sodium} mg</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Carbohydrates</span>
                                    <p>{productData.totalCarbohydrates} g</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Protein</span>
                                    <p>{productData.protein} g</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Vitamin D</span>
                                    <p>{productData.vitaminD} IU</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Calcium</span>
                                    <p>{productData.calcium} mg</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Iron</span>
                                    <p>{productData.iron} mg</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Potassium</span>
                                    <p>{productData.potassium} mg</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Vitamin A</span>
                                    <p>{productData.vitaminA} IU</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">Vitamin C</span>
                                    <p>{productData.vitaminC} mg</p>
                                </div>
                            </div>
                        </div>

                        <hr className="bg-gray-600 my-6" />

                        {/* Carbon Footprint Info */}
                        <div className="mt-6">
    <h3 className="text-xl font-medium">Jejak Emisi Karbon</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Food Carbon</span>
            <p>{productData.karbonMakanan} kg CO₂e</p>
        </div>
        <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Processing Carbon</span>
            <p>{productData.karbonPengolahan} kg CO₂e</p>
        </div>
        <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Transportation Carbon</span>
            <p>{productData.karbonTransportasiLimbah} kg CO₂e</p>
        </div>
    </div>
</div>


                        <hr className="bg-gray-600 my-6" />

                        <div className="flex items-center mt-10 gap-4">
    <button 
        onClick={() => addToCart(productData._id)} 
        className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg"
    >
        Tambah ke Keranjang
    </button>
    <button 
        onClick={() => { addToCart(productData._id); router.push(user ? '/cart' : '') }} 
        className="w-full py-3.5 bg-[#479C25] text-white hover:bg-[#479C25] transition rounded-lg"
    >
        Beli Sekarang
    </button>
</div>

                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                        {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                    </div>
                    <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                        See more
                    </button>
                </div>
            </div>
            <Footer />
        </>
    ) : <Loading />
};

export default Product;
