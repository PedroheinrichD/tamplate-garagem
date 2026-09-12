// Seed inicial do banco Benevento's Veículos.
// Idempotente (upsert por slug / id). Não apaga dados não relacionados.
// Uso: npm run db:seed
//
// As fotos usam picsum.photos (serviço público real de imagens para
// desenvolvimento). Substituir por uploads no Supabase Storage quando o
// cliente enviar as fotos reais dos veículos.
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

process.loadEnvFile(".env");

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL),
});

/** @type {Array<import("@prisma/client").Prisma.VehicleCreateInput & { photoCount: number }>} */
const vehicles = [
  {
    slug: "chery-tiggo-5x-txs-2022",
    brand: "Chery", model: "Tiggo 5X", version: "1.5 TXS Turbo CVT",
    year: 2022, manufactureYear: 2022, price: 92900, mileage: 38420,
    fuel: "GASOLINA", transmission: "CVT", body: "SUV",
    color: "Branco Pérola", doors: 4, plateEnd: 7, featuredPosition: 1, status: "AVAILABLE",
    highlights: [
      "Único dono, com manual e chave reserva",
      "Revisões em concessionária",
      "Teto solar panorâmico",
    ],
    features: [
      'Central multimídia 10"', "Câmera de ré",
      "Sensor de estacionamento dianteiro e traseiro", "Piloto automático",
      "Ar-condicionado digital", "Bancos em couro", "Faróis full LED",
      'Rodas de liga leve 18"',
    ],
    description:
      "SUV compacto pouco rodado, com o pacote mais completo da linha. Pintura original, sem retoques, e pneus com boa vida útil.",
    photoCount: 8,
  },
  {
    slug: "jeep-compass-longitude-diesel-2022",
    brand: "Jeep", model: "Compass", version: "2.0 Turbodiesel Longitude 4x4 AT9",
    year: 2022, manufactureYear: 2021, price: 164900, mileage: 44980,
    fuel: "DIESEL", transmission: "AUTOMATICO", body: "SUV",
    color: "Prata Billet", doors: 4, plateEnd: 3, featuredPosition: 2, status: "AVAILABLE",
    highlights: [
      "Tração 4x4 e câmbio de 9 marchas",
      "Pacote Premium com bancos ventilados",
      "IPVA do ano pago",
    ],
    features: [
      'Painel digital 10,25"', 'Multimídia 10,1" com Android Auto e CarPlay sem fio',
      "Bancos dianteiros ventilados", "Teto solar", "Faróis full LED",
      "Câmera 360°", "Frenagem autônoma de emergência",
      "Assistente de permanência em faixa", "Carregador de celular por indução",
    ],
    description:
      "Compass diesel 4x4 com histórico de manutenção completo. Interior conservado e todos os itens de assistência à condução funcionando.",
    photoCount: 8,
  },
  {
    slug: "toyota-corolla-xei-2020",
    brand: "Toyota", model: "Corolla", version: "2.0 XEi CVT",
    year: 2020, manufactureYear: 2019, price: 112900, mileage: 59710,
    fuel: "FLEX", transmission: "CVT", body: "SEDA",
    color: "Branco Lunar", doors: 4, plateEnd: 1, featuredPosition: 3, status: "AVAILABLE",
    highlights: [
      "Segundo dono, procedência confirmada",
      "Toyota SafetySense de série",
      "Pneus novos nos quatro cantos",
    ],
    features: [
      'Multimídia 8" com espelhamento', "Controle de cruzeiro adaptativo",
      "Alerta de colisão frontal", "Sete airbags", "Bancos em couro",
      "Partida por botão", "Ar-condicionado digital dual zone", "Faróis full LED",
    ],
    description:
      "Geração atual do Corolla, com o conjunto 2.0 e câmbio CVT. Roda macia, sem ruídos, e revisões feitas dentro do prazo.",
    photoCount: 7,
  },
  {
    slug: "vw-t-cross-200-tsi-2021",
    brand: "Volkswagen", model: "T-Cross", version: "1.0 200 TSI Comfortline AT",
    year: 2021, manufactureYear: 2021, price: 109900, mileage: 43670,
    fuel: "FLEX", transmission: "AUTOMATICO", body: "SUV",
    color: "Cinza Platinum", doors: 4, plateEnd: 5, status: "AVAILABLE",
    highlights: [
      "Garantia de fábrica até 2026",
      "Banco traseiro deslizante",
      "Pacote de segurança completo",
    ],
    features: [
      'Multimídia VW Play 10"', "Painel de instrumentos digital", "Piloto automático",
      "Sensor de ponto cego", "Câmera de ré", "Ar digital",
      "Controle de estabilidade", 'Rodas de liga 17"',
    ],
    description:
      "SUV urbano com o motor 1.0 TSI turbo e câmbio automático de 6 marchas. Ideal para quem quer espaço sem abrir mão de economia.",
    photoCount: 7,
  },
  {
    slug: "ford-ranger-xls-diesel-2021",
    brand: "Ford", model: "Ranger", version: "2.2 XLS 4x4 Diesel AT",
    year: 2021, manufactureYear: 2020, price: 189900, mileage: 71240,
    fuel: "DIESEL", transmission: "AUTOMATICO", body: "PICAPE",
    color: "Branco Ártico", doors: 4, plateEnd: 9, status: "AVAILABLE",
    highlights: [
      "Cabine dupla, nunca usada em trabalho pesado",
      "Protetor de caçamba e capota marítima",
      "Pneus AT com meia-vida",
    ],
    features: [
      "Tração 4x4 com reduzida", "Controle de descida", 'Multimídia SYNC 8"',
      "Ar-condicionado", "Bancos em couro", "Faróis de neblina",
      "Estribos laterais", "Engate reboque",
    ],
    description:
      "Picape diesel de cabine dupla com uso rodoviário. Mecânica revisada, embreagem e suspensão em ordem.",
    photoCount: 8,
  },
  {
    slug: "hyundai-tucson-gls-2018",
    brand: "Hyundai", model: "Tucson", version: "1.6 GLS Turbo AT",
    year: 2018, manufactureYear: 2018, price: 98900, mileage: 82530,
    fuel: "GASOLINA", transmission: "AUTOMATICO", body: "SUV",
    color: "Prata Sleek", doors: 4, plateEnd: 4, status: "AVAILABLE",
    highlights: [
      "Motor 1.6 turbo com câmbio de dupla embreagem",
      "Teto solar panorâmico",
      "Segundo dono",
    ],
    features: [
      'Multimídia 8"', "Câmera de ré", "Sensor de estacionamento",
      "Bancos em couro com ajuste elétrico", "Partida por botão",
      "Ar digital dual zone", "Faróis com projetor", 'Rodas 18"',
    ],
    description:
      "SUV médio confortável e bem equipado para o ano. Ar gelado, suspensão sem folgas e documentação em dia.",
    photoCount: 6,
  },
  {
    slug: "honda-civic-exl-2019",
    brand: "Honda", model: "Civic", version: "2.0 EXL CVT",
    year: 2019, manufactureYear: 2018, price: 118900, mileage: 66410,
    fuel: "FLEX", transmission: "CVT", body: "SEDA",
    color: "Cinza Barium", doors: 4, plateEnd: 2, status: "AVAILABLE",
    highlights: [
      "Décima geração, acabamento EXL",
      "Bancos em couro com ajuste elétrico",
      "Revisões na concessionária",
    ],
    features: [
      'Multimídia 7" com espelhamento', "Câmera LaneWatch",
      "Sensor de estacionamento traseiro", "Partida por botão",
      "Ar digital dual zone", "Faróis full LED", "Chave presencial",
      'Rodas de liga 17"',
    ],
    description:
      "Sedã espaçoso e econômico, com o 2.0 aspirado e câmbio CVT. Pintura conservada e interior sem desgaste.",
    photoCount: 7,
  },
  {
    slug: "renault-duster-iconic-2022",
    brand: "Renault", model: "Duster", version: "1.3 Turbo Iconic CVT",
    year: 2022, manufactureYear: 2022, price: 98900, mileage: 39420,
    fuel: "FLEX", transmission: "CVT", body: "SUV",
    color: "Marrom Cobrizo", doors: 4, plateEnd: 6, status: "AVAILABLE",
    highlights: [
      "Motor 1.3 turbo de 170 cv",
      "Central multimídia com CarPlay sem fio",
      "IPVA quitado",
    ],
    features: [
      'Multimídia 8"', "Painel digital", "Câmera 360°", "Sensor de ponto cego",
      "Ar-condicionado automático", "Bancos revestidos em couro ecológico",
      "Faróis LED", 'Rodas diamantadas 17"',
    ],
    description:
      "SUV robusto com o motor 1.3 turbo compartilhado com a Mercedes. Bom porta-malas e altura livre do solo alta.",
    photoCount: 6,
  },
  {
    slug: "chevrolet-spin-ltz-2021",
    brand: "Chevrolet", model: "Spin", version: "1.8 LTZ 7 lugares AT",
    year: 2021, manufactureYear: 2020, price: 89900, mileage: 51680,
    fuel: "FLEX", transmission: "AUTOMATICO", body: "MINIVAN",
    color: "Preto Ébano", doors: 4, plateEnd: 8, status: "AVAILABLE",
    highlights: [
      "Sete lugares com terceira fileira",
      "Ideal para família ou aplicativo",
      "Manutenção barata",
    ],
    features: [
      'Multimídia MyLink 7"', "Câmera de ré", "Sensor de ré",
      "Ar-condicionado com saídas traseiras", "Direção elétrica",
      "Bancos rebatíveis", "Vidros e travas elétricas", "Computador de bordo",
    ],
    description:
      "Monovolume de sete lugares com o 1.8 flex e câmbio automático de 6 marchas. Espaço interno difícil de achar por esse preço.",
    photoCount: 6,
  },
  {
    slug: "citroen-c3-feel-2020",
    brand: "Citroën", model: "C3", version: "1.6 Feel Pack AT",
    year: 2020, manufactureYear: 2019, price: 62900, mileage: 47320,
    fuel: "FLEX", transmission: "AUTOMATICO", body: "HATCH",
    color: "Preto Perla Nera", doors: 4, plateEnd: 0, status: "AVAILABLE",
    highlights: [
      "Câmbio automático de verdade, não automatizado",
      "Baixa quilometragem para o ano",
      "Único dono",
    ],
    features: [
      'Multimídia 7" com espelhamento', "Câmera de ré", "Ar-condicionado digital",
      "Piloto automático", "Sensor de estacionamento", "Faróis de neblina",
      "Volante em couro", 'Rodas de liga 15"',
    ],
    description:
      "Hatch confortável com suspensão macia característica da Citroën. Bom para cidade e viagens curtas.",
    photoCount: 6,
  },
  {
    slug: "hyundai-hb20-vision-2023",
    brand: "Hyundai", model: "HB20", version: "1.0 Vision",
    year: 2023, manufactureYear: 2022, price: 74900, mileage: 22140,
    fuel: "FLEX", transmission: "MANUAL", body: "HATCH",
    color: "Branco Polar", doors: 4, plateEnd: 1, status: "AVAILABLE",
    highlights: [
      "Seminovo com pouca rodagem",
      "Garantia de fábrica vigente",
      "Primeira parcela do licenciamento paga",
    ],
    features: [
      'Multimídia 8"', "Câmera de ré", "Sensor de ré", "Ar-condicionado",
      "Direção elétrica", "Vidros elétricos nas quatro portas",
      "Computador de bordo", 'Rodas de liga 14"',
    ],
    description:
      "Hatch de entrada muito bem cuidado, ideal para primeiro carro. Consumo baixo e revisão simples.",
    photoCount: 5,
  },
  {
    slug: "fiat-argo-drive-2022",
    brand: "Fiat", model: "Argo", version: "1.0 Drive",
    year: 2022, manufactureYear: 2021, price: 67900, mileage: 29910,
    fuel: "FLEX", transmission: "MANUAL", body: "HATCH",
    color: "Vermelho Montecarlo", doors: 4, plateEnd: 5, status: "AVAILABLE",
    highlights: [
      "Pintura vermelha original em ótimo estado",
      "Pouco rodado",
      "Pneus originais",
    ],
    features: [
      'Multimídia 7" com Android Auto e CarPlay', "Câmera de ré",
      "Sensor de estacionamento", "Ar-condicionado", "Direção elétrica",
      "Vidros elétricos dianteiros", "Bancos com regulagem de altura",
      'Rodas de liga 15"',
    ],
    description:
      "Hatch econômico e moderno, com a central de 7 polegadas. Boa dirigibilidade e manutenção acessível.",
    photoCount: 5,
  },
  {
    slug: "vw-voyage-comfortline-2019",
    brand: "Volkswagen", model: "Voyage", version: "1.6 MSI Comfortline",
    year: 2019, manufactureYear: 2018, price: 58900, mileage: 63120,
    fuel: "FLEX", transmission: "MANUAL", body: "SEDA",
    color: "Preto Ninja", doors: 4, plateEnd: 2, status: "AVAILABLE",
    highlights: [
      "Porta-malas de 500 litros",
      "Motor 1.6 conhecido pela durabilidade",
      "Bom para aplicativo",
    ],
    features: [
      "Central multimídia com espelhamento", "Câmera de ré", "Ar-condicionado",
      "Direção elétrica", "Vidros e travas elétricas", "Computador de bordo",
      "Sensor de estacionamento", 'Rodas de liga 15"',
    ],
    description:
      "Sedã compacto espaçoso, econômico e barato de manter. Mecânica simples e peças fáceis de achar.",
    photoCount: 5,
  },
  {
    slug: "toyota-etios-xls-2019",
    brand: "Toyota", model: "Etios", version: "1.5 XLS Sedã",
    year: 2019, manufactureYear: 2018, price: 61900, mileage: 55830,
    fuel: "FLEX", transmission: "MANUAL", body: "SEDA",
    color: "Prata", doors: 4, plateEnd: 6, status: "AVAILABLE",
    highlights: [
      "Fama de não dar problema",
      "Consumo baixo na estrada",
      "Segundo dono",
    ],
    features: [
      'Multimídia 7"', "Câmera de ré", "Ar-condicionado", "Direção elétrica",
      "Vidros elétricos nas quatro portas", "Travas elétricas",
      "Bancos em tecido", 'Rodas de liga 15"',
    ],
    description:
      "Sedã confiável para quem roda muito. Motor 1.5 com bom desempenho e custo de manutenção baixo.",
    photoCount: 5,
  },
];

const testimonials = [
  {
    quote:
      "Comprei o Corolla e a transferência já estava pronta quando fui buscar. Não tive nenhuma dor de cabeça.",
    author: "Camila Rezende", context: "levou um Corolla XEi", position: 0,
  },
  {
    quote:
      "Dei meu HB20 na troca. O valor bateu com a tabela e ainda cobriu a diferença que eu queria financiar.",
    author: "Anderson Pires", context: "trocou por um T-Cross", position: 1,
  },
  {
    quote:
      "Fui só olhar e saí com o carro no mesmo dia, financiado. Explicaram cada linha do contrato antes de assinar.",
    author: "Juliana Marques", context: "financiou um Argo Drive", position: 2,
  },
  {
    quote:
      "Terceiro carro que compro aqui. Sempre me avisam quando entra algo parecido com o que eu procuro.",
    author: "Rogério Tavares", context: "cliente desde 2022", position: 3,
  },
];

// Espelha src/lib/site.ts. Campos PLACEHOLDER ficam como estão até o cliente enviar.
const siteConfig = {
  name: "Benevento's Veículos",
  shortName: "Benevento's",
  tagline: "Compra, venda, troca e financiamento de seminovos.",
  soldCount: 700,
  yearsActive: 3,
  instagramHandle: "@beneventoveiculos",
  instagramUrl: "https://instagram.com/beneventoveiculos",
  whatsappNumber: "5500000000000",
  whatsappMessage: "Olá! Vim pelo site e quero falar sobre um veículo do estoque.",
  email: "contato@beneventoveiculos.com.br",
  addressStreet: "Av. Florêncio Terra, 1630",
  addressDistrict: "Centro",
  addressCity: "Itápolis",
  addressState: "SP",
  addressZip: "14900-000",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+Flor%C3%AAncio+Terra%2C+1630+-+Centro%2C+It%C3%A1polis+-+SP%2C+14900-000",
  hours: [
    { days: "Segunda a sexta", time: "08h30 às 18h30" },
    { days: "Sábado", time: "08h30 às 13h00" },
    { days: "Domingo", time: "Fechado" },
  ],
};

function photosFor(v) {
  return Array.from({ length: v.photoCount }, (_, i) => ({
    url: `https://picsum.photos/seed/${v.slug}-${i + 1}/1280/860`,
    alt: `${v.brand} ${v.model} ${v.version} — foto ${i + 1} (ilustrativa)`,
    position: i,
  }));
}

async function main() {
  let vehiclesUpserted = 0;
  let photosCreated = 0;

  for (const { photoCount, ...data } of vehicles) {
    const vehicle = await prisma.vehicle.upsert({
      where: { slug: data.slug },
      create: data,
      update: data,
    });
    // Refaz as fotos deste veículo (não toca em outros).
    await prisma.vehiclePhoto.deleteMany({ where: { vehicleId: vehicle.id } });
    const photos = photosFor({ ...data, photoCount });
    await prisma.vehiclePhoto.createMany({
      data: photos.map((p) => ({ ...p, vehicleId: vehicle.id })),
    });
    vehiclesUpserted += 1;
    photosCreated += photos.length;
  }

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: t.author, quote: t.quote },
    });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", ...siteConfig },
    update: siteConfig,
  });

  const [vCount, pCount, tCount, cCount] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehiclePhoto.count(),
    prisma.testimonial.count(),
    prisma.siteConfig.count(),
  ]);

  console.log("Seed concluído:");
  console.log(`  veículos     : ${vehiclesUpserted} upsert  (total no banco: ${vCount})`);
  console.log(`  veiculo_fotos: ${photosCreated} criadas (total no banco: ${pCount})`);
  console.log(`  depoimentos  : total no banco: ${tCount}`);
  console.log(`  configuracoes: total no banco: ${cCount}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Seed FALHOU:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
