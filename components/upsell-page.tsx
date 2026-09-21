"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, BadgePercent, Zap, X, Truck } from "lucide-react"

type SavedAddress = {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  cep: string
} | null

function readAddress(): SavedAddress {
  try {
    const raw = sessionStorage.getItem("upsell:address")
    return raw ? (JSON.parse(raw) as SavedAddress) : null
  } catch {
    return null
  }
}

function formatAddress(a: NonNullable<SavedAddress>) {
  const linha1 = [a.logradouro, a.numero].filter(Boolean).join(", ")
  const compl = a.complemento ? ` - ${a.complemento}` : ""
  const linha2 = [a.bairro, `${a.cidade}/${a.uf}`].filter(Boolean).join(" · ")
  return { linha1: `${linha1}${compl}`, linha2 }
}

/* -------------------- Notificação estilo Mercado Livre -------------------- */
function OrderNotification({
  address,
  onClose,
}: {
  address: SavedAddress
  onClose: () => void
}) {
  const formatted = address ? formatAddress(address) : null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <div className="animate-in fade-in slide-in-from-top-4 pointer-events-auto w-full max-w-[420px] rounded-xl border border-[#e0e0e0] bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] duration-500">
        <div className="flex items-start gap-3 p-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ffe600]">
            <img
              src="/mercado-livre-logo.png"
              alt="Mercado Livre"
              className="h-9 w-9 object-contain"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#333]">
                Mercado Livre
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00a650]">
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
              </span>
              <span className="ml-auto text-xs text-[#999]">agora</span>
            </div>
            <p className="mt-0.5 text-sm leading-snug text-[#333]">
              Seu pedido já está sendo separado
              {formatted ? " para o endereço:" : "."}
            </p>
            {formatted ? (
              <div className="mt-1 rounded-md bg-[#f5f5f5] px-2.5 py-1.5">
                <p className="text-xs font-medium leading-snug text-[#333]">
                  {formatted.linha1}
                </p>
                {formatted.linha2 ? (
                  <p className="text-xs leading-snug text-[#666]">
                    {formatted.linha2}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar notificação"
            className="shrink-0 rounded-md p-1 text-[#999] hover:bg-[#f0f0f0] hover:text-[#666]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Página de Upsell -------------------- */
export function UpsellPage() {
  const router = useRouter()
  const [address, setAddress] = useState<SavedAddress>(null)
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    setAddress(readAddress())
    const openTimer = setTimeout(() => setShowNotif(true), 400)
    const closeTimer = setTimeout(() => setShowNotif(false), 8000)
    return () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }
  }, [])

  function handleAccept() {
    // TODO: conectar ao fluxo real de cobrança one-click do upsell (R$47,90).
    router.push("/")
  }

  function handleDecline() {
    // TODO: conectar à página de conclusão do pedido atual.
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] pb-28 text-[#333]">
      {showNotif ? (
        <OrderNotification
          address={address}
          onClose={() => setShowNotif(false)}
        />
      ) : null}

      {/* Header amarelo — mesma identidade do checkout */}
      <header className="sticky top-0 z-10 bg-[#ffe600]">
        <div className="mx-auto flex max-w-[600px] items-center gap-3 px-4 py-4">
          <h1 className="text-xl font-semibold text-[#111]">
            Oferta exclusiva do seu pedido
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[600px] px-3 py-3">
        {/* Confirmação discreta */}
        <div className="flex items-center gap-2 rounded-lg bg-[#e8f8ee] px-4 py-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00a650]">
            <Check className="h-3 w-3 text-white" strokeWidth={4} />
          </span>
          <span className="text-sm font-medium text-[#00733e]">
            Seu pedido foi separado com sucesso!
          </span>
        </div>

          {/* Banner — sem bordas */}
          <section className="mt-3 overflow-hidden">
            <img
              src="/banner-upsell.png"
              alt="Mega Promoção de Setembro: seu pedido desbloqueou mais 1 ampola por apenas R$47,90"
              className="w-full object-cover"
            />
        </section>

        {/* Card da oferta */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">
            Adicione mais 1 ampola ao seu pedido
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[#666]">
            Aproveite o mesmo frete e aumente seu tratamento por um valor
            exclusivo, disponível apenas nesta etapa.
          </p>

          <ul className="mt-4 space-y-3 border-t border-[#e0e0e0] pt-4">
            <li className="flex items-center gap-2.5 text-sm text-[#333]">
              <Truck className="h-4 w-4 shrink-0 text-[#3483fa]" />
              Mesmo envio, sem custo adicional de frete
            </li>
            <li className="flex items-center gap-2.5 text-sm text-[#333]">
              <BadgePercent className="h-4 w-4 shrink-0 text-[#3483fa]" />
              Preço exclusivo desta oferta
            </li>
            <li className="flex items-center gap-2.5 text-sm text-[#333]">
              <Zap className="h-4 w-4 shrink-0 text-[#3483fa]" />
              Sem novo cadastro nem nova cobrança de envio
            </li>
          </ul>
        </section>

        {/* Resumo do adicional — espelha o resumo da compra */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">
            Resumo do adicional
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[#333]">+1 ampola Tirzepatida T.G.</dt>
              <dd className="text-[#333]">R$ 47,90</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#333]">Frete adicional</dt>
              <dd className="font-semibold text-[#00a650]">Grátis</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-end justify-between border-t border-[#e0e0e0] pt-3">
            <span className="text-lg font-semibold text-[#333]">
              Total do adicional
            </span>
            <span className="text-xl font-bold text-[#333]">R$ 47,90</span>
          </div>
          <p className="mt-1 text-right text-xs text-[#00a650]">
            Incluído no mesmo pedido, sem novo frete
          </p>
        </section>

        {/* Recusar — discreto */}
        <button
          type="button"
          onClick={handleDecline}
          className="mx-auto mt-5 block text-sm text-[#3483fa] underline-offset-4 transition-colors hover:underline"
        >
          Não, continuar apenas com meu pedido atual
        </button>

        {/* Rodapé */}
        <p className="mx-auto mt-6 max-w-sm text-pretty text-center text-xs leading-relaxed text-[#999]">
          Oferta exclusiva desta etapa da compra. Ao sair desta página ela não
          poderá ser recuperada.
        </p>
      </main>

      {/* Barra fixa inferior — mesma da oferta principal */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e0e0e0] bg-white">
        <div className="mx-auto flex max-w-[600px] items-center justify-between gap-3 px-4 py-3">
          <div className="leading-tight">
            <div className="text-xl font-bold text-[#333]">R$ 47,90</div>
            <div className="text-xs text-[#666]">+1 ampola no mesmo pedido</div>
          </div>
          <button
            type="button"
            onClick={handleAccept}
            className="shrink-0 rounded-md bg-[#3483fa] px-8 py-3 text-sm font-semibold text-white hover:bg-[#2968c8]"
          >
            Adicionar ao pedido
          </button>
        </div>
      </div>
    </div>
  )
}
