// app/api/checkout/route.js
import { kantins } from "@/lib/kantins";
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req) {
  const body = await req.json();
  const { kantinId, customerName, total } = body;

  const kantin = kantins.find((k) => k.id === kantinId);
  if (!kantin) {
    return NextResponse.json(
      { error: "Kantin tidak ditemukan." },
      { status: 400 }
    );
  }

  const snap = new midtransClient.Snap({
    isProduction: kantin.isProduction,
    serverKey: kantin.serverKey,
  });

  const parameter = {
    transaction_details: {
      order_id: `ORDER-${kantinId}-${Date.now()}`,
      gross_amount: total,
    },
    customer_details: {
      first_name: customerName,
    },
    credit_card: {
      secure: true,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({
      snapToken: transaction.token,
      clientKey: kantin.clientKey,
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi.", detail: error.message },
      { status: 500 }
    );
  }
}
