const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const validasiCreatePenelitian = async (req, res, next) => {
    try{
        const user = req.user[0]
        const {skema, DataAnggotaDosen, DataAnggotaMahasiswa} = req.body
        const namaUserDosen = []
        const judulPenelitianBerjalan = []

        

        // return console.log(DataAnggotaMahasiswa == undefined)
        
        if (skema.toLowerCase() == "penelitian fundamental") {
            if (Number(user.sinta) < 150 || DataAnggotaDosen.length < 2 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor")) {
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "penelitian kerja sama") {
            if (Number(user.sinta) < 150 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || DataAnggotaDosen.length < 3 || DataAnggotaMahasiswa?.length < 1  || DataAnggotaMahasiswa == undefined) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${skema}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "penelitian pascasarjana") {
            console.log(Number(user.sinta) < 150 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || DataAnggotaDosen.length < 1 || DataAnggotaMahasiswa?.length < 1  || DataAnggotaMahasiswa == undefined)
            if (Number(user.sinta) < 150 || (user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || DataAnggotaDosen.length < 1 || DataAnggotaMahasiswa?.length < 1  || DataAnggotaMahasiswa == undefined) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${skema}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "penelitian dosen pemula") {
            console.log(user.jabatan_fungsional.toLowerCase() !== "asisten" && user.jabatan_fungsional.toLowerCase() !== "asisten ahli" && user.jabatan_fungsional.toLowerCase() !== "lektor", (DataAnggotaDosen.length !== 2 || DataAnggotaDosen.length !== 3))
            if ((user.jabatan_fungsional.toLowerCase() !== "asisten" && user.jabatan_fungsional.toLowerCase() !== "asisten ahli" && user.jabatan_fungsional.toLowerCase() !== "lektor") || (DataAnggotaDosen.length !== 2 && DataAnggotaDosen.length !== 3)) {
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "kajian kebijakan strategis") {
            console.log( DataAnggotaDosen.length < 3 && DataAnggotaDosen.length > 6, DataAnggotaDosen.length)
            if (user.pendidikan_terakhir.toLowerCase() !== 's3' || DataAnggotaDosen.length < 3 || DataAnggotaDosen.length > 6) {
                console.log(`Tidak Memenuhi Persyaratan Pengusulan ${skema}`)
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "penelitian terapan") {
            if ((user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || Number(user.sinta) < 150 || DataAnggotaDosen.length < 2 ) {
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }else if (skema.toLowerCase() == "penelitian pengembangan") {
            if ((user.jabatan_fungsional.toLowerCase() !== "lektor" && user.jabatan_fungsional.toLowerCase() !== "lektor kepala" && user.jabatan_fungsional.toLowerCase() !== "profesor") || Number(user.sinta) < 150 || DataAnggotaDosen.length < 4 || DataAnggotaDosen.length > 6) {
                return res.status(404).json(responseModel.error(404, `Tidak Memenuhi Persyaratan Pengusulan ${skema}`))
            }
        }
        
        
        let dataPenelitianSedangBerjalan
        

        // Cek Penelitian Berjalan
        if (skema.toLowerCase() === "penelitian pascasarjana") {
            dataPenelitianSedangBerjalan = await prisma.penelitian.findMany({
                where: {
                    skema: "Penelitian Pascasarjana",
                    AND: {
                        NOT: {
                            statusPenelitian: 4
                        }
                    }
                }
            })
        }else{
            dataPenelitianSedangBerjalan = await prisma.penelitian.findMany({
                where: {
                    NOT: {
                        skema: "Penelitian Pascasarjana"
                    },
                    AND: {
                        NOT: {
                            statusPenelitian: 4
                        }
                    }
                }
            })
        }


        
       
        
        
        // return console.log(dataPenelitianSedangBerjalan)
        
        dataPenelitianSedangBerjalan.map(data => {
            judulPenelitianBerjalan.push(data.judul)
        })

        
        // return console.log(judulPenelitianBerjalan)
        let statusErrortes = 'FALSE'
        DataAnggotaDosen.map(async (data, i) => { 
            console.log('tes')           
            
            if (skema.toLowerCase() === "penelitian pascasarjana") {
                const dataParisiPenelitianDosen = await prisma.partisipasiPenelitian.findMany({
                    where: {
                        nameUser: data.nameUser,
                        judulPenelitian: {in: judulPenelitianBerjalan},
                    }
                })

                if (dataParisiPenelitianDosen.length >= 5) {
                    console.log(`Dosen ${data.nameUser} Telah Terkait di 5 Team Penelitian Pascasarjana`)
                    statusErrortes = "TRUE"
                    // throw new Error(`Dosen ${data.nameUser} Telah Terkait di 5 Team Penelitian Pascasarjana`)
                    return res.status(404).json(responseModel.error(404, `Dosen ${data.nameUser} Telah Terkait di 5 Team Penelitian Pascasarjana`))
                }
                
            }else{
                const dataParisiPenelitianDosenKetua = await prisma.partisipasiPenelitian.findMany({
                    where: {
                        nameUser: data.nameUser,
                        judulPenelitian: {in: judulPenelitianBerjalan},
                        jabatan: "Ketua Pengusul",
                    }
                })
                
                console.log(dataParisiPenelitianDosenKetua.length, "Ketua")
                if (dataParisiPenelitianDosenKetua.length === 1 && data.jabatan === "Ketua Pengusul") {
                    console.log(`Dosen ${data.nameUser} Telah Memiliki Usulan Penelitian Berjalan, Tidak Dapat Menjadi Ketua`)
                    statusErrortes = "TRUE"
                    // throw new Error(`Dosen ${data.nameUser} Telah Memiliki Usulan Penelitian Berjalan, Tidak Dapat Menjadi Ketua`)
                    return res.status(404).json(responseModel.error(404, `Dosen ${data.nameUser} Telah Memiliki Usulan Penelitian Berjalan, Tidak Dapat Menjadi Ketua`))
                }
                
                
                const dataParisiPenelitianDosenAnggota = await prisma.partisipasiPenelitian.findMany({
                    where: {
                        nameUser: data.nameUser,
                        judulPenelitian: {in: judulPenelitianBerjalan},
                        NOT: {
                            jabatan: "Ketua Pengusul",
                        } 
                    }
                })
                
                console.log(dataParisiPenelitianDosenAnggota.length, "Anggota")
                if (statusErrortes !== "TRUE" && dataParisiPenelitianDosenKetua.length === 1 && dataParisiPenelitianDosenAnggota.length === 1 && data.jabatan !== "Ketua Pengusul") {
                    statusErrortes = "TRUE"
                    // throw new Error(`${data.nameUser} Telah Memiliki 1 Usulan dan 1 Anggota Penelitian Berjalan, Tidak Dapat Menjadi Anggota`)
                    return res.status(404).json(responseModel.error(404, `${data.nameUser} Telah Memiliki 1 Usulan dan 1 Anggota Penelitian Berjalan, Tidak Dapat Menjadi Anggota`))
                }
                
                
                if (statusErrortes !== "TRUE" && dataParisiPenelitianDosenAnggota.length >= 2) {
                    statusErrortes = "TRUE"
                    // throw new Error(`${data.nameUser} Telah Memiliki 2 Anggota Penelitian, Tidak Bisa Menjadi Anggota`)
                    return res.status(404).json(responseModel.error(404, `${data.nameUser} Telah Memiliki 2 Anggota Penelitian, Tidak Bisa Menjadi Anggota`))
                }

            }

             

            console.log(i + 1, statusErrortes)
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

module.exports = validasiCreatePenelitian