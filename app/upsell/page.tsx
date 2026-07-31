import type { Metadata } from "next";
import { UpsellPage } from "@/components/upsell-page";

export const metadata: Metadata = {
  title: "Oferta exclusiva — +1 Ampola por R$47,90",
  description:
    "Adicione mais 1 ampola de Tirzepatida T.G. ao seu pedido por um valor exclusivo desta etapa.",
};

export default function Page() {
  return <UpsellPage />;
}
