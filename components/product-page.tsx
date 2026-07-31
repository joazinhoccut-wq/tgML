"use client";

import { useState } from "react";
import { CheckoutPage, PreparingScreen } from "./checkout-page";
import { PixPaymentFlow } from "./pix-payment-flow";
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
  Camera,
  Globe,
  Play,
  Mail,
  Smartphone,
  BadgeCheck,
} from "lucide-react";

const images = [
  "/images/tg-8.png",
  "/images/tg-9.png",
  "/images/tg-10.png",
  "/images/tg-11.png",
];

type Combo = {
  id: number;
  label: string;
  price: number;
  original: number;
  off: number;
  image: string;
  best?: boolean;
};

const combos: Combo[] = [
  { id: 1, label: "1 Ampola", price: 0.97, original: 397, off: 75, image: "/images/tg-11.png" },
  { id: 2, label: "2 Ampolas", price: 1.47, original: 797, off: 82, image: "/images/tg-9.png" },
  { id: 4, label: "4 Ampolas", price: 1.97, original: 1197, off: 84, image: "/images/tg-8.png", best: true },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type Review = {
  avatar: string;
  name: string;
  date: string;
  text: string;
  videos?: string[];
  photos?: string[];
  rating?: number;
};

const reviews: Review[] = [
  {
    avatar: "/reviews/rafael.webp",
    name: "R**el M.",
    date: "24 junho 2026",
    rating: 5,
    text: "gente sou farmaceutico ha 12 anos e comprei MORRENDO de medo de ser falsificado kkk peguei a luz uv do laboratorio onde trabalho, mirei no rotulo e o holograma da T.G apareceu certinho.. ai relaxei. é produto original msm, lacre intacto, dosagem batendo. quem ta com medo igual eu tava, pode confiar. nao deixa passar essa, ta um precinho que daqui a pouco sobe 💙",
    videos: ["/reviews/rafael-uv-video.mp4"],
    photos: ["/reviews/uv-holograma.webp"],
  },
  {
    avatar: "/reviews/julia.webp",
    name: "J**a P.",
    date: "24 junho 2026",
    rating: 5,
    text: "chorei qnd abri a caixa juro pra vcs. 4 anos lutando contra a balança, ja tinha tentado de tudo e nada.. qnd vi a caixinha chegar lacrada, isopor geladinho, as 4 ampolas com o lacre laranja, dosagem 15mg/0,5ml igualzinho prometido eu ja sabia q ia dar certo. e deu, -9kg em 6 semanas 😭 to mt feliz, vlw demais T.G ❤️ corre que ta acabando",
    videos: ["/reviews/julia-video.mp4"],
    photos: ["/reviews/julia-kit.png"],
  },
  {
    avatar: "/reviews/carlos.webp",
    name: "C**os E.",
    date: "24 junho 2026",
    rating: 5,
    text: "filmei a abertura pq tava com o pé atras, da pra ver nas fotos.. caixa termica lacrada com gelo, qr code dentro com as instrucao, 4 ampolas perfeitas, lacre laranja sem mexer, temperatura certinha entre 2 e 8 graus como falaram. cara é coisa serio msm, ja to na 2 compra e indiquei pra minha irma. quem ainda ta pensando para de pensar pq esse preço NAO vai voltar",
    photos: [
      "/reviews/carlos-qr-isopor.png",
      "/reviews/carlos-caixa-aberta.png",
      "/reviews/carlos-4ampolas-topo.png",
    ],
  },
  {
    avatar: "/reviews/ana.webp",
    name: "A**a C.",
    date: "20 junho 2026",
    rating: 5,
    text: "gastei uma fortuna em tratamento importado, tava me sufocando.. cheguei a chorar no caixa da farmacia de raiva. qnd descobri a T.G.15 achei q era golpe de tao barato pra ser verdade. comprei TREMENDO, recebi lacrado, apliquei, e olha o resultado: -27kg em 3 meses (fotos ai embaixo) 🙌 me devolveu minha autoestima.. nao perde essa nao, é raro de achar",
    photos: ["/reviews/ana-antes-depois.webp"],
  },
  {
    avatar: "/reviews/tania.webp",
    name: "T**a M.",
    date: "23 junho 2026",
    rating: 5,
    text: "moro em BH e o pedido chegou no dia seguinte gente.. ainda geladinho, com gelo reciclavel e isopor lacrado. ja tinha levado golpe de 300 reais em outra loja, fiquei emocionada de ver empresa serio de vdd. eles cuidam do envio como se fosse pra familia deles, pode confiar de olho fechado",
    photos: ["/reviews/tania-isopor-gelo.webp"],
  },
  {
    avatar: "/reviews/fernanda.webp",
    name: "F**a S.",
    date: "22 junho 2026",
    rating: 5,
    text: "caixa lacrada, qr code dentro, escaneei pelo celular e veio TUDO: bula, modo de uso, como conservar, contato do sac, nota fiscal no email.. gente isso aqui é nivel farmacia premium, nao é loja de instagram de fundo de quintal nao. CNPJ ativo, conferi. comprem tranquilas é coisa serio",
    photos: ["/reviews/fernanda-caixa-qr.webp"],
  },
  {
    avatar: "/reviews/lucas.webp",
    name: "L**s F.",
    date: "21 junho 2026",
    rating: 5,
    text: "to no terceiro frasco e preciso desabafar: -7kg SEM dieta maluca, SEM passar fome, SEM academia. comparei o lacre e o liquido com a foto do fabricante e é igualzinho. eu ja tinha desistido de mim, achava q ia morrer obeso de verdade. hoje minha esposa me olha diferente, meus filhos brincam comigo no parque sem eu cansar.. nao tem preço. se vc ta lendo isso e em duvida, COMPRA. vc merece",
    photos: ["/reviews/lucas-frasco-mao.webp"],
  },
  {
    avatar: "/reviews/marcos.webp",
    name: "M**os R.",
    date: "18 junho 2026",
    rating: 5,
    text: "levei a ampola pro meu endocrino conferir antes de aplicar (de tanto medo de golpe kkk).. ele olhou o lacre, leu o rotulo, conferiu a dosagem e falou: pode usar tranquilo, é serio. -8kg em 6 semanas, pressao normalizou, parei de roncar e minha esposa voltou a dormir comigo no msm quarto 😂 obrigado de coração",
    photos: ["/reviews/marcos-antes-depois.webp"],
  },
  {
    avatar: "/reviews/paula.webp",
    name: "P**a L.",
    date: "17 junho 2026",
    rating: 5,
    text: "eu tenho PAVOR de agulha, tremia so de pensar.. mas é subcutanea, a agulha é minuscula, eu quase nao senti juro. ja no 2 dia a fome sumiu, parei de beliscar a noite (meu pior vicio ha 15 anos). primeira vez na vida q sinto q eu controlo a comida, e nao ela.. se eu medrosa consegui, qualquer uma consegue. vai por mim",
  },
  {
    avatar: "/reviews/gustavo.webp",
    name: "G**vo A.",
    date: "16 junho 2026",
    rating: 5,
    text: "ja gastei fortuna em outras marcas e nunca tive resultado tao bom qnt com a T.G.15. frasco impecavel, lacre laranja perfeito, liquido cristalino. e o melhor, por uma fraçao do q eu pagava. ta sobrando dinheiro pra viajar com as crianças no fim de ano 🥹 oportunidade q nao vai durar muito nesse preço, compra AGORA",
  },
  {
    avatar: "/reviews/clara.webp",
    name: "C**a B.",
    date: "15 junho 2026",
    rating: 5,
    text: "minha compulsao por doce era doença mesmo gente.. acordava 3h da manha pra comer brigadeiro de pote escondido (q vergonha admitir isso). na PRIMEIRA semana a vontade sumiu. nao é magica, é o remedio agindo de vdd, eu pesquisei. 5,8kg em 28 dias só comendo melhor, sem dieta. to voltando a me reconhecer no espelho 🥺",
  },
  {
    avatar: "/reviews/tiago.webp",
    name: "T**o M.",
    date: "14 junho 2026",
    rating: 4,
    text: "sendo sincero, tirei uma estrela pq o enjoo no 1 dia foi forte.. mas ta escrito na bula, é esperado. passou no 2 dia e nunca mais voltou. de resto, melhor investimento q fiz em mim em 10 anos. -6kg em 5 semanas, disposiçao absurda, voltei a treinar. vale CADA centavo, quem ta com medo de efeito relaxa q a empresa explica tudo direitinho",
  },
  {
    avatar: "/reviews/bruna.webp",
    name: "B**a R.",
    date: "13 junho 2026",
    rating: 5,
    text: "liguei no sac com umas 10 duvidas e fui atendida em menos de 2 min, gente. a moça paciente d+++ tirou TUDO: horario ideal, rodizio do local, o q fazer se faltar luz na geladeira.. empresa serio nao tem medo de atender, isso nao é loja fantasma nao. pode comprar tranquila q vc ta em boas maos",
  },
  {
    avatar: "/reviews/ana.webp",
    name: "A**a C.",
    date: "12 junho 2026",
    rating: 5,
    text: "minha terceira compra ja, recomendo de olho fechado!! comprei a primeira morrendo de medo de ser golpe, q nada.. chega lacrado, geladinho, com nota fiscal. -27kg em 3 meses (fotos ai 🙌) mudou minha vida. corre antes do preço subir gente, é raro de achar oportunidade assim",
    photos: ["/reviews/ana-antes-depois.webp"],
  },
  {
    avatar: "/reviews/diego.webp",
    name: "D**o S.",
    date: "11 junho 2026",
    rating: 5,
    text: "diabetico tipo 2 ha 9 anos, tomava 4 remedio por dia e a glicemia nao baixava nunca.. em 5 semanas a jejum caiu de 180 pra 110 SEM hipoglicemia. meu endocrino ficou impressionado e pediu pra continuar +6 meses. gente isso mudou minha vida, eu achava q ia perder o pé um dia 😢 se vc é diabetico nao perde essa, pode ser sua virada tbm",
  },
  {
    avatar: "/reviews/sandra.webp",
    name: "S**a M.",
    date: "10 junho 2026",
    rating: 5,
    text: "COMENTÁRIO PENDENTE — enviar o texto da Sandra para substituir aqui.",
  },
  {
    avatar: "/reviews/victor.webp",
    name: "V**or L.",
    date: "10 junho 2026",
    rating: 5,
    text: "roupa q eu guardava ha 2 anos com esperança boba voltou a SERVIR.. chorei no provador q vergonha kkk -11kg em 9 semanas sem academia, sem sofrer. aplico toda quarta de manha antes do café, virou rotina. eu ja tinha aceitado q ia engordar até morrer.. hj meus filhos me chamam pra brincar e eu CONSIGO correr com eles 🥹 nao perde nao",
  },
  {
    avatar: "/reviews/karina.webp",
    name: "K**a N.",
    date: "9 junho 2026",
    rating: 5,
    text: "confesso q tava com MUITO medo de falsificaçao, ja tinha sido enganada antes em outra loja.. mas o lacre veio numerado, consegui rastrear o lote no site do fabricante e tudo conferiu certo. ai relaxei e apliquei.. funcionou demais, 4kg na primeira quinzena 🙏 quem ta com medo igual eu tava pode comprar, aqui é loja serio msm",
  },
  {
    avatar: "/reviews/eduardo.webp",
    name: "E**do P.",
    date: "8 junho 2026",
    rating: 5,
    text: "pedido chegou no dia EXATO q prometeram, com nota fiscal no email e tudo direitinho. o entregador dos correios trouxe a caixa termica ainda selada e gelada. profissionalismo nivel amazon, juro.. isso aqui nao é loja improvisada nao, é empresa estruturada. pode comprar sem medo",
  },
  {
    avatar: "/reviews/ines.webp",
    name: "I**s A.",
    date: "7 junho 2026",
    rating: 4,
    text: "sendo honesta: funciona MT bem mas precisa de disciplina com horario fixo e beber agua (2L por dia, vem escrito no folheto). quem seguir nao tem como dar errado. ja perdi 6kg em 4 semanas, comendo com prazer, sem ansiedade. tirei uma estrela so pq queria q viesse com lembrete no celular kkkk recomendo dms",
  },
  {
    avatar: "/reviews/renata.webp",
    name: "R**a F.",
    date: "6 junho 2026",
    rating: 5,
    text: "medica indicou tratamento mas o preço do importado era IMPOSSIVEL com 2 filhos na escola particular.. cheguei a chorar de raiva por nao conseguir cuidar de mim. descobri a T.G.15 num grupo do face e salvou meu tratamento literalmente. ja perdi 14kg em 2 meses. maes vcs merecem cuidar de vcs tbm, agarrem essa chance 🙏",
  },
  {
    avatar: "/reviews/heitor.webp",
    name: "H**or C.",
    date: "5 junho 2026",
    rating: 5,
    text: "fome emocional ZEROU em 2 semanas cara.. como porçao normal no almoço e fico satisfeito por 5-6h, sem aquela ansiedade q me destruia. acabou o efeito sanfona de TODA dieta q ja fiz. primeira vez em 20 anos q sinto q tenho controle. se vc ta lendo esse comentario é sinal, nao deixa passar",
  },
  {
    avatar: "/reviews/natalia.webp",
    name: "N**a G.",
    date: "4 junho 2026",
    rating: 5,
    text: "indiquei pra 3 amigas do trabalho e TODAS tao usando, todas emagrecendo, ninguem arrependida.. virou o assunto preferido do grupo do zap 😂 a gnt compara resultado toda semana. loja entrega no prazo, chega lacrado e gelado, atendimento responde rapido. raro achar empresa tao serio hj em dia, oportunidade UNICA",
  },
  {
    avatar: "/reviews/walter.webp",
    name: "W**er D.",
    date: "3 junho 2026",
    rating: 5,
    text: "pre diabetes resolvido em 3 meses gente.. minha hemoglobina glicada saiu de 6,4 pra 5,5 no ultimo exame, meu cardio quase caiu da cadeira kkk pediu pra continuar +3 meses pra consolidar. anexei os exames na consulta. isso aqui nao é placebo nao, é medicina de vdd por um preço q cabe no bolso. é a chance de prevenir uma doença grave, nao desperdiça",
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openFooter, setOpenFooter] = useState<number | null>(null);
  const [comboId, setComboId] = useState(4);
  const combo = combos.find((c) => c.id === comboId) ?? combos[0];
  const off = combo.off;
  const installment = combo.price / 12;

  // Fluxo de checkout
  const [view, setView] = useState<
    "product" | "loading" | "checkout" | "payment"
  >("product");
  const [customer, setCustomer] = useState<{
    name: string;
    email: string;
    document: string;
    phone: string;
  } | null>(null);

  function handleBuyNow() {
    setView("loading");
    window.scrollTo({ top: 0 });
    setTimeout(() => setView("checkout"), 2600);
  }

  // Endereço de entrega
  const [addressOpen, setAddressOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [addr, setAddr] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });
  const [savedAddress, setSavedAddress] = useState<{
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  } | null>(null);

  function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  }

  async function handleCepLookup() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setCepError("Digite um CEP válido com 8 dígitos.");
      return;
    }
    setCepError("");
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setShowManual(true);
        setCepError("Não encontramos esse CEP. Preencha o endereço manualmente.");
        setAddr((a) => ({ ...a, logradouro: "", bairro: "", cidade: "", uf: "" }));
      } else {
        setAddr((a) => ({
          ...a,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
        setShowManual(true);
      }
    } catch {
      setShowManual(true);
      setCepError("Não foi possível buscar o CEP. Preencha manualmente.");
    } finally {
      setCepLoading(false);
    }
  }

  function handleSaveAddress() {
    if (!addr.cidade || !addr.uf || !addr.logradouro || !addr.numero) {
      setCepError("Preencha ao menos rua, número, cidade e estado.");
      return;
    }
    const nextAddress = {
      logradouro: addr.logradouro,
      numero: addr.numero,
      complemento: addr.complemento,
      bairro: addr.bairro,
      cidade: addr.cidade,
      uf: addr.uf,
      cep: formatCep(cep),
    };
    setSavedAddress(nextAddress);
    // Persiste o endereço para reuso na etapa de upsell (navegação de página inteira).
    try {
      sessionStorage.setItem("upsell:address", JSON.stringify(nextAddress));
    } catch {
      /* ambiente sem sessionStorage — ignora */
    }
    setAddressOpen(false);
    setCepError("");
  }

  if (view === "loading") {
    return <PreparingScreen />;
  }

  if (view === "payment") {
    return (
      <PixPaymentFlow
        amount={combo.price}
        productName={`Tirzepatida T.G. 15mg — ${combo.label}`}
        customer={customer ?? undefined}
        onBack={() => setView("checkout")}
      />
    );
  }

  return (
    <>
      {view === "checkout" ? (
        <CheckoutPage
          combo={combo}
          productName="Tirzepatida T.G. 15mg"
          savedAddress={savedAddress}
          onBack={() => setView("product")}
          onEditAddress={() => setAddressOpen(true)}
          onPay={(c) => {
            setCustomer(c);
            window.scrollTo({ top: 0 });
            setView("payment");
          }}
        />
      ) : (
        <div className="min-h-screen bg-[#ebebeb] text-[#333]">
      {/* Header */}
      <header className="bg-[#FFE600]">
        <div className="mx-auto max-w-[1200px] px-3 pt-2 sm:px-4 sm:pt-3">
          {/* Top row: logo + search + banner */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#" aria-label="Mercado Livre" className="shrink-0">
              <img
                src="/mercado-livre-logo.png"
                alt="Mercado Livre"
                className="h-10 w-auto sm:h-14"
              />
            </a>
            <form className="flex min-w-0 flex-1 items-center rounded-sm bg-white px-3 py-2 shadow-sm">
              <input
                type="text"
                defaultValue="Tizerpatida 15mg"
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
            <button
              type="button"
              onClick={() => setAddressOpen(true)}
              className="flex items-center gap-1 rounded-sm text-left hover:opacity-80"
            >
              <MapPin className="h-4 w-4" />
              <div className="leading-tight">
                <div className="text-[#666]">Enviar para</div>
                <div className="font-semibold">
                  {savedAddress
                    ? `${savedAddress.cidade} ${savedAddress.cep}`
                    : "Informe seu CEP"}
                </div>
              </div>
            </button>
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
        <span>Saúde</span>
        <ChevronRight className="mx-1 inline h-3 w-3 text-[#999]" />
        <span className="text-[#666]">Emagrecedores</span>
      </div>

      {/* Main product */}
      <main className="mx-auto max-w-[1200px] px-2 pb-10 sm:px-4">
        <div className="rounded-md bg-white p-3 shadow-sm sm:p-6">
          <div className="grid gap-6 md:grid-cols-[80px_1fr_360px]">
            {/* Thumbs */}
            <div className="order-2 flex gap-2 md:order-none md:col-start-1 md:row-start-1 md:flex-col">
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
            <div className="order-1 md:order-none md:col-start-2 md:row-start-1">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-white">
                <img
                  src={images[selected]}
                  alt="Tirzepatida T.G. 15mg — 4 Ampolas"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Description */}
            <div className="order-4 md:order-none md:col-start-2 md:row-start-2">
              <div className="mt-6 border-t pt-6 md:mt-0">
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
            <aside className="order-3 space-y-4 md:order-none md:col-start-3 md:row-start-1 md:row-span-2">
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
                <div className="text-sm text-[#999] line-through">R$ {formatBRL(combo.original)}</div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-light text-[#333]">
                    R$ <span className="font-normal">{Math.floor(combo.price)}</span>
                    <span className="align-top text-lg">
                      ,{Math.round((combo.price - Math.floor(combo.price)) * 100).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-sm text-[#00a650]">{off}% OFF</span>
                </div>
                <div className="text-sm text-[#00a650]">em 12x R$ {formatBRL(installment)} sem juros</div>
                <a href="#" className="text-xs text-[#3483fa]">
                  Ver os meios de pagamento
                </a>
              </div>

              {/* Seletor de combos */}
              <div>
                <div className="mb-2 text-sm font-semibold text-[#333]">Selecionar opções</div>
                <div className="grid grid-cols-3 gap-2">
                  {combos.map((c) => {
                    const active = c.id === comboId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setComboId(c.id)}
                        className={`relative flex flex-col items-center rounded-lg border-2 bg-white p-2 pt-3 text-center transition ${
                          active
                            ? "border-[#3483fa] shadow-sm"
                            : "border-[#e0e0e0] hover:border-[#b3b3b3]"
                        }`}
                      >
                        {c.best && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#e91e63] px-2 py-0.5 text-[9px] font-bold uppercase leading-none text-white">
                            Melhor custo
                          </span>
                        )}
                        <div className="flex h-12 w-full items-center justify-center">
                          <img
                            src={c.image}
                            alt={c.label}
                            className="max-h-12 max-w-full object-contain"
                          />
                        </div>
                        <div className={`mt-2 text-xs font-semibold ${active ? "text-[#3483fa]" : "text-[#333]"}`}>
                          {c.label}
                        </div>
                        <div className="text-xs text-[#333]">R${formatBRL(c.price)}</div>
                      </button>
                    );
                  })}
                </div>
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

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full rounded bg-[#3483fa] py-3 text-sm font-semibold text-white hover:bg-[#2968c8]"
                >
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
                    {(review.videos || review.photos) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {review.videos?.map((v, j) => (
                          <video
                            key={`v-${j}`}
                            src={v}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-28 w-28 rounded border border-[#e0e0e0] bg-black object-cover"
                          />
                        ))}
                        {review.photos?.map((p, j) => (
                          <img
                            key={`p-${j}`}
                            src={p || "/placeholder.svg"}
                            alt={`Foto ${j + 1} da avaliação de ${review.name}`}
                            className="h-28 w-28 rounded border border-[#e0e0e0] object-cover"
                          />
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

        {/* Reputação / Certificação */}
        <a
          href="https://www.reclameaqui.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver reputação da loja no Reclame Aqui"
          className="group mt-5 block overflow-hidden rounded-[14px] bg-white ring-1 ring-[#e4e7ec] transition hover:shadow-[0_6px_20px_rgba(22,163,74,0.12)] hover:ring-[#16a34a]/50"
        >
          <div className="flex items-center justify-between bg-[#16a34a] px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Reclame Aqui · Verificado
              </span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/85">
              Oficial
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 pb-3.5 pt-4">
            <img
              src="/reviews/ra1000-certificado.webp"
              alt="Certificado RA1000 ReclameAQUI"
              className="h-[60px] w-auto shrink-0 object-contain"
              loading="lazy"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#16a34a]">
                T.G Farma · CNPJ ativo
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <div className="flex items-center gap-[1px] text-[#f59e0b]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#111]">9,4</span>
                <span className="text-[#667085]">/ 10</span>
                <span className="rounded bg-[#dcfce7] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#16a34a]">
                  Ótimo
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#98a2b3]" />
          </div>

          <div className="grid grid-cols-3 border-t border-[#f0f0f0] text-center">
            {[
              { value: "98,7%", label: "Respondidas" },
              { value: "96,2%", label: "Solucionadas" },
              { value: "92%", label: "Voltariam a comprar" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`py-3 ${i > 0 ? "border-l border-[#f0f0f0]" : ""}`}
              >
                <div className="text-base font-bold text-[#16a34a]">{stat.value}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-[#667085]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#f0f0f0] bg-[#f9fafb] px-4 py-2 text-[11px] text-[#667085]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#16a34a]" />
              Reputação auditada por terceiros
            </span>
            <span>últimos 12 meses</span>
          </div>
        </a>

        {/* Accordion de links */}
        <section className="mt-4 overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
          {[
            {
              title: "Comece a comprar",
              items: ["Como comprar", "Meios de pagamento", "Frete e prazos", "Rastrear pedido"],
            },
            {
              title: "Suporte ao cliente",
              items: ["Central de ajuda", "Fale conosco", "Trocas e devoluções", "Dúvidas frequentes"],
            },
            {
              title: "Sobre a TGFarmacêutica",
              items: ["Quem somos", "Certificações", "Nossa fábrica", "Trabalhe conosco"],
            },
            {
              title: "Política e termos",
              items: ["Termos de uso", "Política de privacidade", "Política de cookies", "Segurança"],
            },
          ].map((section, i) => (
            <div key={i} className={i > 0 ? "border-t border-[#e0e0e0]" : ""}>
              <button
                type="button"
                onClick={() => setOpenFooter(openFooter === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-[#333] hover:bg-[#fafafa]"
              >
                {section.title}
                <ChevronDown
                  className={`h-4 w-4 text-[#999] transition-transform ${
                    openFooter === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFooter === i && (
                <ul className="space-y-2 px-4 pb-4">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-[#3483fa] hover:underline">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Redes sociais */}
        <section className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-[#666]">
            Siga a gente
          </div>
          <div className="mt-3 flex gap-3">
            {[
              { icon: Camera, label: "Instagram" },
              { icon: Globe, label: "Facebook" },
              { icon: Play, label: "YouTube" },
              { icon: Mail, label: "E-mail" },
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d0d0d0] text-[#333] transition hover:border-[#3483fa] hover:text-[#3483fa]"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </section>

        {/* App + info da empresa */}
        <section className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-[#666]">
            Baixe o app do Mercado Livre
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { top: "Disponível no", bottom: "Google Play" },
              { top: "Baixar na", bottom: "App Store" },
            ].map((store, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-3 rounded-lg bg-[#333] px-4 py-2.5 text-white transition hover:bg-[#000]"
              >
                <Smartphone className="h-6 w-6" />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase opacity-80">{store.top}</div>
                  <div className="text-base font-semibold">{store.bottom}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[#e0e0e0]">
            <div className="flex items-center gap-3 border-b border-[#e0e0e0] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe600]">
                <img
                  src="/reviews/ml-icon.png"
                  alt="Mercado Livre"
                  className="h-6 w-auto"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-base font-semibold text-[#111]">
                  Mercado Livre
                  <BadgeCheck className="h-4 w-4 text-[#3483fa]" />
                </div>
                <div className="text-xs text-[#666]">
                  Operador oficial · Intermediador de pagamento
                </div>
              </div>
            </div>
            <dl className="divide-y divide-[#f0f0f0] text-sm">
              {[
                { term: "Razão social", desc: "Mercado Livre Brasil Ltda." },
                { term: "CNPJ", desc: "03.007.331/0001-41" },
                {
                  term: "Sede",
                  desc: "Av. das Nações Unidas, nº 3.003 · Bonfim · Osasco/SP · CEP 06233-903",
                },
                { term: "Atendimento", desc: "mercadolivre.com.br · 24h" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 p-3">
                  <dt className="text-xs font-semibold uppercase text-[#999]">
                    {row.term}
                  </dt>
                  <dd className="col-span-2 text-[#333]">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Barra de links institucionais */}
        <section className="mt-4 border-t border-[#e0e0e0] pt-4">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              "Trabalhe conosco",
              "Termos e condições",
              "Promoções",
              "Como cuidamos da sua privacidade",
              "Acessibilidade",
              "Contato",
              "Informações sobre seguros",
              "Programa de Afiliados",
            ].map((link, i) => (
              <a
                key={i}
                href="#"
                className="text-xs text-[#3483fa] hover:underline"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="mt-3 space-y-1 text-[11px] leading-relaxed text-[#999]">
            <p>Copyright © 1999-2026. Mercado Livre Brasil Ltda.</p>
            <p>
              CNPJ n.º 03.007.331/0001-41 / Av. das Nações Unidas, nº 3.003,
              Bonfim, Osasco/SP - CEP 06233-903 - empresa do grupo Mercado Livre.
            </p>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="mb-8 mt-4">
          <p className="text-[11px] leading-relaxed text-[#999]">
            Ao navegar neste site, você aceita os cookies que usamos para
            melhorar sua experiência. Compra 100% segura. Seus dados de pagamento
            são protegidos e criptografados.
          </p>
        </footer>
      </main>
        </div>
      )}

      {/* Modal de endereço */}
      {addressOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => setAddressOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#333]">
                  Onde você quer receber?
                </h2>
                <p className="text-sm text-[#666]">
                  Digite seu CEP para calcularmos a entrega.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setAddressOpen(false)}
                className="text-2xl leading-none text-[#999] hover:text-[#333]"
              >
                {"\u00D7"}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#333]">
                  CEP
                </label>
                <div className="flex gap-2">
                  <input
                    inputMode="numeric"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    placeholder="00000-000"
                    className="min-w-0 flex-1 rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                  />
                  <button
                    type="button"
                    onClick={handleCepLookup}
                    disabled={cepLoading}
                    className="shrink-0 rounded bg-[#3483fa] px-4 py-2 text-sm font-medium text-white hover:bg-[#2968c8] disabled:opacity-60"
                  >
                    {cepLoading ? "Buscando…" : "Buscar"}
                  </button>
                </div>
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-[#3483fa]"
                >
                  Não sei meu CEP
                </a>
              </div>

              {cepError && (
                <p className="text-sm text-[#d0021b]">{cepError}</p>
              )}

              {showManual && (
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-[#333]">
                        Rua / Logradouro
                      </label>
                      <input
                        value={addr.logradouro}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, logradouro: e.target.value }))
                        }
                        className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#333]">
                        Número
                      </label>
                      <input
                        value={addr.numero}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, numero: e.target.value }))
                        }
                        className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#333]">
                      Complemento (opcional)
                    </label>
                    <input
                      value={addr.complemento}
                      onChange={(e) =>
                        setAddr((a) => ({ ...a, complemento: e.target.value }))
                      }
                      className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#333]">
                      Bairro
                    </label>
                    <input
                      value={addr.bairro}
                      onChange={(e) =>
                        setAddr((a) => ({ ...a, bairro: e.target.value }))
                      }
                      className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-[#333]">
                        Cidade
                      </label>
                      <input
                        value={addr.cidade}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, cidade: e.target.value }))
                        }
                        className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#333]">
                        Estado
                      </label>
                      <input
                        value={addr.uf}
                        maxLength={2}
                        onChange={(e) =>
                          setAddr((a) => ({
                            ...a,
                            uf: e.target.value.toUpperCase(),
                          }))
                        }
                        className="w-full rounded border border-[#d0d0d0] bg-white px-3 py-2 text-sm uppercase text-[#333] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    className="w-full rounded bg-[#3483fa] py-2.5 text-sm font-medium text-white hover:bg-[#2968c8]"
                  >
                    Usar este endereço
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
