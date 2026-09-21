// Armazenamento leve do pedido em sessionStorage, compartilhado entre o
// checkout, o upsell e a página de rastreio. Mantém os mesmos dados que o
// cliente já informou para que o rastreio reflita a compra real.

export type OrderCustomer = {
  name: string
  email: string
  document: string
  phone: string
}

export type OrderAddress = {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  cep: string
}

export type OrderItem = {
  name: string
  value: number
}

export type StoredOrder = {
  code: string
  tracking: string
  purchaseDate: string // ISO
  items: OrderItem[]
}

const CUSTOMER_KEY = "upsell:customer"
const ADDRESS_KEY = "upsell:address"
const ORDER_KEY = "upsell:order"

// Marca o item do upsell para evitar duplicidade ao adicionar.
export const UPSELL_ITEM_NAME = "Ampola adicional (oferta exclusiva)"

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function randomDigits(length: number) {
  let out = ""
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}

export function readCustomer(): OrderCustomer | null {
  if (typeof window === "undefined") return null
  return safeParse<OrderCustomer>(sessionStorage.getItem(CUSTOMER_KEY))
}

export function readAddress(): OrderAddress | null {
  if (typeof window === "undefined") return null
  return safeParse<OrderAddress>(sessionStorage.getItem(ADDRESS_KEY))
}

export function readOrder(): StoredOrder | null {
  if (typeof window === "undefined") return null
  return safeParse<StoredOrder>(sessionStorage.getItem(ORDER_KEY))
}

function writeOrder(order: StoredOrder) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order))
  } catch {
    /* ambiente sem sessionStorage — ignora */
  }
}

// Cria o pedido com o item principal caso ainda não exista; se já existir,
// mantém o pedido atual (não sobrescreve o código nem a data).
export function ensureOrder(firstItem: OrderItem): StoredOrder {
  const existing = readOrder()
  if (existing) return existing
  const order: StoredOrder = {
    code: `TG-${randomDigits(6)}`,
    tracking: `BR${randomDigits(9)}TG`,
    purchaseDate: new Date().toISOString(),
    items: [firstItem],
  }
  writeOrder(order)
  return order
}

// Adiciona um item ao pedido de forma idempotente (por nome do item).
export function addOrderItem(item: OrderItem): StoredOrder | null {
  const order = readOrder()
  if (!order) return null
  if (order.items.some((i) => i.name === item.name)) return order
  const next: StoredOrder = { ...order, items: [...order.items, item] }
  writeOrder(next)
  return next
}

export function orderTotal(order: StoredOrder): number {
  return order.items.reduce((sum, i) => sum + i.value, 0)
}
