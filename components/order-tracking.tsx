"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  AlertCircle,
  Box,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  LockKeyhole,
  MapPin,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react"
import {
  addOrderItem,
  orderTotal,
  readAddress,
  readCustomer,
  readOrder,
  UPSELL_ITEM_NAME,
  type OrderAddress,
  type OrderCustomer,
  type StoredOrder,
} from "@/lib/order"

const UPSELL_ITEM_VALUE = 47.9

type TimelineState = "completed" | "current" | "upcoming"

type TimelineEvent = {
  title: string
  date?: string
  description: string
  state: TimelineState
}

type ViewOrder = {
  code: string
  tracking: string
  recipient: string
  cpf: string
  product: string
  value: string
  address: string
  purchaseDate: string
  lastUpdate: string
  currentStatus: string
  timeline: TimelineEvent[]
  history: { date: string; description: string }[]
}

/* -------------------- Helpers -------------------- */
function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatCpfInput(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDateTime(date: Date) {
  const d = date.toLocaleDateString("pt-BR")
  const t = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${d} às ${t}`
}

function formatAddress(a: OrderAddress) {
  const linha1 = [a.logradouro, a.numero].filter(Boolean).join(", ")
  const compl = a.complemento ? ` - ${a.complemento}` : ""
  const linha2 = [a.bairro, `${a.cidade}/${a.uf}`, a.cep].filter(Boolean).join(", ")
  return `${linha1}${compl} — ${linha2}`
}

// Pedido de demonstração para acessos diretos, sem dados do funil.
const DEMO_CPF_DIGITS = "12345678909"

function buildViewOrder(
  order: StoredOrder,
  customer: OrderCustomer | null,
  address: OrderAddress | null,
): ViewOrder {
  const purchase = new Date(order.purchaseDate)
  const approved = new Date(purchase.getTime() + 3 * 60 * 1000)
  const preparing = new Date(purchase.getTime() + 40 * 60 * 1000)

  const productLabel =
    order.items.length > 1
      ? `${order.items[0].name} + ${order.items.length - 1} item(ns) adicional(is)`
      : order.items[0]?.name || "Tirzepatida T.G. 15mg"

  const timeline: TimelineEvent[] = [
    {
      title: "Pedido confirmado",
      date: formatDateTime(purchase),
      description: "Recebemos seu pedido e iniciamos o processamento.",
      state: "completed",
    },
    {
      title: "Pagamento aprovado",
      date: formatDateTime(approved),
      description: "Pagamento confirmado com segurança via Pix.",
      state: "completed",
    },
    {
      title: "Pedido sendo preparado",
      date: formatDateTime(preparing),
      description: "Seus produtos estão sendo separados e embalados.",
      state: "current",
    },
    {
      title: "Enviado ao centro logístico",
      description: "Aguardando a coleta da transportadora.",
      state: "upcoming",
    },
    {
      title: "Em transporte",
      description: "O pedido seguirá para a sua região.",
      state: "upcoming",
    },
    {
      title: "Unidade de distribuição",
      description: "O pedido chegará à unidade mais próxima de você.",
      state: "upcoming",
    },
    {
      title: "Saiu para entrega",
      description: "A entrega estará a caminho do endereço informado.",
      state: "upcoming",
    },
    {
      title: "Pedido entregue",
      description: "A entrega será confirmada neste portal.",
      state: "upcoming",
    },
  ]

  return {
    code: `#${order.code}`,
    tracking: order.tracking,
    recipient: customer?.name || "Cliente Tirzepatida T.G.",
    cpf: customer?.document || "•••.•••.•••-••",
    product: productLabel,
    value: `R$ ${formatBRL(orderTotal(order))}`,
    address: address
      ? formatAddress(address)
      : "Endereço informado na compra",
    purchaseDate: formatDateTime(purchase),
    lastUpdate: formatDateTime(preparing),
    currentStatus: "Pedido sendo preparado para envio",
    timeline,
    history: [
      { date: formatDateTime(purchase), description: "Pedido confirmado." },
      { date: formatDateTime(approved), description: "Pagamento aprovado." },
      {
        date: formatDateTime(preparing),
        description: "Pedido sendo preparado para envio.",
      },
    ],
  }
}

/* -------------------- Header -------------------- */
function BrandHeader() {
  return (
    <>
      <header className="bg-[#ffe600]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111] text-[#ffe600]">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold uppercase tracking-tight text-[#111]">
                Tirzepatida <span className="text-[#3483fa]">T.G.</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#111]/70">
                Portal de rastreamento
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-[#111]/20 px-3 py-1 text-xs font-semibold text-[#111] sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Ambiente
            seguro
          </span>
        </div>
      </header>
      <div className="bg-[#111] text-white">
        <div className="mx-auto flex max-w-5xl justify-center gap-6 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide md:gap-12">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <LockKeyhole className="h-3.5 w-3.5 text-[#ffe600]" /> Consulta
            protegida
          </span>
          <span className="hidden items-center gap-2 whitespace-nowrap sm:flex">
            <Truck className="h-3.5 w-3.5 text-[#ffe600]" /> Acompanhamento
            atualizado
          </span>
          <span className="hidden items-center gap-2 whitespace-nowrap md:flex">
            <Box className="h-3.5 w-3.5 text-[#ffe600]" /> Envio discreto
          </span>
        </div>
      </div>
    </>
  )
}

/* -------------------- Resultado do pedido -------------------- */
function OrderResult({
  order,
  onReset,
}: {
  order: ViewOrder
  onReset: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function copyTracking() {
    try {
      await navigator.clipboard.writeText(order.tracking)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* silencioso */
    }
  }

  const details: [string, string][] = [
    ["Código do pedido", order.code],
    ["Código de rastreio", order.tracking],
    ["Produto", order.product],
    ["Valor", order.value],
    ["Destinatário", order.recipient],
    ["CPF", order.cpf],
    ["Data da compra", order.purchaseDate],
    ["Última atualização", order.lastUpdate],
  ]

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      {/* Status atual */}
      <section className="rounded-lg border border-[#00a650]/30 bg-[#e8f8ee] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#00a650]" />
            <div>
              <h2 className="text-lg font-semibold text-[#111]">
                Pedido localizado
              </h2>
              <p className="text-sm text-[#00733e]">
                Confira abaixo cada atualização da sua entrega.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#00a650] px-3 py-1 text-xs font-semibold text-white">
            {order.currentStatus}
          </span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        {/* Detalhes */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#333]">
            Detalhes do pedido
          </h3>
          <p className="mt-0.5 text-sm text-[#666]">
            Informações cadastradas no momento da compra.
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  {label}
                </dt>
                <dd className="text-sm font-medium leading-snug text-[#333]">
                  {value}
                </dd>
              </div>
            ))}
            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                Endereço de entrega
              </dt>
              <dd className="flex items-start gap-1.5 text-sm font-medium leading-snug text-[#333]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3483fa]" />
                {order.address}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={copyTracking}
            className="mt-4 flex items-center gap-2 rounded-md border border-[#d0d0d0] px-4 py-2 text-sm font-semibold text-[#3483fa] hover:bg-[#f5f5f5]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Código copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copiar código de rastreio
              </>
            )}
          </button>
        </section>

        {/* Andamento */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#333]">
            Andamento da entrega
          </h3>
          <p className="mt-0.5 text-sm text-[#666]">
            A etapa atual está destacada em azul.
          </p>
          <ol className="mt-4 flex flex-col">
            {order.timeline.map((event, index) => (
              <li
                key={event.title}
                className="relative flex gap-3 pb-6 last:pb-0"
              >
                <div
                  className={[
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                    event.state === "completed"
                      ? "border-[#00a650] bg-[#00a650] text-white"
                      : event.state === "current"
                        ? "border-[#3483fa] bg-[#3483fa] text-white"
                        : "border-[#d0d0d0] text-[#bbb]",
                  ].join(" ")}
                >
                  {event.state === "completed" ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : event.state === "current" ? (
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[#d0d0d0]" />
                  )}
                  {index < order.timeline.length - 1 ? (
                    <span
                      className={[
                        "absolute left-1/2 top-8 h-6 w-0.5 -translate-x-1/2",
                        event.state === "completed"
                          ? "bg-[#00a650]"
                          : "bg-[#e0e0e0]",
                      ].join(" ")}
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5 pt-1">
                  <p
                    className={[
                      "text-sm font-semibold",
                      event.state === "upcoming" ? "text-[#999]" : "text-[#333]",
                    ].join(" ")}
                  >
                    {event.title}
                  </p>
                  {event.date ? (
                    <p className="text-xs font-medium text-[#666]">
                      {event.date}
                    </p>
                  ) : null}
                  <p className="text-sm leading-snug text-[#666]">
                    {event.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Histórico */}
      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-[#333]">
          Histórico de atualizações
        </h3>
        <p className="mt-0.5 text-sm text-[#666]">
          Eventos registrados em ordem cronológica.
        </p>
        <div className="mt-3 flex flex-col">
          {order.history.map((event, index) => (
            <div key={event.date + event.description}>
              {index > 0 ? (
                <div className="my-3 border-t border-[#e0e0e0]" />
              ) : null}
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#333]">
                  {event.description}
                </p>
                <time className="text-xs text-[#999]">{event.date}</time>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onReset}
        className="mx-auto mt-2 flex items-center gap-2 rounded-md border border-[#d0d0d0] px-5 py-2.5 text-sm font-semibold text-[#333] hover:bg-white"
      >
        <RotateCcw className="h-4 w-4" /> Consultar outro CPF
      </button>
    </div>
  )
}

/* -------------------- Página -------------------- */
export function OrderTracking() {
  const [cpf, setCpf] = useState("")
  const [state, setState] = useState<
    "idle" | "loading" | "found" | "not-found"
  >("idle")
  const [error, setError] = useState("")
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const [customer, setCustomer] = useState<OrderCustomer | null>(null)
  const [address, setAddress] = useState<OrderAddress | null>(null)

  // Carrega o pedido persistido do funil. Se o lead chegou pagando o upsell
  // (?add=upsell), inclui o item adicional antes de exibir o rastreio.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("add") === "upsell") {
      addOrderItem({ name: UPSELL_ITEM_NAME, value: UPSELL_ITEM_VALUE })
      // Limpa o parâmetro para evitar readição em recarregamentos.
      window.history.replaceState(null, "", window.location.pathname)
    }

    const storedOrder = readOrder()
    const storedCustomer = readCustomer()
    const storedAddress = readAddress()
    setOrder(storedOrder)
    setCustomer(storedCustomer)
    setAddress(storedAddress)

    // Vindo do funil, mostra o pedido diretamente, sem exigir CPF.
    if (storedOrder) setState("found")
  }, [])

  const viewOrder = useMemo(
    () => (order ? buildViewOrder(order, customer, address) : null),
    [order, customer, address],
  )

  const validCpfDigits = customer?.document
    ? onlyDigits(customer.document)
    : DEMO_CPF_DIGITS

  function reset() {
    setCpf("")
    setError("")
    setState("idle")
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const digits = onlyDigits(cpf)
    if (digits.length !== 11) {
      setError("Digite um CPF completo com 11 números.")
      return
    }
    setError("")
    setState("loading")
    window.setTimeout(() => {
      setState(digits === validCpfDigits ? "found" : "not-found")
    }, 650)
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] text-[#333]">
      <BrandHeader />
      <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 md:py-12">
        <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-balance text-3xl font-extrabold uppercase tracking-tight text-[#111] md:text-4xl">
              Acompanhe seu pedido
            </h1>
            <p className="max-w-lg text-pretty text-sm leading-relaxed text-[#666] md:text-base">
              Digite o CPF utilizado na compra para consultar todas as
              atualizações do seu pedido.
            </p>
          </div>

          {state === "idle" || state === "loading" ? (
            <div className="w-full rounded-lg bg-white p-5 text-left shadow-sm">
              <h2 className="text-lg font-semibold text-[#333]">
                Consultar entrega
              </h2>
              <p className="mt-0.5 text-sm text-[#666]">
                Use somente o CPF informado durante a compra.
              </p>
              <form onSubmit={submit} className="mt-4" noValidate>
                <label
                  htmlFor="cpf"
                  className="mb-1 block text-sm font-medium text-[#333]"
                >
                  CPF
                </label>
                <input
                  id="cpf"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpfInput(e.target.value))}
                  aria-invalid={!!error}
                  aria-describedby={error ? "cpf-error" : undefined}
                  className="h-12 w-full rounded-md border border-[#d0d0d0] px-3 text-base outline-none focus:border-[#3483fa]"
                />
                {error ? (
                  <p id="cpf-error" className="mt-1 text-xs text-[#e6394a]">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#3483fa] text-base font-semibold text-white hover:bg-[#2968c8] disabled:opacity-70"
                >
                  <Search className="h-4 w-4" />
                  {state === "loading" ? "Consultando..." : "Consultar pedido"}
                </button>
              </form>
            </div>
          ) : null}

          {state === "not-found" ? (
            <div className="w-full rounded-lg border border-[#e6394a]/30 bg-[#fdecee] p-4 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#e6394a]" />
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="font-semibold text-[#b3283a]">
                      Pedido não encontrado
                    </h2>
                    <p className="text-sm text-[#8a2531]">
                      Não localizamos nenhum pedido vinculado ao CPF informado.
                      Verifique os dados e tente novamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex w-fit items-center gap-2 rounded-md border border-[#e6394a]/40 bg-white px-4 py-2 text-sm font-semibold text-[#b3283a] hover:bg-[#fdecee]"
                  >
                    <RotateCcw className="h-4 w-4" /> Consultar novamente
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {state === "found" && viewOrder ? (
          <section className="mt-8">
            <OrderResult order={viewOrder} onReset={reset} />
          </section>
        ) : null}
      </main>

      <footer className="mt-8 border-t border-[#d5d5d5]">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-center text-xs text-[#999]">
          <p>© 2026 Tirzepatida T.G. Todos os direitos reservados.</p>
          <p>Portal para acompanhamento de pedidos.</p>
        </div>
      </footer>
    </div>
  )
}
