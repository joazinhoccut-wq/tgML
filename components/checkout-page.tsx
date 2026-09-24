"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Zap, Ticket } from "lucide-react";

type Combo = {
  id: number;
  label: string;
  price: number;
  original: number;
  off: number;
  image: string;
  best?: boolean;
};

type SavedAddress = {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
} | null;

type Customer = {
  name: string;
  email: string;
  document: string;
  phone: string;
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function maskCpf(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function PreparingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-2xl font-bold text-[#111] text-balance">
        Preparando tudo para sua compra
      </h1>
      <div
        className="mt-8 h-12 w-12 animate-spin rounded-full border-4 border-[#3483fa]/20 border-t-[#3483fa]"
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
}

export function CheckoutPage({
  combo,
  productName,
  savedAddress,
  onBack,
  onEditAddress,
  onPay,
}: {
  combo: Combo;
  productName: string;
  savedAddress: SavedAddress;
  onBack: () => void;
  onEditAddress: () => void;
  onPay: (customer: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productValue = combo.original;
  const discount = combo.original - combo.price;
  const freteOriginal = 34.9;
  const total = combo.price;
  const pixSave = Math.round(combo.price * 0.06 * 100) / 100;

  function handlePay() {
    const next: Record<string, string> = {};
    if (!savedAddress)
      next.address = "Informe seu endereço de entrega para continuar.";
    if (name.trim().split(" ").filter(Boolean).length < 2)
      next.name = "Informe seu nome completo.";
    if (document.replace(/\D/g, "").length !== 11) next.document = "CPF inválido.";
    if (!isValidEmail(email)) next.email = "Informe um e-mail válido.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Telefone inválido.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.address) {
        onEditAddress();
        return;
      }
      const firstError = window.document.querySelector(
        "[data-checkout-error='true']",
      );
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onPay({ name: name.trim(), email: email.trim(), document, phone });
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] pb-28 text-[#333]">
      {/* Header amarelo */}
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
          <h1 className="text-xl font-semibold text-[#111]">
            Finalize sua compra
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[600px] px-3 py-3">
        {/* Banner promocional Mega Promo de Setembro */}
        <section className="overflow-hidden rounded-lg shadow-sm">
          <img
            src="/banner-dia-dos-pais.png"
            alt="Mega Promo de Setembro - Aproveite a oferta, até 85% OFF. Compra segura, devolução garantida e entrega rápida."
            className="w-full object-cover"
          />
        </section>

        {/* Resumo do produto */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-[#e0e0e0] bg-white">
              <img
                src={combo.image || "/placeholder.svg"}
                alt={productName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-sm font-medium leading-snug text-[#333]">
              {productName} — {combo.label}
            </p>
          </div>
        </section>

        {/* Forma de entrega */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">Forma de entrega</h2>

          {/* Card de endereço */}
          <button
            type="button"
            onClick={onEditAddress}
            data-checkout-error={
              errors.address && !savedAddress ? "true" : undefined
            }
            className={`mt-3 flex w-full items-start gap-2 rounded-lg border px-4 py-3 text-left ${
              errors.address && !savedAddress
                ? "border-[#e6394a]"
                : "border-[#3483fa]"
            }`}
          >
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#3483fa]" />
            <div className="min-w-0">
              {savedAddress ? (
                <>
                  <div className="text-sm font-medium text-[#333]">
                    {savedAddress.logradouro}, {savedAddress.numero}
                    {savedAddress.complemento
                      ? ` - ${savedAddress.complemento}`
                      : ""}{" "}
                    - CEP {savedAddress.cep}
                  </div>
                  <div className="text-xs text-[#666]">
                    {savedAddress.bairro ? `${savedAddress.bairro} · ` : ""}
                    {savedAddress.cidade}/{savedAddress.uf}
                  </div>
                  <span className="mt-1 inline-block text-sm font-medium text-[#3483fa]">
                    Alterar endereço
                  </span>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-[#333]">
                    Informe seu endereço de entrega
                  </div>
                  <span className="mt-1 inline-block text-sm font-medium text-[#3483fa]">
                    Adicionar endereço
                  </span>
                </>
              )}
            </div>
          </button>
          {errors.address && !savedAddress ? (
            <p className="mt-1 text-xs text-[#e6394a]">{errors.address}</p>
          ) : null}

          {/* Envio Full */}
          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#333]">Envio 1</span>
              <Zap className="h-3.5 w-3.5 fill-[#00a650] text-[#00a650]" />
              <span className="text-xs font-bold italic text-[#00a650]">
                FULL
              </span>
            </div>
            <div className="mt-2 space-y-3">
              <label className="flex cursor-pointer items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="entrega"
                    checked
                    readOnly
                    className="mt-0.5 h-4 w-4 accent-[#3483fa]"
                  />
                  <span className="text-sm">
                    <span className="font-semibold text-[#00a650]">
                      Chegará rápido
                    </span>{" "}
                    <span className="text-[#333]">amanhã</span>
                  </span>
                </div>
                <span className="whitespace-nowrap text-sm">
                  <span className="text-[#999] line-through">
                    R$ {formatBRL(freteOriginal)}
                  </span>{" "}
                  <span className="font-semibold text-[#00a650]">Grátis</span>
                </span>
              </label>
            </div>
          </div>

          {/* Dados do destinatário / pagador */}
          <div className="mt-5 border-t border-[#e0e0e0] pt-4">
            <h3 className="text-sm font-semibold text-[#333]">
              Dados do destinatário
            </h3>
            <p className="mt-0.5 text-xs text-[#666]">
              Usaremos esses dados para gerar seu pagamento via Pix.
            </p>

            <div className="mt-3 space-y-3">
              <CheckoutField label="Nome completo" error={errors.name}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como no seu documento"
                  autoComplete="name"
                  className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#3483fa]"
                />
              </CheckoutField>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CheckoutField label="CPF" error={errors.document}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={document}
                    onChange={(e) => setDocument(maskCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#3483fa]"
                  />
                </CheckoutField>

                <CheckoutField label="Telefone com DDD" error={errors.phone}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#3483fa]"
                  />
                </CheckoutField>
              </div>

              <CheckoutField label="E-mail" error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full rounded-md border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#3483fa]"
                />
              </CheckoutField>
            </div>
          </div>
        </section>

        {/* Meios de pagamento */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">
            Meios de pagamento
          </h2>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="pagamento"
              defaultChecked
              className="h-4 w-4 accent-[#3483fa]"
            />
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e0e0e0]">
              <img
                src="https://logospng.org/download/pix/logo-pix-icone-1024.png"
                alt="Pix"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span>
              <span className="inline-block rounded bg-[#111] px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                Pague menos
              </span>
              <span className="mt-1 block text-sm font-medium text-[#333]">
                Pix
              </span>
              <span className="mt-1 inline-block rounded bg-[#e8f8ee] px-2 py-0.5 text-xs font-medium text-[#00a650]">
                Economize até R$ {formatBRL(pixSave)}
              </span>
            </span>
          </label>
        </section>

        {/* Resumo da compra */}
        <section className="mt-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333]">
            Resumo da compra
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[#333]">Produto</dt>
              <dd className="text-[#333]">R$ {formatBRL(productValue)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#333]">Desconto do produto</dt>
              <dd className="text-[#00a650]">- R$ {formatBRL(discount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#333]">Frete</dt>
              <dd className="whitespace-nowrap">
                <span className="text-[#999] line-through">
                  R$ {formatBRL(freteOriginal)}
                </span>{" "}
                <span className="font-semibold text-[#00a650]">Grátis</span>
              </dd>
            </div>
          </dl>
          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#3483fa]"
          >
            <Ticket className="h-4 w-4" />
            Inserir código do cupom
          </button>
          <div className="mt-3 flex items-end justify-between border-t border-[#e0e0e0] pt-3">
            <span className="text-lg font-semibold text-[#333]">Total</span>
            <span className="text-right">
              <span className="mr-1 text-sm text-[#999] line-through">
                R$ {formatBRL(productValue + freteOriginal)}
              </span>
              <span className="text-xl font-bold text-[#333]">
                R$ {formatBRL(total)}
              </span>
            </span>
          </div>
          <div className="mt-1 text-right text-xs text-[#00a650]">
            Você economizou R$ {formatBRL(discount + freteOriginal)} · Frete
            grátis
          </div>
        </section>
      </main>

      {/* Barra fixa inferior */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e0e0e0] bg-white">
        <div className="mx-auto flex max-w-[600px] items-center justify-between gap-3 px-4 py-3">
          <div className="leading-tight">
            <div className="text-xs text-[#999] line-through">
              R$ {formatBRL(productValue + freteOriginal)}
            </div>
            <div className="text-xl font-bold text-[#333]">
              R$ {formatBRL(total)}
            </div>
            <div className="text-xs text-[#00a650]">
              Você economizou R$ {formatBRL(discount + freteOriginal)}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePay}
            className="shrink-0 rounded-md bg-[#3483fa] px-8 py-3 text-sm font-semibold text-white hover:bg-[#2968c8]"
          >
            Pagar e finalizar
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-checkout-error={error ? "true" : undefined}>
      <label className="mb-1 block text-sm font-medium text-[#333]">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-[#e6394a]">{error}</p> : null}
    </div>
  );
}
