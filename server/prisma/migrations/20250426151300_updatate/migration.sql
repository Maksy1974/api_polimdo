/*
  Warnings:

  - Added the required column `kategori` to the `Kegiatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ketuaId` to the `Kegiatan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kegiatan` ADD COLUMN `kategori` VARCHAR(191) NOT NULL,
    ADD COLUMN `ketuaId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `KegiatanAnggota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kegiatanId` INTEGER NOT NULL,
    `peran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kegiatan` ADD CONSTRAINT `Kegiatan_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KegiatanAnggota` ADD CONSTRAINT `KegiatanAnggota_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KegiatanAnggota` ADD CONSTRAINT `KegiatanAnggota_kegiatanId_fkey` FOREIGN KEY (`kegiatanId`) REFERENCES `Kegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
