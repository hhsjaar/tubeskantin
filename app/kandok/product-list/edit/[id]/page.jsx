"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const EditProduct = () => {
  const { getToken } = useAppContext();
  const { id } = useParams();
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Makanan Berat");
  const [kantin, setKantin] = useState("Kantin Kodok");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [portionSize, setPortionSize] = useState("");

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
  const product = data.product;

  setName(product.name || "");
  setDescription(product.description || "");
  setCategory(product.category || "Makanan Berat");
  setKantin(product.kantin || "Kantin Kodok");
  setPrice(product.price || "");
  setOfferPrice(product.offerPrice || "");
  setPortionSize(product.portionSize || "");
  
  if (product.images && Array.isArray(product.images)) {
    setFiles(product.images); // Jika image berupa URL string
  }
}
 else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch product');
    }
  };

  if (id) fetchProduct();
}, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("kantin", kantin);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("portionSize", portionSize);

    for (let i = 0; i < files.length; i++) {
      if (files[i] instanceof File) {
        formData.append("images", files[i]);
      }
    }

    try {
      const token = await getToken();
      const res = await axios.put(`/api/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Berhasil update");
        router.push("/kandok/product-list");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update product");
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
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index] instanceof File
                      ? URL.createObjectURL(files[index])
                      : files[index] || assets.upload_area
                  }
                  alt="preview"
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
    placeholder={name ? undefined : "Masukkan nama produk"}
    className="outline-none py-2 px-3 rounded border border-gray-500/40"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
</div>


        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              className="outline-none py-2 px-3 rounded border border-gray-500/40 bg-gray-100 cursor-not-allowed"
              value={kantin}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offerPrice">
              Offer Price
            </label>
            <input
              id="offerPrice"
              type="number"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="portionSize">
            Portion Size
          </label>
          <input
            id="portionSize"
            type="text"
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            value={portionSize}
            onChange={(e) => setPortionSize(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
