import { type NextRequest, NextResponse } from "next/server"

const PARADISE_BASE_URL = "https://multi.paradisepags.com"

export async function GET(req: NextRequest) {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Configuração indisponível." }, { status: 500 })
  }

  const id = req.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID da transação não informado." }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${PARADISE_BASE_URL}/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
        cache: "no-store",
      },
    )

    const data = await res.json().catch(() => null)

    if (!res.ok || !data) {
      return NextResponse.json({ status: "pending" })
    }

    return NextResponse.json({ status: data.status ?? "pending" })
  } catch {
    return NextResponse.json({ status: "pending" })
  }
}
