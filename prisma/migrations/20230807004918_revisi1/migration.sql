/*
  Warnings:

  - Added the required column `statusLaporan` to the `LaporanAkhir` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanakhir` ADD COLUMN `statusLaporan` INTEGER NOT NULL;
