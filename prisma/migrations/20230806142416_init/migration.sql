/*
  Warnings:

  - Added the required column `URLJurnal` to the `LaporanAkhir` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanakhir` ADD COLUMN `URLJurnal` VARCHAR(191) NOT NULL;
