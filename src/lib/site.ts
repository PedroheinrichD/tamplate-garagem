/**
 * Dados institucionais da concessionaria (template generico "Garagem").
 *
 * TODO (cliente): os campos marcados com PLACEHOLDER precisam dos dados reais
 * antes de publicar.
 */

export const site = {
  name: "Garagem Veículos",
  shortName: "Garagem",
  tagline: "Compra, venda, troca e financiamento de seminovos.",
  soldCount: 700,
  yearsActive: 3,

  instagram: {
    handle: "@beneventoveiculos",
    url: "https://instagram.com/beneventoveiculos",
  },

  // PLACEHOLDER: numero de WhatsApp real do cliente (com DDI 55 + DDD).
  whatsapp: {
    number: "5516997729706",
    display: "(16) 99772-9706",
    // wa.me exige apenas digitos, com codigo do pais.
    href: "https://wa.me/5516997729706",
    defaultMessage:
      "Olá! Vim pelo site e quero falar sobre um veículo do estoque.",
  },

  // PLACEHOLDER: endereco real da loja. Vazio por enquanto - os componentes
  // que exibem endereco/mapa (VisitUs, /contato, SiteFooter) escondem esse
  // bloco quando `street` esta vazio.
  address: {
    street: "",
    district: "",
    city: "",
    state: "",
    zip: "",
    mapsUrl: "",
  },

  // PLACEHOLDER: horario real de funcionamento.
  hours: [
    { days: "Segunda a sexta", time: "08h30 às 18h30" },
    { days: "Sábado", time: "08h30 às 13h00" },
    { days: "Domingo", time: "Fechado" },
  ],

  // PLACEHOLDER: e-mail real de contato.
  email: "contato@garagemveiculos.com.br",
} as const;

export const nav = [
  { label: "Início", href: "/" },
  { label: "Estoque", href: "/estoque" },
  { label: "Financiamento", href: "/#financiamento" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;
