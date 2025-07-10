'use client'
import React, { useState } from 'react';

const kantins = [
  { id: 'kandok', name: 'Kantin Kodok' },
  { id: 'kantek', name: 'Kantin Teknik' },
  // ...
];

export default function CheckoutPage() {
  const [form, setForm] = useState({ kantinId: '', customerName: '', total: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.snapToken && data.clientKey) {
      // Load Snap.js from Midtrans
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', data.clientKey);
      document.body.appendChild(script);

      script.onload = () => {
        window.snap.pay(data.snapToken, {
          onSuccess: () => alert("Pembayaran sukses"),
          onPending: () => alert("Menunggu pembayaran"),
          onError: () => alert("Pembayaran gagal"),
          onClose: () => alert("Anda menutup popup"),
        });
      };
    } else {
      alert("Gagal membuat token.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="border p-2 w-full"
          value={form.kantinId}
          onChange={e => setForm({ ...form, kantinId: e.target.value })}
          required
        >
          <option value="">Pilih Kantin</option>
          {kantins.map(k => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>

        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Nama Pemesan"
          value={form.customerName}
          onChange={e => setForm({ ...form, customerName: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Total Harga"
          value={form.total}
          onChange={e => setForm({ ...form, total: parseInt(e.target.value) })}
          required
        />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
}
