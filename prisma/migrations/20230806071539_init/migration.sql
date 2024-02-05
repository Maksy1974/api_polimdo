-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nomor_tlp` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NULL,
    `nidn` VARCHAR(191) NULL,
    `sinta` VARCHAR(191) NULL,
    `jabatan_fungsional` VARCHAR(191) NULL,
    `jabtan_kampus` VARCHAR(191) NULL,
    `tempat_lahir` VARCHAR(191) NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `pendidikan_terakhir` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `profile_picture` VARCHAR(191) NULL,
    `profile_picture_id` VARCHAR(191) NULL,
    `jurusanId` INTEGER NULL,
    `prodiId` INTEGER NULL,
    `jnsKelaminName` VARCHAR(191) NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_name_key`(`name`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_nim_key`(`nim`),
    UNIQUE INDEX `User_nidn_key`(`nidn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkemaPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SkemaPengabdian_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RuangLingkupSkemaPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `skema` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RuangLingkupSkemaPengabdian_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeskripsiPenilaianPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `skema` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NOT NULL,
    `skema` VARCHAR(255) NULL,
    `abstrak` LONGTEXT NOT NULL,
    `temaBidangFokus` VARCHAR(191) NOT NULL,
    `bidangFokus` VARCHAR(191) NOT NULL,
    `ruangLingkup` VARCHAR(191) NOT NULL,
    `lamaKegiatan` VARCHAR(191) NOT NULL,
    `statusPengabdian` INTEGER NOT NULL,
    `statusDibiayai` BOOLEAN NOT NULL DEFAULT false,
    `statusRevisi` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pengabdian_judul_key`(`judul`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartisipasiPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `judulPengabdian` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `tugasdlmPengabdian` VARCHAR(191) NOT NULL,
    `statusPartisipasi` INTEGER NOT NULL,
    `statusAkun` INTEGER NOT NULL,
    `statusRevisi` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkemaPenelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SkemaPenelitian_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeskripsiPenilaianPenlitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `skema` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NOT NULL,
    `skema` VARCHAR(255) NULL,
    `abstrak` LONGTEXT NOT NULL,
    `jenisTKT` VARCHAR(191) NOT NULL,
    `jenisTargetTKT` VARCHAR(191) NOT NULL,
    `bidangFokus` VARCHAR(191) NOT NULL,
    `biayaLuaran` VARCHAR(191) NOT NULL,
    `lamaKegiatan` VARCHAR(191) NOT NULL,
    `statusPenelitian` INTEGER NOT NULL,
    `statusDibiayai` BOOLEAN NOT NULL DEFAULT false,
    `statusRevisi` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Penelitian_judul_key`(`judul`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartisipasiPenelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `judulPenelitian` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NULL,
    `tugasdlmPenlitian` VARCHAR(191) NOT NULL,
    `statusPartisipasi` INTEGER NOT NULL,
    `statusAkun` INTEGER NOT NULL,
    `statusRevisi` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewPenelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `judulPenelitian` VARCHAR(191) NOT NULL,
    `sebagai` VARCHAR(191) NOT NULL,
    `revisi` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NilaiPenelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idReviewPenelitian` INTEGER NOT NULL,
    `judulPenelitian` VARCHAR(191) NOT NULL,
    `idDeskripsiPenilaian` INTEGER NOT NULL,
    `nilai` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `judulPengabdian` VARCHAR(191) NOT NULL,
    `sebagai` VARCHAR(191) NOT NULL,
    `revisi` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NilaiPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idReviewPengabdian` INTEGER NOT NULL,
    `judulPengabdian` VARCHAR(191) NOT NULL,
    `idDeskripsiPenilaian` INTEGER NOT NULL,
    `nilai` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwalP3M` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwalJudul` VARCHAR(191) NOT NULL,
    `tglMulai` DATETIME(3) NOT NULL,
    `tglAkhir` DATETIME(3) NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CatatanHarian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partisipasiPenelitianId` INTEGER NULL,
    `partisipasiPengabdianId` INTEGER NULL,
    `idDokumen` INTEGER NULL,
    `kegiatan` VARCHAR(191) NOT NULL,
    `ttg` DATETIME(3) NULL,
    `kehadiran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanKemajuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judulPenelitian` VARCHAR(191) NULL,
    `judulPengabdian` VARCHAR(191) NULL,
    `idDokumen` INTEGER NULL,
    `partisipasiPenelitianId` INTEGER NULL,
    `partisipasiPengabdianId` INTEGER NULL,
    `URLJurnal` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanAkhir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judulPenelitian` VARCHAR(191) NULL,
    `judulPengabdian` VARCHAR(191) NULL,
    `idDokumen` INTEGER NULL,
    `partisipasiPenelitianId` INTEGER NULL,
    `partisipasiPengabdianId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiayaKegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uraian` VARCHAR(191) NOT NULL,
    `jumlah` VARCHAR(191) NOT NULL,
    `LaporanKemajuanId` INTEGER NULL,
    `LaporanAkhirId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nameUser` VARCHAR(191) NOT NULL,
    `idPenelitian` INTEGER NULL,
    `idPengabdian` INTEGER NULL,
    `namePdf` VARCHAR(191) NOT NULL,
    `urlPdf` VARCHAR(191) NOT NULL,
    `pdf_id` VARCHAR(191) NOT NULL,
    `namePdfRevisi` VARCHAR(191) NULL,
    `urlPdfRevisi` VARCHAR(191) NULL,
    `pdf_idRevisi` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `judulPenelitian` VARCHAR(191) NULL,
    `judulPengabdian` VARCHAR(191) NULL,
    `statusReadNotification` BOOLEAN NOT NULL DEFAULT false,
    `pesan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nameJurusan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Prodi_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jurusan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Jurusan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisKelamin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JenisKelamin_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_id_key`(`id`),
    UNIQUE INDEX `Role_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `Jurusan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_jnsKelaminName_fkey` FOREIGN KEY (`jnsKelaminName`) REFERENCES `JenisKelamin`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RuangLingkupSkemaPengabdian` ADD CONSTRAINT `RuangLingkupSkemaPengabdian_skema_fkey` FOREIGN KEY (`skema`) REFERENCES `SkemaPengabdian`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeskripsiPenilaianPengabdian` ADD CONSTRAINT `DeskripsiPenilaianPengabdian_skema_fkey` FOREIGN KEY (`skema`) REFERENCES `SkemaPengabdian`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengabdian` ADD CONSTRAINT `Pengabdian_skema_fkey` FOREIGN KEY (`skema`) REFERENCES `SkemaPengabdian`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengabdian` ADD CONSTRAINT `Pengabdian_ruangLingkup_fkey` FOREIGN KEY (`ruangLingkup`) REFERENCES `RuangLingkupSkemaPengabdian`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartisipasiPengabdian` ADD CONSTRAINT `PartisipasiPengabdian_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartisipasiPengabdian` ADD CONSTRAINT `PartisipasiPengabdian_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeskripsiPenilaianPenlitian` ADD CONSTRAINT `DeskripsiPenilaianPenlitian_skema_fkey` FOREIGN KEY (`skema`) REFERENCES `SkemaPenelitian`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penelitian` ADD CONSTRAINT `Penelitian_skema_fkey` FOREIGN KEY (`skema`) REFERENCES `SkemaPenelitian`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartisipasiPenelitian` ADD CONSTRAINT `PartisipasiPenelitian_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartisipasiPenelitian` ADD CONSTRAINT `PartisipasiPenelitian_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewPenelitian` ADD CONSTRAINT `ReviewPenelitian_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewPenelitian` ADD CONSTRAINT `ReviewPenelitian_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPenelitian` ADD CONSTRAINT `NilaiPenelitian_idReviewPenelitian_fkey` FOREIGN KEY (`idReviewPenelitian`) REFERENCES `ReviewPenelitian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPenelitian` ADD CONSTRAINT `NilaiPenelitian_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPenelitian` ADD CONSTRAINT `NilaiPenelitian_idDeskripsiPenilaian_fkey` FOREIGN KEY (`idDeskripsiPenilaian`) REFERENCES `DeskripsiPenilaianPenlitian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewPengabdian` ADD CONSTRAINT `ReviewPengabdian_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewPengabdian` ADD CONSTRAINT `ReviewPengabdian_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPengabdian` ADD CONSTRAINT `NilaiPengabdian_idReviewPengabdian_fkey` FOREIGN KEY (`idReviewPengabdian`) REFERENCES `ReviewPengabdian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPengabdian` ADD CONSTRAINT `NilaiPengabdian_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NilaiPengabdian` ADD CONSTRAINT `NilaiPengabdian_idDeskripsiPenilaian_fkey` FOREIGN KEY (`idDeskripsiPenilaian`) REFERENCES `DeskripsiPenilaianPengabdian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatatanHarian` ADD CONSTRAINT `CatatanHarian_partisipasiPenelitianId_fkey` FOREIGN KEY (`partisipasiPenelitianId`) REFERENCES `PartisipasiPenelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatatanHarian` ADD CONSTRAINT `CatatanHarian_partisipasiPengabdianId_fkey` FOREIGN KEY (`partisipasiPengabdianId`) REFERENCES `PartisipasiPengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatatanHarian` ADD CONSTRAINT `CatatanHarian_idDokumen_fkey` FOREIGN KEY (`idDokumen`) REFERENCES `Dokumen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKemajuan` ADD CONSTRAINT `LaporanKemajuan_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKemajuan` ADD CONSTRAINT `LaporanKemajuan_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKemajuan` ADD CONSTRAINT `LaporanKemajuan_idDokumen_fkey` FOREIGN KEY (`idDokumen`) REFERENCES `Dokumen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKemajuan` ADD CONSTRAINT `LaporanKemajuan_partisipasiPenelitianId_fkey` FOREIGN KEY (`partisipasiPenelitianId`) REFERENCES `PartisipasiPenelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKemajuan` ADD CONSTRAINT `LaporanKemajuan_partisipasiPengabdianId_fkey` FOREIGN KEY (`partisipasiPengabdianId`) REFERENCES `PartisipasiPengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAkhir` ADD CONSTRAINT `LaporanAkhir_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAkhir` ADD CONSTRAINT `LaporanAkhir_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAkhir` ADD CONSTRAINT `LaporanAkhir_idDokumen_fkey` FOREIGN KEY (`idDokumen`) REFERENCES `Dokumen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAkhir` ADD CONSTRAINT `LaporanAkhir_partisipasiPenelitianId_fkey` FOREIGN KEY (`partisipasiPenelitianId`) REFERENCES `PartisipasiPenelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAkhir` ADD CONSTRAINT `LaporanAkhir_partisipasiPengabdianId_fkey` FOREIGN KEY (`partisipasiPengabdianId`) REFERENCES `PartisipasiPengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiayaKegiatan` ADD CONSTRAINT `BiayaKegiatan_LaporanKemajuanId_fkey` FOREIGN KEY (`LaporanKemajuanId`) REFERENCES `LaporanKemajuan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiayaKegiatan` ADD CONSTRAINT `BiayaKegiatan_LaporanAkhirId_fkey` FOREIGN KEY (`LaporanAkhirId`) REFERENCES `LaporanAkhir`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_idPenelitian_fkey` FOREIGN KEY (`idPenelitian`) REFERENCES `Penelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_idPengabdian_fkey` FOREIGN KEY (`idPengabdian`) REFERENCES `Pengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_nameUser_fkey` FOREIGN KEY (`nameUser`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_judulPenelitian_fkey` FOREIGN KEY (`judulPenelitian`) REFERENCES `Penelitian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_judulPengabdian_fkey` FOREIGN KEY (`judulPengabdian`) REFERENCES `Pengabdian`(`judul`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prodi` ADD CONSTRAINT `Prodi_nameJurusan_fkey` FOREIGN KEY (`nameJurusan`) REFERENCES `Jurusan`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
