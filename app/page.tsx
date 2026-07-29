import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";

export const metadata: Metadata = {
  title: "Tirzepatida T.G. 15mg — 4 Ampolas",
  description:
    "Tirzepatida T.G. 15mg — caixa com 4 ampolas. Vendido por TGPHARMA.",
  openGraph: {
    title: "Tirzepatida T.G. 15mg — 4 Ampolas",
    description:
      "Tirzepatida T.G. 15mg — caixa com 4 ampolas. Vendido por TGPHARMA.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <ProductPage />;
}
