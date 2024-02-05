/*
  Warnings:

  - A unique constraint covering the columns `[jadwalJudul]` on the table `jadwalP3M` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `jadwalP3M_jadwalJudul_key` ON `jadwalP3M`(`jadwalJudul`);
