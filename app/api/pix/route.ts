import { type NextRequest, NextResponse } from "next/server"

const PINGUPAG_BASE_URL = "https://app.pingupag.com"

type CustomerInput = {
  name: string
  email: string
  document: string
  phone: string
}

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "")
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.SECRETKEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Configuração de pagamento indisponível. Tente novamente mais tarde." },
      { status: 500 },
    )
  }

  let body: {
    amount?: number
    description?: string
    customer?: CustomerInput
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 })
  }

  const { amount, description, customer } = body

  // Validação básica dos dados obrigatórios
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !customer ||
    !customer.name?.trim() ||
    !customer.email?.trim() ||
    !onlyDigits(customer.document || "") ||
    !onlyDigits(customer.phone || "")
  ) {
    return NextResponse.json({ error: "Dados do pagamento incompletos." }, { status: 400 })
  }

  // Valor em centavos (arredondado para evitar problemas de ponto flutuante)
  const amountInCents = Math.round(amount * 100)

  const reference = `ML-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  // source: "api_externa" ignora a validação de productHash, já que os
  // produtos não são cadastrados na plataforma PinguPag.
  const payload = {
    amount: amountInCents,
    description: description?.trim() || "Compra Mercado Livre",
    reference,
    source: "api_externa",
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      document: onlyDigits(customer.document),
      phone: onlyDigits(customer.phone),
    },
  }

  try {
    const res = await fetch(`${PINGUPAG_BASE_URL}/gateway/v1/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok || !data || data.status !== "success") {
      console.log("[v0] PinguPag error:", res.status, JSON.stringify(data))
      return NextResponse.json(
        { error: "Não foi possível gerar o PIX. Tente novamente." },
        { status: 502 },
      )
    }

    return NextResponse.json({
      transactionId: data.transaction_id,
      reference: data.id ?? reference,
      qrCode: data.qr_code,
      qrCodeBase64: data.qr_code_base64,
      amount: data.amount,
      expiresAt: data.expires_at ?? null,
    })
  } catch (err) {
    console.log("[v0] PinguPag fetch failed:", (err as Error).message)
    return NextResponse.json(
      { error: "Falha na comunicação com o pagamento. Tente novamente." },
      { status: 502 },
    )
  }
}
