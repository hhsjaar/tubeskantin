export async function POST(req) {
  const body = await req.json();
  const { amount, customer_name } = body;
  const trxId = 'TRX-' + Date.now();

  try {
    const response = await fetch('https://api-stg.oyindonesia.com/api/payment-checkout/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-oy-username': process.env.OY_USERNAME,
        'x-api-key': process.env.OY_API_KEY,
      },
      body: JSON.stringify({
        partner_trx_id: trxId,
        customer_name,
        amount,
        currency: 'IDR',
        payment_method: 'QRIS',
        is_open: false,
        step: 'payment_link',
      })
    });

    const data = await response.json();

    // Simulasi simpan transaksi ke DB
    console.log(`[SAVE] Created trx ${trxId}`);

    return Response.json({
      trxId,
      qr_string: data.data.qr_string,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create QRIS' }), { status: 500 });
  }
}