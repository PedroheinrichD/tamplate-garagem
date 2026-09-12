/**
 * Dados institucionais da concessionaria.
 *
 * TODO (cliente): os campos marcados com PLACEHOLDER precisam dos dados reais
 * da Benevento's Veiculos antes de publicar. O que ja veio do Instagram do
 * cliente esta preenchido de verdade.
 */

export const site = {
  name: "Benevento's Veículos",
  shortName: "Benevento's",
  // Do Instagram do cliente: "Compra, venda, troca e financia".
  tagline: "Compra, venda, troca e financiamento de seminovos.",
  // Do Instagram do cliente: "Mais de 700 veículos vendidos em 3 anos!".
  soldCount: 700,
  yearsActive: 3,

  instagram: {
    handle: "@beneventoveiculos",
    url: "https://instagram.com/beneventoveiculos",
  },

  // PLACEHOLDER: numero de WhatsApp real do cliente (com DDI 55 + DDD).
  whatsapp: {
    display: "(00) 00000-0000",
    // wa.me exige apenas digitos, com codigo do pais.
    href: "https://wa.me/5500000000000",
    defaultMessage:
      "Olá! Vim pelo site e quero falar sobre um veículo do estoque.",
  },

  address: {
    street: "Av. Florêncio Terra, 1630",
    district: "Centro",
    city: "Itápolis",
    state: "SP",
    zip: "14900-000",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.+Flor%C3%AAncio+Terra%2C+1630+-+Centro%2C+It%C3%A1polis+-+SP%2C+14900-000",
  },

  // PLACEHOLDER: horario real de funcionamento.
  hours: [
    { days: "Segunda a sexta", time: "08h30 às 18h30" },
    { days: "Sábado", time: "08h30 às 13h00" },
    { days: "Domingo", time: "Fechado" },
  ],

  // PLACEHOLDER: e-mail real de contato.
  email: "contato@beneventoveiculos.com.br",
} as const;

// Donos da loja que atendem os clientes pelo WhatsApp. Os botões que levam
// ao WhatsApp intercalam entre os dois (index 0, 1, 0, 1...).
export const whatsappOwners = [
  { name: "Murilo", number: "5516996127633" },
  { name: "Guilherme", number: "5516997358886" },
] as const;

export const nav = [
  { label: "Início", href: "/" },
  { label: "Estoque", href: "/estoque" },
  { label: "Financiamento", href: "/#financiamento" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;
