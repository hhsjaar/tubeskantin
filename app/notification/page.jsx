"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserPromoList() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/promo-codes");
      if (data.success) {
        setPromos(data.promos);
      } else {
        setError(data.message || "Gagal mengambil promo");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Promo Saya</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && promos.length === 0 && <p>Tidak ada promo aktif.</p>}

      <ul className="space-y-4">
        {promos.map((promo) => (
          <li key={promo._id} className="border rounded p-4">
            <p><strong>Kode Promo:</strong> {promo.code}</p>
            <p><strong>Potongan:</strong> Rp {promo.value.toLocaleString("id-ID")}</p>
            <p><small>Dibuat: {new Date(promo.createdAt).toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
