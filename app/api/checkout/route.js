export async function POST(req) {
  const body = await req.json();

  const xenditApiKey = process.env.XENDIT_SECRET_KEY;

  const payload = {
    external_id: `kantin-${body.kantinId}-${Date.now()}`,
    amount: body.amount || 20000,
    payment_method: 'QRIS',
    ...(body.merchant_id && { for_user_id: body.merchant_id }), // sub-account Xendit
  };

  const res = await fetch('https://api.xendit.co/qr_codes', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(xenditApiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return Response.json(data);
}
