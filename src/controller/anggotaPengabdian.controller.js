const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getAllOnlyAnggotaPengabdian = async (req, res) => {
    try{
        const {judul} = req.query

        const getAllPartisipasiPengabdianDosen = await prisma.partisipasiPengabdian.findMany({
            where: {
                judulPengabdian: {
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
                pengabdian: true
            }
        })

        const getAllPartisipasiPengabdianMahasiwa = await prisma.partisipasiPengabdian.findMany({
            where: {
                judulPengabdian: {
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
                pengabdian: true
            }
        })

        const dataResultPartisiPengabdian = [
            getAllPartisipasiPengabdianDosen,
            getAllPartisipasiPengabdianMahasiwa
        ]
        

        return res.status(200).json(responseModel.success(200, dataResultPartisiPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdOnlyAnggotaPengabdian = async (req, res)  => {
    try{
        const {id} = req.params

        const dataAnggotaPengabdian = await prisma.partisipasiPengabdian.findUnique({
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
                pengabdian: true
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createOnlyAnggotaPengabdian = async (req, res)  => {
    try{
        
        const {nameUser, nim, jurusan, prodi, judulPengabdian, jabatan, tugasdlmPengabdian, role, idPengabdian} = req.body
        const user = req.user[0]

        
        const cekPengabdianTElahDIajukan = await prisma.pengabdian.findUnique({
            where: {
                id: Number(idPengabdian)
            }
        })

        
        if (cekPengabdianTElahDIajukan?.statusPengabdian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Pengabdian Telah Diajukan"))
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


            const CekJumlahAnggota = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: cekPengabdianTElahDIajukan.judul,
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
                const CekUser = await prisma.partisipasiPengabdian.findMany({
                    where: {
                        judulPengabdian: cekPengabdianTElahDIajukan.judul,
                        nameUser: nameUser
                    }
                })
    
                if (CekUser.length !== 0) {
                    return res.status(404).json(responseModel.error(200, "Mahasiswa Sudah Ada"))
                }
                
            }
            
            
            const dataCreatePartisiMahasiswa = await prisma.partisipasiPengabdian.create({
                data: {
                    nameUser: nameUser,
                    judulPengabdian: cekPengabdianTElahDIajukan.judul,
                    jabatan: "Mahasiswa",
                    tugasdlmPengabdian: tugasdlmPengabdian,
                    statusAkun: 0,
                    statusPartisipasi: 1
                }
            })

            await prisma.notification.create({
                data: {
                    nameUser: nameUser,
                    judulPengabdian: cekPengabdianTElahDIajukan.judul,
                    pesan: "Anda Terdaftar Pada Pengabdian"
                }
            })
            
            
            return res.status(200).json(responseModel.success(200, dataCreatePartisiMahasiswa))
        }
    
        const CekJumlahAnggota = await prisma.partisipasiPengabdian.findMany({
            where: {
                judulPengabdian: cekPengabdianTElahDIajukan.judul,
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
            const CekUser = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: cekPengabdianTElahDIajukan.judul,
                    nameUser: nameUser
                }
            })

            if (CekUser.length !== 0) {
                return res.status(404).json(responseModel.error(200, "Dosen Sudah Ada"))
            }
            
        }
        
        if (jabatan) {
            const CekJabatan = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: cekPengabdianTElahDIajukan.judul,
                    jabatan: jabatan
                }
            })

            if (CekJabatan.length !== 0) {
                return res.status(404).json(responseModel.error(200, "Peran Sudah Ada"))
            }
        }


        const dataAnggotaPengabdianAfterCreate = await prisma.partisipasiPengabdian.create({
            data: {
                nameUser: nameUser,
                judulPengabdian: cekPengabdianTElahDIajukan.judul,
                jabatan: jabatan,
                tugasdlmPengabdian: tugasdlmPengabdian,
                statusAkun: 1,
                statusPartisipasi: 0
            }
        })

        await prisma.notification.create({
            data: {
                nameUser: nameUser,
                judulPengabdian: cekPengabdianTElahDIajukan.judul,
                pesan: "Pemintaan Keanggotaan Pengabdian"
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPengabdianAfterCreate))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const updateByNidsOnlyAnggotaPengabdian = async (req, res)  => {
    try{

        const {jabatan, tugasdlmPengabdian} = req.body
        const {id} = req.params
        const {judulPengabdian} = req.query
        const user = req.user[0]


        const data = {} 

        const cekPengabdianTElahDIajukan = await prisma.partisipasiPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                pengabdian: true
            }
        })

        console.log(cekPengabdianTElahDIajukan.pengabdian.statusPengabdian === 1 && user.roleId !== 1)

        // Validasi Edit Status Pengabdian DI ajikan >>>
        if (user.roleId === 3) {     
            if (cekPengabdianTElahDIajukan.pengabdian.statusPengabdian !== 0 && cekPengabdianTElahDIajukan.pengabdian.statusRevisi === false) {
                return res.status(404).json(responseModel.error(404, "Pengabdian Telah Diajukan Dan Sedang Tidak Direvisi"))
            }
        }


        
        if (jabatan) {

            const CekJabatan = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: cekPengabdianTElahDIajukan.pengabdian.judul,
                    jabatan: jabatan
                }
            })

            console.log(CekJabatan[0], jabatan, judulPengabdian)

            if (CekJabatan[0].jabatan !== jabatan) {

                return res.status(404).json(responseModel.error(200, "Peran Sudah Ada"))
            }

            data.jabatan = jabatan
            data.tugasdlmPengabdian = tugasdlmPengabdian
        }else{
            data.tugasdlmPengabdian = tugasdlmPengabdian
        }


        const dataAnggotaPengabdianAfterEdit = await prisma.partisipasiPengabdian.update({
            where: {
                id: Number(id)
            },
            data: {
                jabatan: jabatan,
                tugasdlmPengabdian: tugasdlmPengabdian
            }
        })

        return res.status(200).json(responseModel.success(200, dataAnggotaPengabdianAfterEdit))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteByNidsOnlyAnggotaPengabdian = async (req, res)  => {
    try{

        const {id} = req.params
        const user = req.user[0]

        const cekPengabdianTElahDIajukan = await prisma.partisipasiPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                pengabdian: true
            }
        })


        
        if (cekPengabdianTElahDIajukan.pengabdian.statusPengabdian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Pengabdian Telah Diajukan"))
        }

        await prisma.notification.create({
            data: {
                nameUser: cekPengabdianTElahDIajukan.nameUser,
                judulPengabdian: cekPengabdianTElahDIajukan.judulPengabdian,
                pesan: "Keanggotaan Pengabdian Dibatalkan"
            }
        })

        const dataAnggotaPengabdianAfterDelete = await prisma.partisipasiPengabdian.delete({
            where: {
                id: Number(id)
            },
            include: {
                pengabdian: true
            }
        })


        return res.status(200).json(responseModel.success(200, dataAnggotaPengabdianAfterDelete))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllOnlyAnggotaPengabdian,
    getByIdOnlyAnggotaPengabdian,
    createOnlyAnggotaPengabdian,
    updateByNidsOnlyAnggotaPengabdian,
    deleteByNidsOnlyAnggotaPengabdian
}