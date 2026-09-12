-- CreateTable
CREATE TABLE `veiculos` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `version` VARCHAR(200) NOT NULL,
    `year` INTEGER NOT NULL,
    `manufacture_year` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `mileage` INTEGER NOT NULL,
    `fuel` ENUM('Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico') NOT NULL,
    `transmission` ENUM('Manual', 'Automático', 'Automatizado', 'CVT') NOT NULL,
    `body` ENUM('Hatch', 'Sedã', 'SUV', 'Picape', 'Minivan') NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `doors` INTEGER NOT NULL,
    `plate_end` INTEGER NOT NULL,
    `featured_position` INTEGER NULL,
    `status` ENUM('disponivel', 'reservado', 'vendido') NOT NULL DEFAULT 'disponivel',
    `highlights` JSON NOT NULL,
    `features` JSON NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `license_plate` VARCHAR(191) NULL,
    `renavam` VARCHAR(191) NULL,
    `chassis` VARCHAR(191) NULL,
    `fipe_code` VARCHAR(191) NULL,
    `purchase_cost` INTEGER NULL,
    `internal_notes` TEXT NULL,

    UNIQUE INDEX `veiculos_slug_key`(`slug`),
    UNIQUE INDEX `veiculos_featured_position_key`(`featured_position`),
    INDEX `veiculos_status_idx`(`status`),
    INDEX `veiculos_brand_idx`(`brand`),
    INDEX `veiculos_body_idx`(`body`),
    INDEX `veiculos_price_idx`(`price`),
    INDEX `veiculos_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculo_fotos` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `alt` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `veiculo_fotos_vehicle_id_position_idx`(`vehicle_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `kind` ENUM('CONTATO', 'TROCA', 'INTERESSE', 'FINANCIAMENTO') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` TEXT NULL,
    `message` TEXT NULL,
    `trade_car` TEXT NULL,
    `trade_km` INTEGER NULL,
    `vehicle_id` VARCHAR(191) NULL,
    `status` ENUM('novo', 'em_atendimento', 'fechado', 'perdido') NOT NULL DEFAULT 'novo',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `leads_status_created_at_idx`(`status`, `created_at`),
    INDEX `leads_kind_idx`(`kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depoimentos` (
    `id` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `context` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuracoes` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `tagline` TEXT NOT NULL,
    `sold_count` INTEGER NOT NULL,
    `years_active` INTEGER NOT NULL,
    `instagram_handle` VARCHAR(191) NOT NULL,
    `instagram_url` TEXT NOT NULL,
    `whatsapp_number` VARCHAR(191) NOT NULL,
    `whatsapp_message` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address_street` TEXT NOT NULL,
    `address_district` VARCHAR(191) NOT NULL,
    `address_city` VARCHAR(191) NOT NULL,
    `address_state` VARCHAR(191) NOT NULL,
    `address_zip` VARCHAR(191) NOT NULL,
    `maps_url` TEXT NOT NULL,
    `hours` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `veiculo_fotos` ADD CONSTRAINT `veiculo_fotos_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `veiculos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `veiculos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
