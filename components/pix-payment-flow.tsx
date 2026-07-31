"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Clock, Copy, Info, Loader2 } from "lucide-react"
import QRCode from "react-qr-code"

type PixData = {
  transactionId: number | string
  reference: string
  qrCode: string
  qrCodeBase64: string
  amount: number
  expiresAt: string | null
}

type Customer = {
  name: string
  email: string
  document: string
  phone: string
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function maskCpf(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  }
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const PHRASES = [
  { text: "Encaminhando seu pedido", color: "#ffe600" },
  { text: "Já é quase sua!", color: "#3483fa" },
  { text: "Pedido separado!", color: "#00a650" },
]

/* -------------------- Loading com 3 frases -------------------- */
function ProcessingScreen({ phase }: { phase: number }) {
  const current = PHRASES[Math.min(phase, PHRASES.length - 1)]
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="mb-8 text-2xl font-bold text-[#111] text-balance">
        {current.text}
      </h1>
      <div
        className="h-14 w-14 animate-spin rounded-full border-4 border-[#e8e8e8]"
        style={{ borderTopColor: current.color }}
        role="status"
        aria-label="Processando pagamento"
      />
    </div>
  )
}

/* -------------------- Formulário de dados -------------------- */
function CustomerForm({
  amount,
  onBack,
  onSubmit,
}: {
  amount: number
  onBack: () => void
  onSubmit: (customer: Customer) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [document, setDocument] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (name.trim().split(" ").filter(Boolean).length < 2)
      next.name = "Informe seu nome completo."
    if (!isValidEmail(email)) next.email = "Informe um e-mail válido."
    if (document.replace(/\D/g, "").length !== 11) next.document = "CPF inválido."
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Telefone inválido."
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSubmit({ name: name.trim(), email: email.trim(), document, phone })
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] pb-8 text-[#333]">
      <header className="sticky top-0 z-10 bg-[#ffe600]">
        <div className="mx-auto flex max-w-[600px] items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="shrink-0 text-[#111] hover:opacity-70"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-[#111]">Seus dados</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[600px] px-3 py-4">
        <p className="mb-3 px-1 text-sm text-[#666]">
          Precisamos dos seus dados para gerar o pagamento via Pix.
        </p>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-4 shadow-sm"
          noValidate
        >
          <Field label="Nome completo" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como no seu documento"
              className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm outline-none focus:border-[#3483fa]"
              autoComplete="name"
            />
          </Field>

          <Field label="CPF" error={errors.document}>
            <input
              type="text"
              inputMode="numeric"
              value={document}
              onChange={(e) => setDocument(maskCpf(e.target.value))}
              placeholder="000.000.000-00"
              className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm outline-none focus:border-[#3483fa]"
            />
          </Field>

          <Field label="E-mail" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm outline-none focus:border-[#3483fa]"
              autoComplete="email"
            />
          </Field>

          <Field label="Telefone com DDD" error={errors.phone}>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm outline-none focus:border-[#3483fa]"
              autoComplete="tel"
            />
          </Field>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-[#3483fa] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2968c8]"
          >
            Gerar Pix de R$ {formatBRL(amount)}
          </button>
        </form>
      </main>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-[#333]">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-[#e6394a]">{error}</p> : null}
    </div>
  )
}

/* -------------------- Tela do Pix -------------------- */
function PixScreen({
  pix,
  amount,
  approved,
  onAlreadyPaid,
}: {
  pix: PixData
  amount: number
  approved: boolean
  onAlreadyPaid: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pix.qrCode)
    } catch {
      const el = document.createElement("textarea")
      el.value = pix.qrCode
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (approved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#ebebeb] px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00a650]">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#111]">
          Pagamento aprovado!
        </h1>
        <p className="mt-2 max-w-xs text-sm text-[#666] text-pretty">
          Recebemos seu pagamento de R$ {formatBRL(amount)}. Seu pedido já está
          sendo preparado.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] pb-10 text-[#333]">
      <main className="mx-auto max-w-[600px] px-3 py-4">
        {/* Cabeçalho valor */}
        <section className="rounded-lg bg-white px-4 py-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00a650]">
            <img
              src="https://logospng.org/download/pix/logo-pix-icone-1024.png"
              alt="Pix"
              className="h-8 w-8 object-contain"
            />
          </div>
          <p className="text-sm text-[#666]">Falta pouco!</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111] text-balance">
            Pague R$ {formatBRL(amount)} via Pix para concluir sua compra
          </h1>
        </section>

        {/* QR Code */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">
            Escaneie um código QR para pagar
          </h2>
          <ol className="mt-3 space-y-1.5 text-sm text-[#333]">
            <li>
              <span className="font-semibold">1.</span> Acesse seu Internet
              Banking ou app de pagamentos.
            </li>
            <li>
              <span className="font-semibold">2.</span> Escolha pagar via Pix.
            </li>
            <li>
              <span className="font-semibold">3.</span> Escaneie o seguinte
              código:
            </li>
          </ol>

          <div className="mt-4 flex justify-center">
            {pix.qrCodeBase64 ? (
              <img
                src={pix.qrCodeBase64 || "/placeholder.svg"}
                alt="QR Code Pix"
                className="h-48 w-48 object-contain"
              />
            ) : pix.qrCode ? (
              <div className="rounded bg-white p-2">
                <QRCode
                  value={pix.qrCode}
                  size={176}
                  level="M"
                  aria-label="QR Code Pix"
                />
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center text-sm text-[#999]">
                QR indisponível
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-sm text-[#333]">
            <Clock className="h-4 w-4 text-[#666]" />
            Pague e será creditado na hora.
          </div>

          <div className="mt-3 flex items-start gap-2 rounded border-l-4 border-[#3483fa] bg-[#f0f0f0] p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3483fa]" />
            <p className="text-sm text-[#333]">
              Confirmaremos a data de entrega quando o pagamento for aprovado.
            </p>
          </div>

          <div className="my-4 border-t border-[#e0e0e0]" />

          {/* Copia e cola */}
          <h2 className="text-lg font-semibold text-[#333]">
            Ou copie este código para fazer o pagamento
          </h2>
          <p className="mt-1 text-sm text-[#666]">
            Escolha pagar via Pix pelo seu Internet Banking ou app de
            pagamentos. Depois, cole o seguinte código:
          </p>
          <div className="mt-3 break-all rounded-md border border-[#d0d0d0] p-3 text-sm text-[#666]">
            {pix.qrCode}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#3483fa] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2968c8]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Código copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copiar código
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#666]">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3483fa]" />
            Aguardando pagamento...
          </div>

          <div className="my-4 border-t border-[#e0e0e0]" />

          <button
            type="button"
            onClick={onAlreadyPaid}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#00a650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008a43]"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            Já paguei
          </button>
          <p className="mt-2 text-center text-xs text-[#999]">
            Clique após concluir o pagamento no seu app do banco.
          </p>
        </section>
      </main>
    </div>
  )
}

/* -------------------- Wrapper do fluxo -------------------- */
export function PixPaymentFlow({
  amount,
  productName,
  onBack,
  customer,
}: {
  amount: number
  productName: string
  onBack: () => void
  customer?: Customer
}) {
  const [step, setStep] = useState<"form" | "processing" | "pix" | "error">(
    customer ? "processing" : "form",
  )
  const [phase, setPhase] = useState(0)
  const submittedRef = useRef(false)
  const [pix, setPix] = useState<PixData | null>(null)
  const [approved, setApproved] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cicla as 3 frases enquanto está processando
  useEffect(() => {
    if (step !== "processing") return
    setPhase(0)
    const t1 = setTimeout(() => setPhase(1), 1500)
    const t2 = setTimeout(() => setPhase(2), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [step])

  const startPolling = useCallback((id: number | string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pix/status?id=${encodeURIComponent(String(id))}`)
        const data = await res.json()
        if (data.status === "approved") {
          setApproved(true)
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch {
        /* silencioso */
      }
    }, 4000)
  }, [])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  // Dispara a geração do Pix automaticamente quando os dados já vêm do checkout
  useEffect(() => {
    if (customer && !submittedRef.current) {
      submittedRef.current = true
      handleSubmit(customer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer])

  async function handleSubmit(customer: Customer) {
    setStep("processing")
    setErrorMsg("")
    const started = Date.now()
    const minDuration = 4500 // garante que as 3 frases apareçam

    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description: productName,
          customer,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao gerar o Pix.")
      }

      const elapsed = Date.now() - started
      if (elapsed < minDuration) {
        await new Promise((r) => setTimeout(r, minDuration - elapsed))
      }

      setPix(data as PixData)
      setStep("pix")
      startPolling((data as PixData).transactionId)
    } catch (err) {
      const elapsed = Date.now() - started
      if (elapsed < minDuration) {
        await new Promise((r) => setTimeout(r, minDuration - elapsed))
      }
      setErrorMsg((err as Error).message || "Erro ao gerar o Pix.")
      setStep("error")
    }
  }

  if (step === "processing") return <ProcessingScreen phase={phase} />

  if (step === "pix" && pix)
    return (
      <PixScreen
        pix={pix}
        amount={amount}
        approved={approved}
        onAlreadyPaid={() => {
          window.location.href = "/upsell"
        }}
      />
    )

  if (step === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#ebebeb] px-6 text-center">
        <h1 className="text-xl font-bold text-[#111] text-balance">
          Não foi possível gerar o Pix
        </h1>
        <p className="mt-2 max-w-xs text-sm text-[#666] text-pretty">{errorMsg}</p>
        <button
          type="button"
          onClick={() => setStep("form")}
          className="mt-6 rounded-md bg-[#3483fa] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2968c8]"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return <CustomerForm amount={amount} onBack={onBack} onSubmit={handleSubmit} />
}
