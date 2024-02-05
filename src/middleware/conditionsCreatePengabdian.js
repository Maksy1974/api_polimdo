const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const validasiCreatePengabdian = async (req, res, next) => {
    try{
        const user = req.user[0]
        const {skema, ruangLingkup, DataAnggotaDosen, DataAnggotaMahasiswa} = req.body
        const namaUserDosen = []
        const judulPengabdianBerjalan = []
        

        // return console.log(DataAnggotaMahasiswa == undefined)


        if (skema.toUpperCase() == "PEMBERDAYAAN BERBASIS MASYARAKAT") {
            if ((ruangLingkup.toLowerCase() === "pemberdayaan masyarakat pemula") && (Number(user.sinta) < 20 || DataAnggotaDosen.length < 4 || (user.jabatan_fungsional.toLowerCase() !== "asisten ahli" && user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor"))) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }else if ((ruangLingkup.toLowerCase() === "pemberdayaan kemitraan masyarakat" || ruangLingkup.toLowerCase() === "Pemberdayaan Masyarakat oleh Mahasiswa") && Number(user.sinta) < 50 || DataAnggotaDosen.length < 4 || (user.jabatan_fungsional.toLowerCase() !== "asisten ahli" && user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor")) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }
        }else if (skema.toUpperCase() == "PEMBERDAYAAN BERBASIS KEWIRAUSAHAAN") {
            console.log(ruangLingkup.toLowerCase())
            if ((ruangLingkup.toLowerCase() === "kewirausahaan berbasis mahasiswa") && (Number(user.sinta) < 50 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || DataAnggotaDosen.length < 3 || DataAnggotaDosen.length > 4 || DataAnggotaMahasiswa?.length !== 20 || DataAnggotaMahasiswa == undefined)) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`, "res")
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }else if ((ruangLingkup.toLowerCase() === "pengembangan usaha kampus" || ruangLingkup.toLowerCase() === "pemberdayaan mitra usaha produk unggulan daerah") && Number(user.sinta) < 50 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || DataAnggotaDosen.length < 3 || DataAnggotaDosen.length > 4 || DataAnggotaMahasiswa?.length < 4 || DataAnggotaMahasiswa == undefined) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`)
                console.log(ruangLingkup.toLowerCase() === "pengembangan usaha kampus", "tess")
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }
        }else if (skema.toUpperCase() == "PEMBERDAYAAN BERBASIS WILAYAH") {
            if (Number(user.sinta) < 50 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor")  || DataAnggotaDosen.length !== 4 || DataAnggotaMahasiswa?.length < 4  || DataAnggotaMahasiswa == undefined) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }
        }else if (skema.toUpperCase() == "PEMBERDAYAAN MITRA VOKASI") {
            console.log(Number(user.sinta) < 100)
            if (Number(user.sinta) < 100 || (DataAnggotaDosen.length !== 4 && DataAnggotaMahasiswa?.length !== 5) || DataAnggotaMahasiswa == undefined) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${ruangLingkup}`))
            }
        }
        
        const options ={
            where: {
                NOT: {
                    statusPengabdian: 4,
                } 
            }
        }
        
        
        // Cek Pengabdian Berjalan
        const dataPengabdianSedangBerjalan = await prisma.pengabdian.findMany(options)
        
        
        // return console.log(dataPengabdianSedangBerjalan)
        
        dataPengabdianSedangBerjalan.map(data => {
            judulPengabdianBerjalan.push(data.judul)
        })
        
        // return console.log(judulPengabdianBerjalan)
        let statusErrortes = 'FALSE'
        DataAnggotaDosen.map(async (data, i) => { 
            console.log('tes')

            const dataParisiPengabdianDosenKetua = await prisma.partisipasiPengabdian.findMany({
                where: {
                    nameUser: data.nameUser,
                    judulPengabdian: {in: judulPengabdianBerjalan},
                    jabatan: "Ketua Pengusul",
                }
            })
            
            // console.log(dataParisiPengabdianDosenKetua.length, "Ketua")
            if (dataParisiPengabdianDosenKetua.length === 1 && data.jabatan === "Ketua Pengusul") {
                console.log(`Dosen ${data.nameUser} Telah Memiliki Usulan Pengabdian Berjalan, Tidak Dapat Menjadi Ketua`)
                statusErrortes = "TRUE"
                // throw new Error(`Dosen ${data.nameUser} Telah Memiliki Usulan Pengabdian Berjalan, Tidak Dapat Menjadi Ketua`)
                return res.status(404).json(responseModel.error(404, `Dosen ${data.nameUser} Telah Memiliki Usulan Pengabdian Berjalan, Tidak Dapat Menjadi Ketua`))
            }
            
            
            const dataParisiPengabdianDosenAnggota = await prisma.partisipasiPengabdian.findMany({
                where: {
                    nameUser: data.nameUser,
                    judulPengabdian: {in: judulPengabdianBerjalan},
                    NOT: {
                        jabatan: "Ketua Pengusul",
                    } 
                }
            })
            
            console.log(dataParisiPengabdianDosenAnggota.length, "Anggota")
            if (statusErrortes !== "TRUE" && dataParisiPengabdianDosenKetua.length === 1 && dataParisiPengabdianDosenAnggota.length === 1 && data.jabatan !== "Ketua Pengusul") {
                console.log(dataParisiPengabdianDosenKetua.length, dataParisiPengabdianDosenAnggota.length, data.jabatan)
                statusErrortes = "TRUE"
                // throw new Error(`${data.nameUser} Telah Memiliki 1 Usulan dan 1 Anggota Pengabdian Berjalan, Tidak Dapat Menjadi Anggota`)
                return res.status(404).json(responseModel.error(404, `${data.nameUser} Telah Memiliki 1 Usulan dan 1 Anggota Pengabdian Berjalan, Tidak Dapat Menjadi Anggota`))
            }
            
            
            if (statusErrortes !== "TRUE" && dataParisiPengabdianDosenAnggota.length >= 2) {
                statusErrortes = "TRUE"
                // throw new Error(`${data.nameUser} Telah Memiliki 2 Anggota Pengabdian, Tidak Bisa Menjadi Anggota`)
                return res.status(404).json(responseModel.error(404, `${data.nameUser} Telah Memiliki 2 Anggota Pengabdian, Tidak Bisa Menjadi Anggota`))
            }

            

            console.log(i, DataAnggotaDosen.length - 1, statusErrortes)
            if (i === DataAnggotaDosen.length - 1 && statusErrortes === "FALSE") {
                next()
            }
        })
        
        console.log(statusErrortes)
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

module.exports = validasiCreatePengabdian