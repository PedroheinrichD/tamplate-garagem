-- DropIndex
DROP INDEX "veiculos_status_featured_idx";

-- AlterTable
ALTER TABLE "veiculos" DROP COLUMN "featured",
ADD COLUMN     "featured_position" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_featured_position_key" ON "veiculos"("featured_position");

-- CreateIndex
CREATE INDEX "veiculos_status_idx" ON "veiculos"("status");
