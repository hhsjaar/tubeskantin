'use client';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [paid, setPaid] = useState(false);

  const createInvoice = async () => {
    const res = await fetch('/api/xendit-create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2499000, kantin_id: 'kantin-a' }),
    });
    const data = await res.json();
    setInvoiceUrl(data.invoice_url);
    setInvoiceId(data.id); // ← kita harus kembalikan id invoice juga
  };

  // Polling status invoice tiap 5 detik
  useEffect(() => {
    if (!invoiceId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/xendit-check-invoice?id=${invoiceId}`);
      const data = await res.json();
      if (data.status === 'PAID') {
        clearInterval(interval);
        setPaid(true);
        // Trigger disburse manual
        await fetch('/api/xendit-disburse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kantin_id: 'kantin-a', amount: data.amount })
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pembayaran Kantin</h1>
      <button onClick={createInvoice}>Bayar Sekarang</button>
      {invoiceUrl && <iframe src={invoiceUrl} width="400" height="600" />}
      {paid && <p>✅ Pembayaran berhasil & dana dikirim ke kantin!</p>}
    </div>
  );
}
