const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getAllOnlyAnggotaPenelitian = async (req, res) => {
    try{
        const {judul} = req.query

        const getAllPartisipasiPenelitianDosen = await prisma.PartisipasiPenelitian.findMany({
            where: {
                judulPenelitian: {
                    contains: judul
                },
                statusAkun: 1
            },
            include: {
                user:{
                    include: {
                        jurusan: true,
                        prodi: true
                    }
                },
                penelitian: true
            }
        })

        const getAllPartisipasiPenelitianMahasiwa = await prisma.PartisipasiPenelitian.findMany({
            where: {
                judulPenelitian: {
                    contains: judul
                },
                statusAkun: 0
            },
            include: {
                user: {
                    include: {
                        jurusan: true,
                        prodi: true
                    }
                },
                penelitian: true
            }
        })

        const dataResultPartisiPenelitan = [
            getAllPartisipasiPenelitianDosen,
            getAllPartisipasiPenelitianMahasiwa
        ]
        

        return res.status(200).json(responseModel.success(200, dataResultPartisiPenelitan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createOnlyAnggotaPenelitian = async (req, res)  => {
    try{
        
        const {nameUser, nim, jurusan, prodi, judulPenelitian, jabatan, tugasdlmPenlitian, role, idPenelitian} = req.body
        const user = req.user[0]

        
        const cekPenelitianTElahDIajukan = await prisma.penelitian.findUnique({
            where: {
                id: Number(idPenelitian)
            }
        })

        
        if (cekPenelitianTElahDIajukan?.statusPenelitian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Penelitian Telah Diajukan"))
        }
        
        if (role === 4) {
            
            const dataUserMahasiswa = await prisma.User.findUnique({
                where: {
                    name:  nameUser
                }
            })

            if (dataUserMahasiswa === null) {

                await prisma.User.create({
                    data: {
                        nim: nim,
                        name: nameUser,
                        roleId: 4,
                        // jurusanId: jurusan,
                        // prodiId: prodi,
                        username: `${nameUser}_test`,
                        password: "mahasiswatest"
                    }
                })
            }


            const CekJumlahAnggota = await prisma.partisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: cekPenelitianTElahDIajukan.judul,
                    AND: {
                        jabatan: "Mahasiswa"
                    },
                    NOT: {
                        jabatan: "Ketua Pengusul",
                    }
                }
            })
    
            console.log(CekJumlahAnggota)
    
            if (CekJumlahAnggota.length >= 2) {
                return res.status(404).json(responseModel.error(200, "Jumlah Anggota Mahasiswa hanya 2"))
            }


            if (nameUser) {
                const CekUser = await prisma.PartisipasiPenelitian.findMany({
                    where: {
                        judulPenelitian: cekPenelitianTElahDIajukan.judul,
                        nameUser: nameUser
                    }
                })
    
                if (CekUser.length !== 0) {
                    return res.status(404).json(responseModel.error(200, "Mahasiswa Sudah Ada"))
                }
                
            }
            
            
            const dataCreatePartisiMahasiswa = await prisma.PartisipasiPenelitian.create({
                data: {
                    nameUser: nameUser,
                    judulPenelitian: cekPenelitianTElahDIajukan.judul,
                    jabatan: "Mahasiswa",
                    tugasdlmPenlitian: tugasdlmPenlitian,
                    statusAkun: 0,
                    statusPartisipasi: 1
                }
            })

            await prisma.notification.create({
                data: {
                    nameUser: nameUser,
                    judulPenelitian: cekPenelitianTElahDIajukan.judul,
                    pesan: "Anda Terdaftar Pada Penelitian"
                }
            })
            
            
            return res.status(200).json(responseModel.success(200, dataCreatePartisiMahasiswa))
        }
    
        const CekJumlahAnggota = await prisma.partisipasiPenelitian.findMany({
            where: {
                judulPenelitian: cekPenelitianTElahDIajukan.judul,
                AND: {
                    NOT: {
                        jabatan: "Mahasiswa"
                    }
                },
                NOT: {
                    jabatan: "Ketua Pengusul",
                }
            }
        })

        console.log(CekJumlahAnggota)

        if (CekJumlahAnggota.length >= 2) {
            return res.status(404).json(responseModel.error(200, "Jumlah Anggota Dosen hanya 2"))
        }


        if (nameUser) {
            const CekUser = await prisma.PartisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: cekPenelitianTElahDIajukan.judul,
                    nameUser: nameUser
                }
            })

            if (CekUser.length !== 0) {
                return res.status(404).json(responseModel.error(200, "Dosen Sudah Ada"))
            }
            
        }
        
        if (jabatan) {
            const CekJabatan = await prisma.PartisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: cekPenelitianTElahDIajukan.judul,
                    jabatan: jabatan
                }
            })

            if (CekJabatan.length !== 0) {
                return res.status(404).json(responseModel.error(200, "Peran Sudah Ada"))
            }
        }


        const dataAnggotaPenelitianAfterCreate = await prisma.PartisipasiPenelitian.create({
            data: {
                nameUser: nameUser,
                judulPenelitian: cekPenelitianTElahDIajukan.judul,
                jabatan: jabatan,
                tugasdlmPenlitian: tugasdlmPenlitian,
                statusAkun: 1,
                statusPartisipasi: 0
            }
        })

        await prisma.notification.create({
            data: {
                nameUser: nameUser,
                judulPenelitian: cekPenelitianTElahDIajukan.judul,
                pesan: "Pemintaan Keanggotaan Penelitian"
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPenelitianAfterCreate))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByIdOnlyAnggotaPenelitian = async (req, res)  => {
    try{
        const {id} = req.params

        const dataAnggotaPenelian = await prisma.PartisipasiPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: {
                    include: {
                        jurusan: true,
                        prodi: true
                    }
                },
                penelitian: true
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPenelian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByNidsOnlyAnggotaPenelitian = async (req, res)  => {
    try{

        const {jabatan, tugasdlmPenlitian} = req.body
        const {id} = req.params
        const {judulPenelitian} = req.query
        const user = req.user[0]


        const data = {} 

        const cekPenelitianTElahDIajukan = await prisma.partisipasiPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true
            }
        })

        console.log(cekPenelitianTElahDIajukan.penelitian.statusPenelitian === 1 && user.roleId !== 1)

        // Validasi Edit Status Penelitian DI ajikan >>>
        if (user.roleId === 3) {     
            if (cekPenelitianTElahDIajukan.penelitian.statusPenelitian !== 0 && cekPenelitianTElahDIajukan.penelitian.statusRevisi === false) {
                return res.status(404).json(responseModel.error(404, "Penelitian Telah Diajukan Dan Sedang Tidak Direvisi"))
            }
        }


        
        if (jabatan) {

            const CekJabatan = await prisma.PartisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: cekPenelitianTElahDIajukan.penelitian.judul,
                    jabatan: jabatan
                }
            })

            console.log(CekJabatan[0], jabatan, judulPenelitian)

            if (CekJabatan[0].jabatan !== jabatan) {

                return res.status(404).json(responseModel.error(200, "Peran Sudah Ada"))
            }

            data.jabatan = jabatan
            data.tugasdlmPenlitian = tugasdlmPenlitian
        }else{
            data.tugasdlmPenlitian = tugasdlmPenlitian
        }


        const dataAnggotaPenelianAfterEdit = await prisma.PartisipasiPenelitian.update({
            where: {
                id: Number(id)
            },
            data: {
                jabatan: jabatan,
                tugasdlmPenlitian: tugasdlmPenlitian
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPenelianAfterEdit))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteByNidsOnlyAnggotaPenelitian = async (req, res)  => {
    try{

        const {id} = req.params
        const user = req.user[0]

        const cekPenelitianTElahDIajukan = await prisma.partisipasiPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true
            }
        })


        
        if (cekPenelitianTElahDIajukan.penelitian.statusPenelitian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Penelitian Telah Diajukan"))
        }

        await prisma.notification.create({
            data: {
                nameUser: cekPenelitianTElahDIajukan.nameUser,
                judulPenelitian: cekPenelitianTElahDIajukan.judulPenelitian,
                pesan: "Keanggotaan Penelitian Dibatalkan"
            }
        })

        const dataAnggotaPenelianAfterDelete = await prisma.partisipasiPenelitian.delete({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true
            }
        })


        return res.status(200).json(responseModel.success(200, dataAnggotaPenelianAfterDelete))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllOnlyAnggotaPenelitian,
    createOnlyAnggotaPenelitian,
    getByIdOnlyAnggotaPenelitian,
    updateByNidsOnlyAnggotaPenelitian,
    deleteByNidsOnlyAnggotaPenelitian
}