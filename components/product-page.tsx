"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Heart,
  Star,
  ChevronDown,
  ThumbsUp,
} from "lucide-react";

const images = [
  "/images/tg-8.png",
  "/images/tg-9.png",
  "/images/tg-10.png",
  "/images/tg-11.png",
];

type Review = {
  avatar: string;
  name: string;
  date: string;
  text: string;
  video?: { src: string; duration: string };
  photos?: string[];
  rating?: number;
};

const reviews: Review[] = [
  {
    avatar: "https://via.placeholder.com/40x40?text=R",
    name: "R**el M.",
    date: "24 junho 2026",
    text: "gente sou farmaceutico ha 12 anos e comprei MORRENDO de medo de ser falsificado kkk peguei a luz uv do laboratorio onde trabalho, mirei no rotulo e o holograma da T.G apareceu certinho.. ai relaxei. é produto original msm, lacre intacto, dosagem batendo. quem ta com medo igual eu tava, pode confiar. nao deixa passar essa, ta um precinho que daqui a pouco sobe 💙",
    photos: ["https://via.placeholder.com/300x300?text=Hologram+Check"],
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=J",
    name: "J**a P.",
    date: "24 junho 2026",
    text: "chorei qnd abri a caixa juro pra vcs. 4 anos lutando contra a balança, ja tinha tentado de tudo e nada.. qnd vi a caixinha chegar lacrada, isopor geladinho, as 4 ampolas com o lacre laranja, dosagem 15mg/0,5ml igualzinho prometido eu ja sabia q ia dar certo. e deu, -9kg em 6 semanas 😭 to mt feliz, vlw demais T.G ❤️ corre que ta acabando",
    photos: ["https://via.placeholder.com/300x300?text=Kit+Review"],
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=C",
    name: "C**os E.",
    date: "24 junho 2026",
    text: "filmei a abertura pq tava com o pé atras, da pra ver nas fotos.. caixa termica lacrada com gelo, qr code dentro com as instrucao, 4 ampolas perfeitas, lacre laranja sem mexer, temperatura certinha entre 2 e 8 graus como falaram. cara é coisa serio msm, ja to na 2 compra e indiquei pra minha irma. quem ainda ta pensando para de pensar pq esse preço NAO vai voltar",
    photos: ["https://via.placeholder.com/300x300?text=QR+Code"],
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=A",
    name: "A**a C.",
    date: "20 junho 2026",
    text: "gastei uma fortuna em tratamento importado, tava me sufocando.. cheguei a chorar no caixa da farmacia de raiva. qnd descobri a T.G.15 achei q era golpe de tao barato pra ser verdade. comprei TREMENDO, recebi lacrado, apliquei, e olha o resultado: -27kg em 3 meses (fotos ai embaixo) 🙌 me devolveu minha autoestima.. nao perde essa nao, é raro de achar",
    photos: ["https://via.placeholder.com/300x300?text=Before+After"],
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=T",
    name: "T**a M.",
    date: "23 junho 2026",
    text: "moro em BH e o pedido chegou no dia seguinte gente.. ainda geladinho, com gelo reciclavel e isopor lacrado. ja tinha levado golpe de 300 reais em outra loja, fiquei emocionada de ver empresa serio de vdd. eles cuidam do envio como se fosse pra familia deles, pode confiar de olho fechado",
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=F",
    name: "F**a S.",
    date: "22 junho 2026",
    text: "caixa lacrada, qr code dentro, escaneei pelo celular e veio TUDO: bula, modo de uso, como conservar, contato do sac, nota fiscal no email.. gente isso aqui é nivel farmacia premium, nao é loja de instagram de fundo de quintal nao. CNPJ ativo, conferi. comprem tranquilas é coisa serio",
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=L",
    name: "L**s F.",
    date: "21 junho 2026",
    text: "to no terceiro frasco e preciso desabafar: -7kg SEM dieta maluca, SEM passar fome, SEM academia. comparei o lacre e o liquido com a foto do fabricante e é igualzinho. eu ja tinha desistido de mim, achava q ia morrer obeso de verdade. hoje minha esposa me olha diferente, meus filhos brincam comigo no parque sem eu cansar.. nao tem preço. se vc ta lendo isso e em duvida, COMPRA. vc merece",
  },
  {
    avatar: "https://via.placeholder.com/40x40?text=M",
    name: "M**os R.",
    date: "18 junho 2026",
    text: "levei a ampola pro meu endocrino conferir antes de aplicar (de tanto medo de golpe kkk).. ele olhou o lacre, leu o rotulo, conferiu a dosagem e falou: pode usar tranquilo, é serio. -8kg em 6 semanas, pressao normalizou, parei de roncar e minha esposa voltou a dormir comigo no msm quarto 😂 obrigado de coração",
  },
];

const REVIEWS_PER_PAGE = 4;
const TOTAL_REVIEW_PAGES = 6;

export function ProductPage() {
  const [selected, setSelected] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const pageReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#ebebeb] text-[#333]">
      {/* Header */}
      <header className="bg-[#FFE600]">
        <div className="mx-auto max-w-[1200px] px-3 pt-2 sm:px-4 sm:pt-3">
          {/* Top row: logo + search + banner */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#" aria-label="Mercado Livre" className="shrink-0">
              <img
                src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.130/mercadolibre/logo__large_plus.png"
                alt="Mercado Livre"
                className="h-8 w-auto sm:h-12"
              />
            </a>
            <form className="flex min-w-0 flex-1 items-center rounded-sm bg-white px-3 py-2 shadow-sm">
              <input
                type="text"
                defaultValue="cuba de apoio"
                placeholder="Buscar…"
                className="min-w-0 flex-1 text-sm outline-none"
              />
              <button type="submit" aria-label="Buscar" className="shrink-0">
                <Search className="h-5 w-5 text-[#999]" />
              </button>
            </form>
            <a
              href="#"
              className="hidden shrink-0 md:block"
              aria-label="MELI+ Plano Mega"
            >
              <img
                src="https://http2.mlstatic.com/D_NQ_683315-MLA114724236441_072026-OO.webp"
                alt="MELI+ | PLANO MEGA"
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Bottom row: location + menu + user/cart */}
          <div className="mt-2 flex items-center justify-between pb-2 text-xs text-[#333]">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <div className="leading-tight">
                <div className="text-[#666]">Enviar para</div>
                <div className="font-semibold">Maceió 57020670</div>
              </div>
            </div>
            <nav className="hidden items-center gap-5 md:flex">
              <a href="#" className="hover:text-[#3483fa]">Categorias</a>
              <a href="#" className="hover:text-[#3483fa]">Ofertas</a>
              <a href="#" className="hover:text-[#3483fa]">Cupons</a>
              <a href="#" className="hover:text-[#3483fa]">Supermercado</a>
              <a href="#" className="hover:text-[#3483fa]">Moda</a>
              <a href="#" className="hover:text-[#3483fa]">
                Mercado Play
                <span className="ml-1 rounded bg-[#00a650] px-1 py-0.5 text-[10px] font-semibold text-white">
                  Grátis
                </span>
              </a>
              <a href="#" className="hover:text-[#3483fa]">Vender</a>
              <a href="#" className="hover:text-[#3483fa]">Contato</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="#" className="hidden hover:text-[#3483fa] md:inline">Crie a sua conta</a>
              <a href="#" className="hidden hover:text-[#3483fa] md:inline">Entre</a>
              <a href="#" className="hidden hover:text-[#3483fa] md:inline">Compras</a>
              <Menu className="h-6 w-6 md:hidden" />
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-4 py-3 text-xs text-[#3483fa]">
        <span>Casa, Móveis e Decoração</span>
        <ChevronRight className="mx-1 inline h-3 w-3 text-[#999]" />
        <span>Banheiros</span>
        <ChevronRight className="mx-1 inline h-3 w-3 text-[#999]" />
        <span className="text-[#666]">Cubas</span>
      </div>

      {/* Main product */}
      <main className="mx-auto max-w-[1200px] px-2 pb-10 sm:px-4">
        <div className="rounded-md bg-white p-3 shadow-sm sm:p-6">
          <div className="grid gap-6 md:grid-cols-[80px_1fr_360px]">
            {/* Thumbs */}
            <div className="order-2 flex gap-2 md:order-1 md:flex-col">
              {images.map((src, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => setSelected(i)}
                  className={`h-14 w-14 overflow-hidden rounded border-2 ${
                    selected === i ? "border-[#3483fa]" : "border-[#e0e0e0]"
                  }`}
                >
                  <img src={src} alt={`Miniatura ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 md:order-2">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-white">
                <img
                  src={images[selected]}
                  alt="Tirzepatida T.G. 15mg — 4 Ampolas"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="mb-2 text-lg font-semibold text-[#333]">
                  Sobre este produto
                </h2>
                <p className="mb-4 font-semibold text-[#333]">
                  Tirzepatida T.G. 15mg — Ampola Lacrada
                </p>
                <div className="space-y-3 text-sm leading-relaxed text-[#333]">
                  <p>
                    A Tirzepatida é o princípio ativo revolucionário presente no Mounjaro® da Eli Lilly. É um agonista duplo dos receptores GIP e GLP-1, aprovado para tratamento de diabetes tipo 2 e auxiliar na perda de peso. Estudos mostram redução de até 22% do peso corporal em tratamento contínuo.
                  </p>
                  <p>
                    A T.G. Farmacêutica fabrica a Tirzepatida com o mesmo princípio ativo do Mounjaro® original, garantindo a mesma eficácia comprovada por uma fração do preço. Todas as ampolas são 100% lacradas de fábrica.
                  </p>
                  <ul className="space-y-2">
                    <li>• Mesmo princípio ativo aprovado pela FDA</li>
                    <li>• Redução do apetite e saciedade prolongada</li>
                    <li>• Ampola 100% lacrada de fábrica</li>
                    <li>• Entrega refrigerada com embalagem térmica</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buy box */}
            <aside className="order-3 space-y-4">
              <div className="text-xs text-[#666]">Novo | 8.742 vendidos</div>
              <h1 className="text-base font-semibold leading-tight text-[#333] sm:text-xl">
                Tirzepatida T.G. 15mg — 4 Ampolas
              </h1>
              <div className="space-y-1 text-xs text-[#666]">
                <div>
                  Vendido por <a href="#" className="text-[#3483fa]">TGPHARMA</a>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[#3483fa]">5</span>
                  <span className="text-[#3483fa]">★</span>
                  <span>(10.247)</span>
                  <span className="text-[#999]">|</span>
                  <span>8.742 vendidos</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-[#999] line-through">R$ 221,82</div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-light text-[#333]">
                    R$ <span className="font-normal">159</span>
                    <span className="align-top text-lg">,90</span>
                  </div>
                  <span className="text-sm text-[#00a650]">27% OFF</span>
                </div>
                <div className="text-sm text-[#00a650]">em 12x R$ 15,80 sem juros</div>
                <a href="#" className="text-xs text-[#3483fa]">
                  Ver os meios de pagamento
                </a>
              </div>

              <div className="text-sm text-[#333]">Cor: <span className="font-semibold">Branco</span></div>

              {/* Shipping section */}
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-[#00a650] px-3 py-1 text-xs font-semibold text-white">
                  FRETE GRÁTIS ACIMA DE R$ 19
                </span>
                <div className="space-y-2 text-sm">
                  <div>
                    <div>
                      <span className="font-semibold text-[#00a650]">Chegará grátis entre amanhã e terça-feira</span>
                      <span className="text-[#333]"> por ser sua </span>
                      <span className="text-[#333]">primeira compra</span>
                    </div>
                    <button type="button" className="mt-1 text-sm text-[#3483fa]">
                      Mais detalhes e formas de entrega
                    </button>
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-[#00a650]">Retire grátis</span>
                      <span className="text-[#333]"> entre amanhã e terça-feira em uma agência Mercado Livre</span>
                    </div>
                    <a href="#" className="text-xs text-[#3483fa]">Ver no mapa</a>
                  </div>
                </div>
              </div>

              {/* Stock + Full */}
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#333]">Estoque disponível</div>
                <div className="flex items-center gap-1 text-xs text-[#666]">
                  <span>Armazenado e enviado pelo</span>
                  <span className="rounded bg-[#00a650] px-1.5 py-0.5 text-[10px] font-bold italic text-white">
                    full
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Quantidade:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="rounded border border-[#e0e0e0] px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} unidade{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#666]">(+50 disponíveis)</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full rounded bg-[#3483fa] py-3 text-sm font-semibold text-white hover:bg-[#2968c8]">
                  Comprar agora
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded bg-[#e3edfb] py-3 text-sm font-semibold text-[#3483fa] hover:bg-[#d0e0f7]">
                  <ShoppingCart className="h-4 w-4" />
                  Adicionar ao carrinho
                </button>
              </div>

              {/* Seller summary */}
              <div className="flex items-center gap-3 border-t pt-4">
                <img
                  src="https://pharmabrasiltg.shop/__l5e/assets-v1/2d9c2555-11eb-4f7b-bb64-82fcf7d2fc68/tg15-logo.webp"
                  alt="T.G.15 Farmacêutica"
                  className="h-12 w-12 rounded object-contain"
                />
                <div className="text-xs">
                  <div className="text-[#666]">Vendido por</div>
                  <a href="#" className="font-semibold text-[#3483fa]">T.G Farmacêutica</a>
                  <div className="font-semibold text-[#333]">Loja oficial</div>
                  <div className="text-[#666]">8.742 vendas</div>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-2 text-sm text-[#666]">
                <li className="flex items-start gap-2">
                  <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <a href="#" className="text-[#3483fa]">Devolução grátis.</a>
                    <span> Você tem 30 dias a partir da data de recebimento.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <a href="#" className="text-[#3483fa]">Compra Garantida</a>
                    <span>. Receba o produto que está esperando ou devolvemos o dinheiro.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>3 anos de garantia de fábrica.</span>
                </li>
              </ul>

              <button className="flex items-center gap-2 text-sm text-[#3483fa]">
                <Heart className="h-4 w-4" /> Adicionar aos favoritos
              </button>

              {/* Meios de pagamento */}
              <div className="mt-4 rounded-md border border-[#e0e0e0] bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-base font-semibold text-[#333]">Meios de pagamento</h2>

                <p className="text-sm font-semibold text-[#333]">Linha de Crédito</p>
                <div className="mt-2 mb-3">
                  <img
                    src="https://http2.mlstatic.com/storage/logos-api-admin/f3e8e940-f549-11ef-bad6-e9962bcd76e5-m.svg"
                    alt="Mercado Crédito"
                    className="h-8"
                  />
                </div>

                <p className="text-sm font-semibold text-[#333]">Cartões de crédito</p>
                <p className="text-xs text-[#666]">Pague em até 12x!</p>
                <div className="mt-2 mb-3 flex flex-wrap items-center gap-2">
                  <img src="https://http2.mlstatic.com/storage/logos-api-admin/b2c93a40-f3be-11eb-9984-b7076edb0bb7-m.svg" alt="American Express" className="h-8" />
                  <img src="https://http2.mlstatic.com/storage/logos-api-admin/bb7c7bb0-adec-11f0-92e6-59fb0bcb38c2-m.svg" alt="Elo" className="h-8" />
                  <img src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" alt="Visa" className="h-8" />
                  <img src="https://http2.mlstatic.com/storage/logos-api-admin/9cf818e0-723a-11f0-a459-cf21d0937aeb-m.svg" alt="Mastercard" className="h-8" />
                </div>

                <p className="text-sm font-semibold text-[#333]">Pix</p>
                <div className="mt-2 mb-3">
                  <img
                    src="https://http2.mlstatic.com/storage/logos-api-admin/f99fcca0-f3bd-11eb-9984-b7076edb0bb7-m.svg"
                    alt="Pix"
                    className="h-8"
                  />
                </div>

                <p className="text-sm font-semibold text-[#333]">Boleto bancário</p>
                <div className="mt-2 mb-3">
                  <img
                    src="https://http2.mlstatic.com/storage/logos-api-admin/00174300-571e-11e8-8364-bff51f08d440-m.svg"
                    alt="Boleto"
                    className="h-8"
                  />
                </div>

                <a href="#" className="text-sm text-[#3483fa]">
                  Confira outros meios de pagamento
                </a>
              </div>
            </aside>
          </div>
        </div>

        {/* Features */}
        <section className="mt-4 rounded-md bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Características principais</h2>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            {[
              ["Princípio Ativo", "Tirzepatida"],
              ["Dosagem", "15 mg / 0,5 mL"],
              ["Tipo", "Ampola injetável"],
              ["Condição", "100% Lacrado de fábrica"],
              ["Armazenamento", "Refrigerado (2°C a 8°C)"],
              ["Envio", "Entrega refrigerada"],
              ["Equivalente", "Mounjaro® (Eli Lilly)"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b py-2">
                <span className="text-[#666]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="mt-4 rounded-md bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Descrição</h2>
          <div className="space-y-3 text-sm leading-relaxed text-[#333]">
            <p>
              A TG - Tirzepatida combina qualidade, praticidade e apresentação premium, sendo disponibilizada em embalagem segura e desenvolvida para preservar a integridade do produto durante o armazenamento.
            </p>
            <p>
              Produto lacrado de fábrica, identificado com lote e validade, garantindo maior segurança e rastreabilidade. Disponível em diferentes concentrações para atender às necessidades de cada aplicação.
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Embalagem premium</li>
              <li>Produto lacrado de fábrica</li>
              <li>Fácil armazenamento</li>
              <li>Identificação de lote e validade</li>
              <li>Garantia de qualidade</li>
            </ul>
          </div>
        </section>

        {/* Perguntas e respostas */}
        <section className="mt-4 rounded-md bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-1 text-lg font-semibold">Perguntas e respostas</h2>
          <p className="mb-4 text-sm text-[#666]">6 perguntas</p>
          <div className="space-y-3 text-sm">
            {[
              {
                q: "O produto é original e tem registro? Como tenho certeza que não é falsificado?",
                a: "Sim. Cada caixa é lacrada e acompanha QR Code de autenticidade impresso na lateral — ao escanear, você confere número de lote, validade e procedência direto no site do laboratório. Enviamos também a Nota Fiscal eletrônica em nome do comprador junto com o produto.",
                by: "Resposta oficial T.G Farma",
                official: true,
                useful: 312,
              },
              {
                q: "Em quanto tempo começo a ver resultado e quantos kg posso esperar perder?",
                a: "A maioria dos nossos clientes relata redução do apetite já nos primeiros 3 a 5 dias. A perda de peso média acompanhada é de 4 a 8kg no primeiro mês e 12 a 18kg ao final do tratamento de 3 meses, sem dietas restritivas. Os resultados variam conforme metabolismo, alimentação e rotina.",
                by: "Camila R. · Compra verificada · Recife/PE",
                official: false,
                useful: 287,
              },
              {
                q: "Como faço a aplicação? Preciso de receita médica ou enfermeiro?",
                a: "A aplicação é subcutânea, 1x por semana, na barriga ou coxa, com a caneta/agulha que já vem no kit (você faz em casa, leva 10 segundos e praticamente não dói). Acompanha manual passo a passo ilustrado e suporte por WhatsApp com nossa farmacêutica responsável. A venda é livre, sem necessidade de receita.",
                by: "Resposta oficial T.G Farma",
                official: true,
                useful: 241,
              },
              {
                q: "Como o produto chega? Vem refrigerado e a embalagem é discreta?",
                a: "Sim. Enviamos em embalagem térmica com gelo reciclável que mantém o produto entre 2°C e 8°C por até 72h. A caixa externa é 100% neutra, sem logo, sem nome do produto e sem identificação do conteúdo — ninguém saberá o que está dentro. Envio via Sedex com código de rastreio.",
                by: "Rafael M. · Compra verificada · São Paulo/SP",
                official: false,
                useful: 198,
              },
              {
                q: "Tem efeitos colaterais? E se eu não me adaptar, posso devolver?",
                a: "Nos primeiros dias pode haver leve enjoo ou redução intensa do apetite — sintomas passageiros e comuns nessa classe de medicamento. Caso você não se adapte ou o produto chegue fora da temperatura, oferecemos reembolso 100% garantido em até 7 dias, conforme o Código de Defesa do Consumidor.",
                by: "Resposta oficial T.G Farma",
                official: true,
                useful: 176,
              },
              {
                q: "O pagamento é seguro? Vocês têm CNPJ e atendimento se eu precisar?",
                a: "Pagamento 100% seguro via PIX processado por gateway certificado (mesmo padrão dos grandes bancos). Somos empresa registrada (T.G Farma — CNPJ ativo), com nota RA1000 no Reclame Aqui e atendimento humano por WhatsApp de segunda a sábado, das 8h às 20h. Seus dados nunca são compartilhados.",
                by: "Resposta oficial T.G Farma",
                official: true,
                useful: 164,
              },
            ].map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-md border ${isOpen ? "border-[#333]" : "border-[#e0e0e0]"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left sm:px-4"
                    aria-expanded={isOpen}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#333] text-xs font-bold text-white">
                      P
                    </span>
                    <span className="flex-1 font-semibold text-[#333]">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#333] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-4 sm:px-4">
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e94b4b] text-xs font-bold text-white">
                          R
                        </span>
                        <p className="text-[#333]">{item.a}</p>
                      </div>
                      <div className="mt-3 ml-9 flex items-center gap-1 text-xs text-[#666]">
                        {item.official && (
                          <ShieldCheck className="h-4 w-4 text-[#3483fa]" />
                        )}
                        <span>{item.by}</span>
                        <span>·</span>
                        <span>{item.useful} acharam útil</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-4 rounded-md bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-end justify-between">
            <h2 className="text-base font-semibold sm:text-lg">Opiniões do produto</h2>
            <button type="button" className="text-xs text-[#3483fa]">
              Ver tudo ›
            </button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-2xl font-bold">4.9</span>
            <div className="flex text-[#f9a825]">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-[#666]">· 10.247 avaliações</span>
          </div>

          {/* Filters */}
          <div className="mt-3 -mx-4 overflow-x-auto px-4">
            <div className="flex gap-2 whitespace-nowrap">
              {[
                { label: "Todas (24)", active: true },
                { label: "Com fotos (8)" },
                { label: "5★ (22)" },
                { label: "4★ (2)" },
              ].map((f) => (
                <button
                  key={f.label}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    f.active
                      ? "border-[#3483fa] bg-[#3483fa]/10 font-medium text-[#3483fa]"
                      : "border-[#e0e0e0] text-[#666] hover:border-[#999]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="mt-4 space-y-4">
            {pageReviews.map((review, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0">
                <div className="flex gap-3">
                  <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full" />
                  <div className="flex-1 text-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-[#333]">{review.name}</div>
                        <div className="text-xs text-[#666]">{review.date}</div>
                      </div>
                      {review.rating && (
                        <div className="flex gap-0.5 text-[#f9a825]">
                          {Array(review.rating).fill(0).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-[#333]">{review.text}</p>
                    {review.photos && (
                      <div className="mt-2 flex gap-2">
                        {review.photos.map((p, j) => (
                          <img key={j} src={p} alt={`Foto ${j + 1}`} className="h-20 w-20 rounded border object-cover" />
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#666]">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Útil</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setReviewPage(p => Math.max(1, p - 1))}
              disabled={reviewPage === 1}
              className="flex items-center gap-1 text-sm text-[#3483fa] hover:text-[#2968c8] disabled:text-[#ccc]"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-xs text-[#666]">
              Página {reviewPage} de {TOTAL_REVIEW_PAGES}
            </span>
            <button
              onClick={() => setReviewPage(p => Math.min(TOTAL_REVIEW_PAGES, p + 1))}
              disabled={reviewPage === TOTAL_REVIEW_PAGES}
              className="flex items-center gap-1 text-sm text-[#3483fa] hover:text-[#2968c8] disabled:text-[#ccc]"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
