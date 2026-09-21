import type { Metadata } from "next"
import { OrderTracking } from "@/components/order-tracking"

export const metadata: Metadata = {
  title: "Rastreamento do pedido — Tirzepatida T.G.",
  description:
    "Acompanhe todas as atualizações da entrega do seu pedido de Tirzepatida T.G.",
}

export default function Page() {
  return <OrderTracking />
}
