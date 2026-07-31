"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, BadgePercent, Zap, X, Truck } from "lucide-react"

/* Paleta da identidade Mercado Livre usada no funil */
const ML_YELLOW = "#ffe600"
const ML_NAVY = "#2d3277"

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

/** Animação de entrada com atraso escalonado. */
function reveal(delay: number) {
  return {
    className: "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out",
    style: { animationDelay: `${delay}ms`, animationFillMode: "both" as const },
  }
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
    <div className="min-h-screen bg-[#ebebeb] text-[#333]">
      {showNotif ? (
        <OrderNotification
          address={address}
          onClose={() => setShowNotif(false)}
        />
      ) : null}

      {/* Barra superior fina de confirmação */}
      <div className="w-full bg-[#ffe600]">
        <div className="mx-auto flex max-w-[600px] items-center justify-center gap-1.5 px-4 py-1.5">
          <Check className="h-3.5 w-3.5 text-[#111]" strokeWidth={3} />
          <span className="text-xs font-semibold text-[#111]">
            Seu pedido foi reservado com sucesso!
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-[600px] px-3 pb-16 pt-3">
        {/* BANNER — elemento principal */}
        <section
          {...reveal(0)}
          className="overflow-hidden rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3)]"
        >
          <img
            src="/banner-upsell.png"
            alt="Oferta 8.8 Dia dos Pais: seu pedido desbloqueou mais 1 ampola por apenas R$47,90"
            className="w-full object-cover"
          />
        </section>

        {/* HEADLINE + SUBTÍTULO */}
        <section {...reveal(120)} className="mt-6 text-center">
          <h1
            className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
            style={{ color: ML_NAVY }}
          >
            Adicione mais 1 ampola ao seu pedido por apenas{" "}
            <span className="whitespace-nowrap">R$47,90</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-[#555] sm:text-base">
            Aproveite o mesmo frete e aumente seu tratamento por um valor
            exclusivo.
          </p>
        </section>

        {/* BENEFÍCIOS DISCRETOS */}
        <section
          {...reveal(200)}
          className="mt-5 grid grid-cols-3 gap-2"
        >
          {[
            { icon: Truck, label: "Mesmo envio" },
            { icon: BadgePercent, label: "Preço exclusivo" },
            { icon: Zap, label: "Sem novo cadastro" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[#e6e6e6] bg-white px-2 py-3 text-center"
            >
              <Icon className="h-5 w-5 text-[#3483fa]" strokeWidth={2} />
              <span className="text-[11px] font-medium leading-tight text-[#555] sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </section>

        {/* BOTÃO PRINCIPAL (amarelo, identidade ML) */}
        <section {...reveal(300)} className="mt-6">
          <button
            type="button"
            onClick={handleAccept}
            className="group w-full rounded-2xl px-6 py-5 text-center shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: ML_YELLOW, color: ML_NAVY }}
          >
            <span className="flex items-center justify-center gap-2 text-lg font-extrabold uppercase tracking-tight sm:text-xl">
              <Check className="h-6 w-6" strokeWidth={3} />
              Sim! Quero adicionar +1 ampola
            </span>
            <span className="mt-1 block text-2xl font-extrabold sm:text-3xl">
              por R$47,90
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-[#777]">
            Pagamento será incluído no mesmo pedido.
          </p>

          {/* BOTÃO SECUNDÁRIO DISCRETO */}
          <button
            type="button"
            onClick={handleDecline}
            className="mx-auto mt-5 block text-sm text-[#999] underline-offset-4 transition-colors hover:text-[#666] hover:underline"
          >
            Não, desejo continuar apenas com meu pedido atual.
          </button>
        </section>

        {/* RODAPÉ */}
        <section
          {...reveal(380)}
          className="mt-10 border-t border-[#dcdcdc] pt-5 text-center"
        >
          <p className="mx-auto max-w-sm text-pretty text-xs leading-relaxed text-[#999]">
            Oferta exclusiva desta etapa da compra. Ao sair desta página ela não
            poderá ser recuperada.
          </p>
        </section>
      </main>
    </div>
  )
}
