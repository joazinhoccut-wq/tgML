"use client"

import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Check,
  Package,
  Truck,
  Ban,
  Wallet,
  ShieldCheck,
  Lock,
  Box,
  BadgePercent,
} from "lucide-react"

const BRAND_YELLOW = "#FCD203"

/** Pequeno helper para animação de entrada com atraso escalonado. */
function reveal(delay: number) {
  return {
    className:
      "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out",
    style: { animationDelay: `${delay}ms`, animationFillMode: "both" as const },
  }
}

export function UpsellPage() {
  const router = useRouter()

  function handleAccept() {
    // TODO: conectar ao fluxo real de cobrança one-click do upsell (R$47).
    router.push("/")
  }

  function handleDecline() {
    // TODO: conectar à página de conclusão do pedido atual.
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Barra de confirmação (estilo Mercado Livre) */}
      <div className="w-full bg-[#00a650] text-white">
        <div className="mx-auto flex max-w-3xl items-start gap-3 px-4 py-3 sm:items-center">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 sm:mt-0">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold sm:text-base">
              Parabéns! Seu pedido foi reservado com sucesso!
            </p>
            <p className="text-xs text-white/85 sm:text-sm">
              Seu pedido será processado logo após esta etapa.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        {/* HERO */}
        <section
          {...reveal(0)}
          className="relative mt-5 overflow-hidden rounded-3xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)]"
          style={{ backgroundColor: BRAND_YELLOW }}
        >
          {/* brilho branco suave */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-2/3"
            style={{
              background:
                "radial-gradient(60% 60% at 70% 45%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
          <div className="relative grid grid-cols-1 items-center gap-2 sm:grid-cols-[1.1fr_0.9fr]">
            {/* Texto */}
            <div className="px-6 pt-7 sm:py-9 sm:pl-9">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
                Espere!
              </span>
              <h1 className="mt-4 text-pretty text-3xl font-extrabold leading-[1.05] tracking-tight text-[#1a1a1a] sm:text-4xl">
                Você acabou de desbloquear uma oferta exclusiva.
              </h1>
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-[#1a1a1a]/80 sm:text-base">
                Complete seu tratamento adicionando mais uma ampola por um valor
                que nunca mais será oferecido após esta compra.
              </p>
            </div>

            {/* Personagem */}
            <div className="relative h-56 w-full sm:h-80">
              <img
                src="/upsell-hero.png"
                alt="Especialista recomendando a ampola em oferta"
                className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
              />
            </div>
          </div>
        </section>

        {/* CARD PRINCIPAL DA OFERTA */}
        <section
          {...reveal(120)}
          className="relative z-10 -mt-4 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.3)] sm:p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7]">
              <img
                src="/images/tg-11.png"
                alt="Ampola T.G. adicional"
                className="h-36 w-auto object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">
                +1 Ampola Extra
              </h2>
              <div className="mt-3 flex items-baseline justify-center gap-3 sm:justify-start">
                <span className="text-lg text-[#999] line-through">R$97</span>
                <span className="text-4xl font-extrabold text-[#e63946]">
                  R$47<span className="align-top text-xl">,00</span>
                </span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#e9f9ef] px-3 py-1.5 text-sm font-semibold text-[#00a650]">
                <Check className="h-4 w-4" strokeWidth={3} />
                Você economiza R$50 hoje.
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section
          {...reveal(200)}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: Package, label: "Mesmo produto" },
            { icon: Truck, label: "Mesmo envio" },
            { icon: Ban, label: "Sem novo frete" },
            { icon: Wallet, label: "Economia imediata" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#ececec] bg-white px-3 py-4 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8cc]">
                <Icon className="h-5 w-5 text-[#1a1a1a]" strokeWidth={2} />
              </span>
              <span className="text-xs font-semibold text-[#333]">{label}</span>
            </div>
          ))}
        </section>

        {/* CAIXA DE URGÊNCIA */}
        <section
          {...reveal(260)}
          className="mt-4 flex items-start gap-3 rounded-xl border border-[#e63946]/40 bg-white p-4"
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#e63946]"
            strokeWidth={2.2}
          />
          <p className="text-sm leading-relaxed text-[#444]">
            Esta condição é exclusiva para clientes que acabaram de finalizar o
            pedido. Ao sair desta página, esta oferta será encerrada e não
            poderá ser recuperada.
          </p>
        </section>

        {/* BOTÃO PRINCIPAL */}
        <section {...reveal(320)} className="mt-6">
          <button
            type="button"
            onClick={handleAccept}
            className="group w-full rounded-xl bg-[#00a650] px-6 py-4 text-center font-bold text-white shadow-[0_10px_24px_-8px_rgba(0,166,80,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#008a43] active:translate-y-0"
          >
            <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
              <Check className="h-5 w-5" strokeWidth={3} />
              SIM! Quero adicionar +1 ampola por R$47
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-[#888]">
            Adicionar ao meu pedido sem precisar preencher os dados novamente.
          </p>

          {/* BOTÃO SECUNDÁRIO */}
          <button
            type="button"
            onClick={handleDecline}
            className="mx-auto mt-4 block text-sm text-[#999] underline-offset-4 transition-colors hover:text-[#666] hover:underline"
          >
            Não, desejo continuar apenas com meu pedido atual.
          </button>
        </section>

        {/* RODAPÉ - BADGES */}
        <section
          {...reveal(380)}
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#eee] pt-6 sm:grid-cols-4"
        >
          {[
            { icon: ShieldCheck, label: "Compra segura" },
            { icon: Lock, label: "Pagamento protegido" },
            { icon: Box, label: "Entrega discreta" },
            { icon: BadgePercent, label: "Oferta exclusiva" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 text-center text-xs text-[#999]"
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {label}
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
