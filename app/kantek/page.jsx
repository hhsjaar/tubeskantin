'use client'
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {

  const { getToken } = useAppContext()

  
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan Berat');
  const [kantin, setKantin] = useState('Kantin Teknik'); 
  const [price, setPrice] = useState('1000');
  const [offerPrice, setOfferPrice] = useState('');
  const [portionSize, setPortionSize] = useState('1');
  const [calories, setCalories] = useState('');
  const [totalFat, setTotalFat] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [sodium, setSodium] = useState('');
  const [totalCarbohydrates, setTotalCarbohydrates] = useState('');
  const [protein, setProtein] = useState('');
  const [vitaminD, setVitaminD] = useState('');
  const [calcium, setCalcium] = useState('');
  const [iron, setIron] = useState('');
  const [potassium, setPotassium] = useState('');
  const [vitaminA, setVitaminA] = useState('');
  const [vitaminC, setVitaminC] = useState('');
  const [karbonMakanan, setKarbonMakanan] = useState('');
  const [karbonPengolahan, setKarbonPengolahan] = useState('');
  const [karbonTransportasiLimbah, setKarbonTransportasiLimbah] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedName] = useDebounce(name, 800);
  const [debouncedDescription] = useDebounce(description, 800);

  useEffect(() => {
    const fetchAutoNutrition = async () => {
      if (debouncedName.length < 3 || debouncedDescription.length < 10) return;

      try {
        setIsLoading(true);
        const token = await getToken();

        const res = await axios.post('/api/ai/nutrition-carbon', {
          name: debouncedName,
          description: debouncedDescription,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const data = res.data;
          setCalories(data.calories);
          setTotalFat(data.totalFat);
          setCholesterol(data.cholesterol);
          setSodium(data.sodium);
          setTotalCarbohydrates(data.totalCarbohydrates);
          setProtein(data.protein);
          setVitaminD(data.vitaminD);
          setCalcium(data.calcium);
          setIron(data.iron);
          setPotassium(data.potassium);
          setVitaminA(data.vitaminA);
          setVitaminC(data.vitaminC);
          setKarbonMakanan(data.karbonMakanan);
          setKarbonPengolahan(data.karbonPengolahan);
          setKarbonTransportasiLimbah(data.karbonTransportasiLimbah);
          toast.success("Nilai gizi & karbon otomatis terisi.");
        }
      } catch (error) {
        toast.error('Gagal mendapatkan data AI');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutoNutrition();
  }, [debouncedName, debouncedDescription]);

  const handlePriceChange = (e) => {
  // Menghapus semua karakter yang bukan angka untuk memastikan data yang disimpan valid
  const rawValue = e.target.value.replace(/[^0-9]/g, '');
  
  // Mengupdate state dengan angka yang sudah diparsing
  setOfferPrice(rawValue ? parseInt(rawValue) : 0);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('kantin',kantin)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)
    formData.append('portionSize',portionSize)
    formData.append('calories',calories)
    formData.append('totalFat', totalFat)
    formData.append('cholesterol', cholesterol)
    formData.append('sodium', sodium)
    formData.append('totalCarbohydrates', totalCarbohydrates)
    formData.append('protein', protein)
    formData.append('vitaminD', vitaminD)
    formData.append('calcium', calcium)
    formData.append('iron', iron)
    formData.append('potassium', potassium)
    formData.append('vitaminA', vitaminA)
    formData.append('vitaminC', vitaminC)
    formData.append('karbonMakanan', karbonMakanan);
    formData.append('karbonPengolahan', karbonPengolahan);
    formData.append('karbonTransportasiLimbah', karbonTransportasiLimbah);

    for (let i = 0; i < files.length; i++) {
      formData.append('images',files[i])
    }

    try {
      const token = await getToken()
      const { data } = await axios.post('/api/product/add',formData,{headers:{Authorization:`Bearer ${token}`}})

      if (data.success) {
        toast.success(data.message)
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('Makanan Berat');
        setKantin('Kantin Teknik');
        setPrice('');
        setOfferPrice('');
        setPortionSize('');
        setCalories('');
        setTotalFat('');
        setCholesterol('');
        setSodium('');
        setTotalCarbohydrates('');
        setProtein('');
        setVitaminD('');
        setCalcium('');
        setIron('');
        setPotassium('');
        setVitaminA('');
        setVitaminC('');
        setKarbonMakanan('');
        setKarbonPengolahan('');
        setKarbonTransportasiLimbah('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-gray-900">
      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-[#479C25]/90 to-[#3a7d1f]/80 py-8 px-6 md:px-10 text-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tambah Produk Baru</h1>
          <p className="text-green-100">Isi informasi produk dengan lengkap untuk ditampilkan di menu Kantin Teknik</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 max-w-4xl mx-auto w-full px-6 md:px-10 py-8 space-y-8">
        {/* Foto Produk dengan desain modern */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#479C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Foto Produk
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {[...Array(4)].map((_, index) => (
              <label 
                key={index} 
                htmlFor={`image${index}`}
                className={`relative h-24 w-24 rounded-lg overflow-hidden border-2 ${files[index] ? 'border-[#479C25]' : 'border-dashed border-gray-300 dark:border-gray-600'} flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all cursor-pointer`}
              >
                <input 
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }} 
                  type="file" 
                  id={`image${index}`} 
                  className="hidden" 
                  accept="image/*"
                />
                {files[index] ? (
                  <Image
                    src={URL.createObjectURL(files[index])}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Tambah Foto</span>
                  </div>
                )}
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload hingga 4 foto produk (disarankan rasio 1:1)</p>
        </div>
        
        {/* Informasi Dasar Produk */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#479C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Informasi Dasar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="product-name">
      Nama Produk
    </label>
    <input
      id="product-name"
      type="text"
      placeholder="Ketik di sini"
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      onChange={(e) => setName(e.target.value)}
      value={name}
      required
    />
  </div>
  
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="product-description">
      Deskripsi Produk
    </label>
    <textarea
      id="product-description"
      rows={4}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      placeholder="Ketik di sini"
      onChange={(e) => setDescription(e.target.value)}
      value={description}
      required
    ></textarea>
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="category">
      Kategori
    </label>
    <select
      id="category"
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      onChange={(e) => setCategory(e.target.value)}
      value={category}
    >
      <option value="Makanan Berat">Makanan Berat</option>
      <option value="Minuman">Minuman</option>
      <option value="Gorengan">Gorengan</option>
      <option value="Snack">Snack</option>
    </select>
  </div>
  
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="kantin">
      Kantin
    </label>
    <input
      type="text"
      id="kantin"
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      value="Kantin Teknik"
      readOnly
    />
  </div>
  
  <input
    id="product-price"
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    hidden
    required
  />
  
  <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="offer-price">
    Harga (Rp)
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-500 sm:text-sm">Rp</span>
    </div>
    <input
      id="offer-price"
      type="text"  // Menggunakan type text agar bisa menampilkan format
      placeholder="0"
      className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      onChange={(e) => handlePriceChange(e)}
      value={offerPrice.toLocaleString('id-ID')}  // Menampilkan dengan pemisah ribuan
      required
    />
  </div>
</div>

            
            <div className="space-y-1" hidden>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="portion-size">
                Ukuran Porsi
              </label>
              <input
                id="portion-size"
                type="text"
                placeholder="Ketik di sini"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                onChange={(e) => setPortionSize(e.target.value)}
                value={portionSize}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Informasi Nutrisi */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6 relative">
  {isLoading && (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-xl z-10">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-[#479C25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mengambil data nutrisi...</p>
      </div>
    </div>
  )}

  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
      <svg className="w-5 h-5 mr-2 text-[#479C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Informasi Nutrisi
    </h2>
    <div className="text-xs text-[#479C25] bg-[#479C25]/10 dark:bg-[#479C25]/20 px-2 py-1 rounded-full">
      Auto-fill dengan AI setelah mengisi nama & deskripsi
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="calories">
        Kalori
      </label>
      <input
        id="calories"
        type="number"
        placeholder="Ketik di sini"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setCalories(e.target.value)}
        value={calories}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="total-fat">
        Total Lemak (g)
      </label>
      <input
        id="total-fat"
        type="number"
        placeholder="contoh: 10"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setTotalFat(e.target.value)}
        value={totalFat}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="cholesterol">
        Kolesterol (mg)
      </label>
      <input
        id="cholesterol"
        type="number"
        placeholder="contoh: 5"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setCholesterol(e.target.value)}
        value={cholesterol}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="sodium">
        Sodium (mg)
      </label>
      <input
        id="sodium"
        type="number"
        placeholder="contoh: 5"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setSodium(e.target.value)}
        value={sodium}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="total-carbohydrates">
        Total Karbohidrat (g)
      </label>
      <input
        id="total-carbohydrates"
        type="number"
        placeholder="contoh: 20"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setTotalCarbohydrates(e.target.value)}
        value={totalCarbohydrates}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="protein">
        Protein (g)
      </label>
      <input
        id="protein"
        type="number"
        placeholder="contoh: 5"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setProtein(e.target.value)}
        value={protein}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="vitaminD">
        Vitamin D (IU atau mg)
      </label>
      <input
        id="vitaminD"
        type="number"
        placeholder="contoh: 10"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setVitaminD(e.target.value)}
        value={vitaminD}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="calcium">
        Kalsium (mg)
      </label>
      <input
        id="calcium"
        type="number"
        placeholder="contoh: 100"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setCalcium(e.target.value)}
        value={calcium}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="iron">
        Zat Besi (mg)
      </label>
      <input
        id="iron"
        type="number"
        placeholder="contoh: 2"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setIron(e.target.value)}
        value={iron}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="potassium">
        Kalium (mg)
      </label>
      <input
        id="potassium"
        type="number"
        placeholder="contoh: 150"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setPotassium(e.target.value)}
        value={potassium}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="vitaminA">
        Vitamin A (IU atau mcg)
      </label>
      <input
        id="vitaminA"
        type="number"
        placeholder="contoh: 200"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setVitaminA(e.target.value)}
        value={vitaminA}
        required
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="vitaminC">
        Vitamin C (mg)
      </label>
      <input
        id="vitaminC"
        type="number"
        placeholder="contoh: 50"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setVitaminC(e.target.value)}
        value={vitaminC}
        required
      />
    </div>
  </div>
</div>

        
        {/* Informasi Karbon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6 relative">
  {isLoading && (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-xl z-10">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-[#479C25]" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mengambil data jejak karbon...</p>
      </div>
    </div>
  )}

  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Informasi Jejak Karbon
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="karbonMakanan">
        Karbon Makanan (kg CO₂e)
      </label>
      <input
        id="karbonMakanan"
        type="number"
        step="0.01"
        placeholder="contoh: 0.5"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setKarbonMakanan(e.target.value)}
        value={karbonMakanan}
        required
      />
    </div>
    
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="karbonPengolahan">
        Karbon Pengolahan (kg CO₂e)
      </label>
      <input
        id="karbonPengolahan"
        type="number"
        step="0.01"
        placeholder="contoh: 0.2"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setKarbonPengolahan(e.target.value)}
        value={karbonPengolahan}
        required
      />
    </div>
    
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="karbonTransportasiLimbah">
        Karbon Transportasi & Limbah (kg CO₂e)
      </label>
      <input
        id="karbonTransportasiLimbah"
        type="number"
        step="0.01"
        placeholder="contoh: 0.1"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#479C25] focus:border-transparent dark:focus:ring-[#479C25] transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        onChange={(e) => setKarbonTransportasiLimbah(e.target.value)}
        value={karbonTransportasiLimbah}
        required
      />
    </div>
  </div>
</div>


        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menambahkan...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Tambah Produk</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;