export type FuelType =
  | "Flex"
  | "Gasolina"
  | "Diesel"
  | "Híbrido"
  | "Elétrico";

export type Transmission = "Manual" | "Automático" | "Automatizado" | "CVT";

export type BodyType = "Hatch" | "Sedã" | "SUV" | "Picape" | "Minivan";

export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export interface VehiclePhoto {
  url: string;
  alt: string | null;
}

export interface Vehicle {
  /** slug usado na rota /estoque/[id] */
  id: string;
  brand: string;
  model: string;
  version: string;
  /** ano modelo */
  year: number;
  /** ano de fabricação, quando difere do modelo */
  manufactureYear: number;
  /** preço à vista em reais */
  price: number;
  /** quilometragem */
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  body: BodyType;
  color: string;
  doors: number;
  /** final da placa (rodízio) */
  plateEnd: number;
  /** 1, 2 ou 3 = posição nos destaques da home; null = não é destaque */
  featuredPosition: number | null;
  status: VehicleStatus;
  /** 2 a 3 pontos de venda curtos */
  highlights: string[];
  /** itens de série e opcionais */
  features: string[];
  description: string;
  /** quantas fotos a galeria tem */
  photoCount: number;
  /** fotos reais (veiculo_fotos), ordenadas por position. Vazio => usa Placeholder */
  photos: VehiclePhoto[];
}
