const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const desaOrKelurahan = require('./data/DesaOrKelurahan.json')
const kecamatan = require('./data/Kecamatan.json')
const kabupatenOrKota = require('./data/KabupatenOrKota.json')
const provinsi = require('./data/Provinsi.json')
const role = require('./data/Role.json')
const prodi = require('./data/Prodi.json')
const jurusan = require('./data/Jurusan.json')
const user = require('./data/User.json')
const jnsKelamin = require('./data/JenisKelamin')
const skemaPenelitian = require('./data/SkemaPenelitian.json')
const skemaPengabdian = require('./data/SkemaPengabdian.json')
const ruangLingkupSkemaPengabdian = require('./data/RuangLingkupSkemaPengabdian.json')
const deskripsiPenilaianPenelitian = require('./data/DeskripsiPenilaianPenelitian.json')
const deskripsiPenilaianPengabdian = require('./data/DeskripsiPenilaianPengabdian.json')




async function main() {

    // Role
    await prisma.role.createMany({
        data: role
    })

    // Jenis Kelamin
    await prisma.jenisKelamin.createMany({
        data: jnsKelamin
    })

    // Jurusan
    await prisma.jurusan.createMany({
        data: jurusan
    })

     // Prodi
    await prisma.prodi.createMany({
        data: prodi 
    })

    // User
    await prisma.user.createMany({
        data: user
    })

    // Skema Penelitian
    await prisma.skemaPenelitian.createMany({
        data: skemaPenelitian
    })

    // Skema Pengabdian
    const tes = await prisma.skemaPengabdian.createMany({
        data: skemaPengabdian
    })

    // Ruang Lingkup Skema Pengabdian
    await prisma.ruangLingkupSkemaPengabdian.createMany({
        data: ruangLingkupSkemaPengabdian
    })

    // Deskripsi Penilaian Penelitian
    await prisma.deskripsiPenilaianPenlitian.createMany({
        data: deskripsiPenilaianPenelitian
    })

    // Deskripsi Penilaian Pengabdian
    await prisma.deskripsiPenilaianPengabdian.createMany({
        data: deskripsiPenilaianPengabdian
    })

    
}

main()
    .catch((e) => {
        console.error(`Error : ${e}`);
        process.exit(1)
    })
    .finally(async () => {
        console.log(`Berhasil Sedding Database`);
        prisma.$disconnect();
    })