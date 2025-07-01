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
  const [kantin, setKantin] = useState('Kantin Kodok'); // Menambahkan state untuk kantin
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [portionSize, setPortionSize] = useState('');
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

  const [debouncedName] = useDebounce(name, 800);
const [debouncedDescription] = useDebounce(description, 800);

useEffect(() => {
  const fetchAutoNutrition = async () => {
    if (debouncedName.length < 3 || debouncedDescription.length < 10) return;

    try {
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
    }
  };

  fetchAutoNutrition();
}, [debouncedName, debouncedDescription]);


  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('category',category)
    formData.append('kantin',kantin) // Menambahkan kantin ke formData
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
        setKantin('Kantin Teknik'); // Reset kantin ke default
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
    }


  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Makanan Berat">Makanan Berat</option>
              <option value="Minuman">Minuman</option>
              <option value="Gorengan">Gorengan</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-40">
  <label className="text-base font-medium" htmlFor="kantin">
    Kantin
  </label>
  <input
    type="text"
    id="kantin"
    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 bg-gray-100 cursor-not-allowed"
    value="Kantin Kodok"
    readOnly
  />
</div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="portion-size">
            Portion Size
          </label>
          <input
            id="portion-size"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setPortionSize(e.target.value)}
            value={portionSize}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="calories">
            Calories
          </label>
          <input
            id="calories"
            type="number"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setCalories(e.target.value)}
            value={calories}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="total-fat">
            Total Fat (g)
          </label>
          <input
            id="total-fat"
            type="number"
            placeholder="e.g., 10"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setTotalFat(e.target.value)}
            value={totalFat}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="cholesterol">
            Cholesterol (mg)
          </label>
          <input
            id="cholesterol"
            type="number"
            placeholder="e.g., 5"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setCholesterol(e.target.value)}
            value={cholesterol}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="sodium">
            Sodium (mg)
          </label>
          <input
            id="sodium"
            type="number"
            placeholder="e.g., 5"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setSodium(e.target.value)}
            value={sodium}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="total-carbohydrates">
            Total Carbohydrates (g)
          </label>
          <input
            id="total-carbohydrates"
            type="number"
            placeholder="e.g., 20"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setTotalCarbohydrates(e.target.value)}
            value={totalCarbohydrates}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="protein">
            Protein (g)
          </label>
          <input
            id="protein"
            type="number"
            placeholder="e.g., 5"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setProtein(e.target.value)}
            value={protein}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="vitaminD">
            Vitamin D (IU or mg)
          </label>
          <input
            id="vitaminD"
            type="number"
            placeholder="e.g., 10"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setVitaminD(e.target.value)}
            value={vitaminD}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="calcium">
            Calcium (mg)
          </label>
          <input
            id="calcium"
            type="number"
            placeholder="e.g., 100"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setCalcium(e.target.value)}
            value={calcium}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="iron">
            Iron (mg)
          </label>
          <input
            id="iron"
            type="number"
            placeholder="e.g., 2"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setIron(e.target.value)}
            value={iron}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="potassium">
            Potassium (mg)
          </label>
          <input
            id="potassium"
            type="number"
            placeholder="e.g., 150"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setPotassium(e.target.value)}
            value={potassium}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="vitaminA">
            Vitamin A (IU or mcg)
          </label>
          <input
            id="vitaminA"
            type="number"
            placeholder="e.g., 200"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setVitaminA(e.target.value)}
            value={vitaminA}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="vitaminC">
            Vitamin C (mg)
          </label>
          <input
            id="vitaminC"
            type="number"
            placeholder="e.g., 50"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setVitaminC(e.target.value)}
            value={vitaminC}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="karbonMakanan">
            Karbon Makanan (kg CO₂e)
          </label>
          <input
            id="karbonMakanan"
            type="number"
            step="0.01"
            placeholder="e.g., 0.5"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setKarbonMakanan(e.target.value)}
            value={karbonMakanan}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="karbonPengolahan">
            Karbon Pengolahan (kg CO₂e)
          </label>
          <input
            id="karbonPengolahan"
            type="number"
            step="0.01"
            placeholder="e.g., 0.2"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setKarbonPengolahan(e.target.value)}
            value={karbonPengolahan}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="karbonTransportasiLimbah">
            Karbon Transportasi & Limbah (kg CO₂e)
          </label>
          <input
            id="karbonTransportasiLimbah"
            type="number"
            step="0.01"
            placeholder="e.g., 0.1"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setKarbonTransportasiLimbah(e.target.value)}
            value={karbonTransportasiLimbah}
            required
          />
        </div>

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;