-- CreateTable
CREATE TABLE `ReviewLaporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `laporanAkhirId` INTEGER NOT NULL,
    `komentar` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL,

    UNIQUE INDEX `ReviewLaporan_nameUser_key`(`nameUser`),
    UNIQUE INDEX `ReviewLaporan_laporanAkhirId_key`(`laporanAkhirId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReviewLaporan` ADD CONSTRAINT `ReviewLaporan_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewLaporan` ADD CONSTRAINT `ReviewLaporan_laporanAkhirId_fkey` FOREIGN KEY (`laporanAkhirId`) REFERENCES `LaporanAkhir`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
