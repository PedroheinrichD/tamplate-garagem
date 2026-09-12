-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('Manual', 'Automático', 'Automatizado', 'CVT');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('Hatch', 'Sedã', 'SUV', 'Picape', 'Minivan');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('disponivel', 'reservado', 'vendido');

-- CreateEnum
CREATE TYPE "LeadKind" AS ENUM ('CONTATO', 'TROCA', 'INTERESSE', 'FINANCIAMENTO');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('novo', 'em_atendimento', 'fechado', 'perdido');

-- CreateTable
CREATE TABLE "veiculos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "manufacture_year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel" "FuelType" NOT NULL,
    "transmission" "Transmission" NOT NULL,
    "body" "BodyType" NOT NULL,
    "color" TEXT NOT NULL,
    "doors" INTEGER NOT NULL,
    "plate_end" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "VehicleStatus" NOT NULL DEFAULT 'disponivel',
    "highlights" TEXT[],
    "features" TEXT[],
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "license_plate" TEXT,
    "renavam" TEXT,
    "chassis" TEXT,
    "fipe_code" TEXT,
    "purchase_cost" INTEGER,
    "internal_notes" TEXT,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculo_fotos" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veiculo_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "kind" "LeadKind" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT,
    "trade_car" TEXT,
    "trade_km" INTEGER,
    "vehicle_id" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'novo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depoimentos" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "depoimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "sold_count" INTEGER NOT NULL,
    "years_active" INTEGER NOT NULL,
    "instagram_handle" TEXT NOT NULL,
    "instagram_url" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "whatsapp_message" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_district" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zip" TEXT NOT NULL,
    "maps_url" TEXT NOT NULL,
    "hours" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_slug_key" ON "veiculos"("slug");

-- CreateIndex
CREATE INDEX "veiculos_status_featured_idx" ON "veiculos"("status", "featured");

-- CreateIndex
CREATE INDEX "veiculos_brand_idx" ON "veiculos"("brand");

-- CreateIndex
CREATE INDEX "veiculos_body_idx" ON "veiculos"("body");

-- CreateIndex
CREATE INDEX "veiculos_price_idx" ON "veiculos"("price");

-- CreateIndex
CREATE INDEX "veiculos_year_idx" ON "veiculos"("year");

-- CreateIndex
CREATE INDEX "veiculo_fotos_vehicle_id_position_idx" ON "veiculo_fotos"("vehicle_id", "position");

-- CreateIndex
CREATE INDEX "leads_status_created_at_idx" ON "leads"("status", "created_at");

-- CreateIndex
CREATE INDEX "leads_kind_idx" ON "leads"("kind");

-- AddForeignKey
ALTER TABLE "veiculo_fotos" ADD CONSTRAINT "veiculo_fotos_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
