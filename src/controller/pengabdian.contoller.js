const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const pagination = require('../utility/pagenation')

const prisma = new PrismaClient()

const getAllAssesmentPengabdian = async (req, res) => {
    try{
        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)
        

        const options = {
            where: {
                statusPengabdian: 3
            },
            include:{
                reviewPengabdian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPengabdian: {
                    include: {
                        user: true
                    }
                },
                Dokumen: true
            },
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judul = {
                contains: searchJudul
            }
        }

        const getAllPengabdian = await prisma.pengabdian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getPengabdianForNilai = async(req, res) => {
    try{
        
        const {name, roleId} = req.user[0]
        let dataNilaiReviewerAndJudul = []
        let dataPengabdian = []

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {

            },
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judul = {
                contains: searchJudul
            }
        }

        if (roleId === 1) {
            dataPengabdian = await prisma.pengabdian.findMany({
                where:{
                    statusPengabdian: {in: [3,4,5,6,7]}
                },
                include: {
                    reviewPengabdian: true,
                }
            })

            console.log(dataPengabdian)
        }else{

            options.where.nameUser = name
    
            const getAllPartisiPengabdian = await prisma.partisipasiPengabdian.findMany(options)
    
    
            const judulParisipasi = [...getAllPartisiPengabdian.map(data => data.judulPengabdian)]

            // console.log(getAllPartisiPengabdian, options)

            dataPengabdian = await prisma.pengabdian.findMany({
                where:{
                    statusPengabdian: {in: [4,5,6,7]},
                    judul: {in: judulParisipasi}
                },
                include: {
                    reviewPengabdian: true,
                }
            })
        }

        dataPengabdian.map(async data => {

            const pengabdian = await prisma.pengabdian.findUnique({
                where: {
                    judul: data.judul
                }
            })

            const cekRataRataAndTotal = await prisma.nilaiPengabdian.groupBy({
                where: {
                    judulPengabdian:  data.judul
                },
                by: ['judulPengabdian', 'idReviewPengabdian'],
                _count: {
                    _all: true,
                    nilai: true,
                },
                _sum: {
                    nilai: true,
                },
                _avg: {
                    nilai: true
                },
                orderBy: {
                    judulPengabdian: 'desc',
                },
            })

            dataNilaiReviewerAndJudul.push({
                pengabdian: pengabdian,
                nilaiPengabdian: cekRataRataAndTotal
            })
        })
        
        setTimeout(() => {
            
            return res.status(200).json(responseModel.success(200, dataNilaiReviewerAndJudul))
        }, 100);






    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getPengabdianArrov = async(req,res) => {
    try{
        const {name} = req.user[0]

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }


        if (searchJudul) {
            options.where.judul = {
                contains: searchJudul
            }
        }

        options.where.statusPengabdian = 1
        
        options.include = {
            partisipasiPengabdian: {
                include: {
                    user: true
                }
            },
            reviewPengabdian: true,
            nilaiPengabdian: true
        }

        const getAllPengabdian = await prisma.pengabdian.findMany(options)

        console.log(getAllPengabdian)

        return res.status(200).json(responseModel.success(200, getAllPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllPengabdianByKapro = async(req, res) => {
    try{
        const {id_prodi, searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const dataUserSesuaiProdi = await prisma.user.findMany({
            where: {
                prodiId: Number(id_prodi),
                nim: null
            }
        })


        const nameUserByProdi = [...dataUserSesuaiProdi.map(data => data.name)]

        // return console.log(nameUserByProdi)

        const options = {
            where: {
                jabatan: "Ketua Pengusul",
                nameUser: {in: nameUserByProdi}
            },
            include:{
                user: true,
                pengabdian: {
                    include: {
                        reviewPengabdian: true,
                        partisipasiPengabdian: true,
                        Dokumen: true,
                        nilaiPengabdian: true
                    }
                }
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judulPengabdian = {
                contains: searchJudul
            }
        }

        const getAllPengabdian = await prisma.partisipasiPengabdian.findMany(options)

        console.log(getAllPengabdian)
        return res.status(200).json(responseModel.success(200, getAllPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByAllPengabdianForCatatanHarian = async (req, res) => {
    try{
        const {name, roleId} = req.user[0]
        const {statusPengabdian} = req.query
        const judulPengabdian = []

        const options = {
            where: {},
        }

        if (roleId === 1) {
            const getAllPengabdianByDibiayai = await prisma.pengabdian.findMany({
                where: {
                    statusPengabdian: Number(statusPengabdian)
                }
            })

            console.log(getAllPengabdianByDibiayai)

            return res.status(200).json(responseModel.success(200, getAllPengabdianByDibiayai))

        }


        if (statusPengabdian == 3) {
            options.where.statusPengabdian = Number(statusPengabdian)
        }

        const getAllPengabdianByDibiayai = await prisma.pengabdian.findMany(options)

        getAllPengabdianByDibiayai.map(data => {
            judulPengabdian.push(data.judul)
        })

        const getPartisipasiPegabdianByUsulanDibiayai = await prisma.partisipasiPengabdian.findMany({
            where: {    
                nameUser: {
                    contains: name
                },
                judulPengabdian: {in: judulPengabdian}
            },
            // include: {
            //     user: true,
            //     pengabdian: true
            // }
        })

        return res.status(200).json(responseModel.success(200, getPartisipasiPegabdianByUsulanDibiayai))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllPengabdianForLaporan = async (req, res) => {
    try{

        const {name, roleId} = req.user[0]
        const {statusPengabdian} = req.query
        const judulPengabdian = []

        const options = {
            where: {},
            // include:{
                // user: true,
                // partisipasiPengabdian: true
            // }
        }

        if (roleId === 1) {
            const getAllPengabdianByDibiayai = await prisma.pengabdian.findMany({
                where: {
                    statusPengabdian: Number(statusPengabdian)
                }
            })

            console.log(getAllPengabdianByDibiayai)

            return res.status(200).json(responseModel.success(200, getAllPengabdianByDibiayai))

        }


        if (statusPengabdian == 5) {
            options.where.statusPengabdian = Number(statusPengabdian)
        }

        const getAllPengabdianByDibiayai = await prisma.pengabdian.findMany(options)

        getAllPengabdianByDibiayai.map(data => {
            judulPengabdian.push(data.judul)
        })

        const getPartisipasiPeneltianByUsulanDibiayai = await prisma.partisipasiPengabdian.findMany({
            where: {    
                nameUser: {
                    contains: name
                },
                jabatan: "Ketua Pengusul",
                judulPengabdian: {in: judulPengabdian}
            },
            // include: {
            //     user: true,
            //     pengabdian: true
            // }
        })

        return res.status(200).json(responseModel.success(200, getPartisipasiPeneltianByUsulanDibiayai))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllKeangotaanPengabdian = async (req, res) => {
    try{
        const {name} = req.user[0]
        const judulPengabdian = []

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {
                NOT: {
                    jabatan: "Ketua Pengusul"
                },
                nameUser: {
                    contains: name
                }
            },
            include:{
                user: true,
                pengabdian: {
                    include: {
                        reviewPengabdian: true,
                        partisipasiPengabdian: true,
                        Dokumen: true,
                        nilaiPengabdian: true
                    }
                }
            },
            skip: page,
            take: row,
        }


        if (searchJudul) {
            options.where.judulPengabdian = {
                contains: searchJudul
            }
        }

        const getAllPengabdian = await prisma.PartisipasiPengabdian.findMany(options)

        getAllPengabdian.map((data) => {
            judulPengabdian.push(data.judulPengabdian)
        })

        
        
        
        const getKetuaPengabdian = await prisma.partisipasiPengabdian.findMany({
            where: {
                judulPengabdian: {
                    in: judulPengabdian,  
                },
                jabatan : "Ketua Pengusul"
            },
            include: {
                user: true,
                pengabdian: true
            }
        })
        
        console.log(getAllPengabdian)
        const pushKetuaPengabdianInPengabdian = []

        getAllPengabdian.map((data, index) => {
            getAllPengabdian[index].DataKetuaPengabdian = getKetuaPengabdian[index]
        })
        

        return res.status(200).json(responseModel.success(200, getAllPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const UpdateStatusPartisiPasiPengabdian = async (req, res) => {
    try{
        const {id} = req.params
        const {statusPartisipasi, judul} = req.body

        
        if (statusPartisipasi === 2) {
            const getDeleteStatusPartisiPengabdianUser = await prisma.partisipasiPengabdian.delete({
                where: {
                    id: Number(id)
                }
            })

            return res.status(200).json(responseModel.success(200, getDeleteStatusPartisiPengabdianUser))
        }


        const getAllPengabdian = await prisma.PartisipasiPengabdian.findMany({
            where: {
                judulPengabdian:  judul,
                statusPartisipasi: 0
            },
        })

        const getPartisiPengabdianByKetua = await prisma.PartisipasiPengabdian.findMany({
            where: {
                judulPengabdian:  judul,
                jabatan: 'Ketua Pengusul'
            },
        })


        // return console.log(getPartisiPengabdianByKetua)


        const getEditStatusPartisipasiPengabdianUser =await prisma.partisipasiPengabdian.update({
            where: {
                id: Number(id)
            },
            data: {
                statusPartisipasi: Number(statusPartisipasi)
            }
        })


        // console.log(getEditStatusPartisipasiPengabdianUser)

        await prisma.notification.create({
            data: {
                nameUser: getPartisiPengabdianByKetua[0].nameUser,
                judulPengabdian: judul,
                pesan: `${getEditStatusPartisipasiPengabdianUser.jabatan} Telah Menerima Persetujuan Pengabdian`
            }
        })

        return res.status(200).json(responseModel.success(200, getEditStatusPartisipasiPengabdianUser))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getStatisticByUser = async (req,res) => {
    try{

        const {name} = req.user[0]

        const year = ["2022", "2023", "2024", "2025"]

        const options = {
            where: {}
        }

        if (req.user[0].roleId !== 1) {
            options.where.nameUser = {
                contains: name
            }
        }

        if (req.user[0].roleId === 1) {
            options.where.jabatan = "Ketua Pengusul"
        }

        const getAllPengabdianByTahun = await prisma.partisipasiPengabdian.findMany(options)

        let jumlah = [0,0,0,0]
        
        getAllPengabdianByTahun.filter((data) => {
            year.filter((key, i) => {
                if (key === String(data.createdAt.getFullYear())) {
                    return jumlah[i] += 1
                } 
            })
        })

        console.log(jumlah)

        return res.status(200).json(responseModel.success(200, jumlah))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllDiajukanPengabdian = async (req, res) => {
    try{
        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)
        

        const options = {
            where: {
                statusPengabdian: 1
            },
            include:{
                reviewPengabdian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPengabdian: {
                    include: {
                        user: true
                    }
                },
                Dokumen: true
            },
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judul = {
                contains: searchJudul
            }
        }

        const getAllPengabdian = await prisma.pengabdian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllPengusulPengabdian = async (req, res) => {
    try{

        const {name} = req.user[0]

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {
                jabatan: "Ketua Pengusul"
            },
            include:{
                user: true,
                pengabdian: {
                    include: {
                        reviewPengabdian: true,
                        partisipasiPengabdian: true,
                        Dokumen: true,
                        nilaiPengabdian: true
                    }
                }
            },
            skip: page,
            take: row,
        }

        if (req.user[0].roleId !== 1) {
            options.where.nameUser = {
                contains: name
            }
        }

        if (searchJudul) {
            options.where.judulPengabdian = {
                contains: searchJudul
            }
        }

        if (req.query?.statusRevisi === 'true') {
            options.where.statusRevisi = true
        }


        const getAllPengabdian = await prisma.partisipasiPengabdian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllLolosPengabdian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPengabdian = []

        const options = {
            where: {},
            include: {
                pengabdian: true
            }
        }

        if (roleId === 1) {
            options.where.jabatan = "Ketua Pengusul"
        }

        if (roleId !== 1) {
            options.where.nameUser = {
                contains: name
            }
        }

        const cekStatusPengabdian = await prisma.partisipasiPengabdian.findMany(options)


        cekStatusPengabdian.map((data) => {
            judulPengabdian.push(data.judulPengabdian)
        })

        const cekDataPengabdianLolos = await prisma.pengabdian.findMany({
            where: {
                judul: {in: judulPengabdian},
                statusPengabdian: 3
            }
        })
        
        console.log(cekDataPengabdianLolos)

        return res.status(200).json(responseModel.success(200, cekDataPengabdianLolos))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllSeleksiPengabdian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPengabdian = []

        const options = {
            where: {},
            include: {
                pengabdian: true
            }
        }

        if (roleId === 1) {
            options.where.jabatan = "Ketua Pengusul"
        }

        if (roleId !== 1) {
            options.where.nameUser = {
                contains: name
            }
        }

        const cekStatusPengabdian = await prisma.partisipasiPengabdian.findMany(options)


        cekStatusPengabdian.map((data) => {
            judulPengabdian.push(data.judulPengabdian)
        })

        const cekDataPengabdianSeleksi = await prisma.pengabdian.findMany({
            where: {
                judul: {in: judulPengabdian},
                statusPengabdian: 1
            }
        })
        
        console.log(cekDataPengabdianSeleksi)

        return res.status(200).json(responseModel.success(200, cekDataPengabdianSeleksi))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllDitolakPengabdian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPengabdian = []

        const options = {
            where: {},
            include: {
                pengabdian: true
            }
        }

        if (roleId === 1) {
            options.where.jabatan = "Ketua Pengusul"
        }

        if (roleId !== 1) {
            options.where.nameUser = {
                contains: name
            }
        }

        const cekStatusPengabdian = await prisma.partisipasiPengabdian.findMany(options)


        cekStatusPengabdian.map((data) => {
            judulPengabdian.push(data.judulPengabdian)
        })

        const cekDataPengabdianDitolak = await prisma.pengabdian.findMany({
            where: {
                judul: {in: judulPengabdian},
                statusPengabdian: 2
            }
        })
        
        console.log(cekDataPengabdianDitolak)

        return res.status(200).json(responseModel.success(200, cekDataPengabdianDitolak))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByAllPengabdian = async (req, res) => {
    try{

        const {name} = req.user[0]

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }


        if (searchJudul) {
            options.where.judul = {
                contains: searchJudul
            }
        }

        if (req.user[0].roleId === 1) {

            options.where.NOT = {statusPengabdian : 0}

            options.include = {
                partisipasiPengabdian: {
                    include: {
                        user: true
                    }
                },
                reviewPengabdian: true,
                nilaiPengabdian: true
            }

            const getAllPengabdian = await prisma.pengabdian.findMany(options)
    
            return res.status(200).json(responseModel.success(200, getAllPengabdian))
            
        }


        options.where.nameUser = name

        options.include = {
            user: true,
            pengabdian: {
                include: {
                    reviewPengabdian: true,
                    nilaiPengabdian: true
                }
            }
        }


        const getAllPengabdian = await prisma.partisipasiPengabdian.findMany(options)


        return res.status(200).json(responseModel.success(200, getAllPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdPengabdian = async (req, res, next) => {
    try{

        const idPengabdian = req.params.id

        const getByIdPengabdian = await prisma.pengabdian.findUnique({
            where: {
                id: Number(idPengabdian)
            },
            include: {
                partisipasiPengabdian: {
                    include: {
                        user: true,
                    }
                },
                Dokumen: true
            }
        })

        return res.status(200).json(responseModel.success(200, getByIdPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createPengabdiann = async (req, res) => {
    try{ 

        const {judul, skema, abstrak, temaBidangFokus, bidangFokus, ruangLingkup, lamaKegiatan, DataAnggotaDosen, DataAnggotaMahasiswa} = req.body
        const user = req.user[0]
        const nemeMhasiswa = []


        // return console.log(DataAnggotaDosen, DataAnggotaMahasiswa)

        DataAnggotaDosen.map((data, i) => {
            data.statusAkun = Number(data.statusAkun)
            data.statusPartisipasi = Number(data.statusPartisipasi)
        })

        
        const valuesIsYes = []
        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {

            DataAnggotaMahasiswa.map(async (data) => {
                if (data.nameUser) {
                    nemeMhasiswa.push(data.nameUser)
                }
            })

            // Cek User Jika Mahasiswa Jika Sudah Terdaftar
            const cekUserMahasiswa = await prisma.user.findMany({
                where: {
                    name: {
                        in : nemeMhasiswa
                    } 
                }
            })
    
            cekUserMahasiswa.map((name) => {
                valuesIsYes.push(name.name)
            })
            
        }

        

        const dataNot = []

        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {

            let newDataNotDaftar = DataAnggotaMahasiswa.filter((data) => {
                const redy = valuesIsYes.includes(data.nameUser)
                if (redy === false) {
                    return dataNot.push(data)
                }
            })


            if (newDataNotDaftar.length > 0) {
                
                const updateNewDataNotDaftar = newDataNotDaftar.map((data) => ({nim: data.nim, name: data.nameUser, username: `${data.nameUser}_test`, roleId: 4, password: "mahasiswatest"}))
                
                
                await prisma.User.createMany({
                    data: updateNewDataNotDaftar
                })
            }
        }

        

        DataAnggotaDosen.map((Tes) => {
            return Tes.judulPengabdian = judul
        })


        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {
        
            DataAnggotaMahasiswa.map((Tes) => {
                return Tes.judulPengabdian = judul
            })
        }
        
        DataAnggotaDosen.map((tes) => {
            delete tes.nidn
        })
        
        const dataPengabdian = {
            judul: judul,
            skema: skema,
            abstrak: abstrak,
            temaBidangFokus: temaBidangFokus,
            bidangFokus: bidangFokus,
            ruangLingkup: ruangLingkup,
            lamaKegiatan: lamaKegiatan,
            statusPengabdian: 0,
            statusRevisi: false
        }

        
        const pengabdian = await prisma.pengabdian.create({
            data: dataPengabdian
        })
        
        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/usulanPengabdian"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Usulan Proposal",
                nameUser: user.name,
                idPengabdian: pengabdian.id,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            await prisma.dokumen.create({
                data: options
            })

        }
        
        await prisma.partisipasiPengabdian.createMany({
            data: DataAnggotaDosen
        })

        const dataNotificationDosen =  DataAnggotaDosen.map(data => {
            if (data.jabatan !== "Ketua Pengusul") {
                return {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    pesan: "Permintaan Keanggotaan Pengabdian"
                } 
            }

        })

        await prisma.Notification.createMany({
            data: dataNotificationDosen
        })

        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {

            const newDataPartisipasiMahasiswa = DataAnggotaMahasiswa.map((data) => ({
                nameUser: data.nameUser,
                judulPengabdian: data.judulPengabdian,
                jabatan: "Mahasiswa",
                tugasdlmPengabdian: data.tugasdlmPengabdian,
                statusAkun: 0,
                statusPartisipasi: 1
            }))


            const dataNotificationMahasiswa =  DataAnggotaMahasiswa.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    pesan: "Anda Terdaftar Pada Pengabdian"
                }
            })
            
            await prisma.partisipasiPengabdian.createMany({
                data: newDataPartisipasiMahasiswa
            })


            await prisma.Notification.createMany({
                data: dataNotificationMahasiswa
            })
        }

        return res.status(201).json(responseModel.success(201, pengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const updatePengabdian = async (req, res, next) => {
    try{

        const {id} = req.params
        const {judul, skema, abstrak, temaBidangFokus, bidangFokus, ruangLingkup, lamaKegiatan, DataAnggotaDosen, DataAnggotaMahasiswa,  statusPengabdian, statusDibiayai} = req.body
        const user = req.user[0]

        if (statusDibiayai == true) {

            console.log(statusDibiayai)
            const idDobiayai = []
            const judulUpdate = []
            
            const cekRevisi = await prisma.reviewPengabdian.findMany({
                where: {
                    revisi: null
                }
            })
            
            cekRevisi.map((data, i) => {
                idDobiayai.push(data.id)
            })

            
            const cekStatusPengabdianDIbiayai = await prisma.nilaiPengabdian.groupBy({
                where: {
                    idReviewPengabdian: {in: idDobiayai}
                },
                by: ['judulPengabdian'],
                _count: {
                    _all: true,
                    nilai: true,
                },
                _sum: {
                    nilai: true,
                },
                _avg: {
                    nilai: true
                },
                orderBy: {
                    judulPengabdian: 'desc',
                },
                having: {
                    nilai: {
                      _avg: {
                        gt: 75,
                      },
                    },
                  },
            })

            cekStatusPengabdianDIbiayai.map((data) => {
                judulUpdate.push(data.judulPengabdian)
            })

            
            const updateStatusPengabdianDibiayai = await prisma.pengabdian.updateMany({
                where: {
                    judul: {in: judulUpdate}
                },
                data: {
                    statusPengabdian: 5
                }
            })


            const updateStatusPengabdianGagalDibiayai = await prisma.pengabdian.updateMany({
                where: {
                    judul: {notIn: judulUpdate}
                },
                data: {
                    statusPengabdian: 4
                }
            })

            const cekpartisipengabdianDibiayai = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: {in: judulUpdate}
                }
            })

            const cekpartisipengabdianGagalbiayai = await prisma.partisipasiPengabdian.findMany({
                where: {
                    judulPengabdian: {notIn: judulUpdate}
                }
            })

            const dataNotificationDibiayai = cekpartisipengabdianDibiayai.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    pesan: "Pengabdian Kalian Dibiayai"
                }
            })

            const dataNotificationNotbiayai = cekpartisipengabdianGagalbiayai.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    pesan: "Pengabdian Kalian Tidak Dibiayai"
                }
            })

            await prisma.Notification.createMany({
                data: dataNotificationDibiayai
            })

            await prisma.Notification.createMany({
                data: dataNotificationNotbiayai
            })


            return res.status(201).json(responseModel.success(201, cekStatusPengabdianDIbiayai))

        }else{
            const getStatusPengabdianDiajuakn = await prisma.pengabdian.findUnique({
                where: {
                    id: Number(id)
                }
            })

            // Validasi Edit Status Pengabdian DI ajikan >>>
            if (user.roleId === 3) {        
                if (getStatusPengabdianDiajuakn.statusPengabdian === 1 && getStatusPengabdianDiajuakn.statusRevisi === false) {
                    return res.status(404).json(responseModel.error(404, "Pengabdian Telah Diajukan Dan Sedang Tidak Direvisi"))
                }
            }
            
    
            if (statusPengabdian === 1) {
               
    
                const cekPartisiPengabdianBelumSetuju = await prisma.partisipasiPengabdian.findMany({
                    where: {
                        judulPengabdian: getStatusPengabdianDiajuakn.judul,
                        statusPartisipasi: 0,
                        statusAkun: 1
                    }
                })
    
                if (cekPartisiPengabdianBelumSetuju.length > 0) {
    
                    let nama = ""
                    let jabatan = ""
    
                    cekPartisiPengabdianBelumSetuju.map((data) => {
                        nama = data.nameUser
                        jabatan = data.jabatan 
                    })
    
    
                    return res.status(404).json(responseModel.error(404, `${nama} ${jabatan} Belum Menyetujui`))
                }
    
                const pengabdianUpdateStatus = await prisma.pengabdian.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        statusPengabdian: statusPengabdian
                    }
                })
    
    
                return res.status(201).json(responseModel.success(201, pengabdianUpdateStatus))
                
            }

            if (statusPengabdian === 2) {
    
                const pengabdianUpdateStatus = await prisma.Pengabdian.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        statusPengabdian: statusPengabdian
                    }
                })
    
    
                return res.status(201).json(responseModel.success(201, pengabdianUpdateStatus))
                
            }
    
            if (statusDibiayai == true) {
    
                const cekRevisi = await prisma.reviewPengabdian.findMany({
                    where: {
                        revisi: null,
                    }
                })

            }
            
            const dataPengabdian = {
                judul: judul,
                skema: skema,
                abstrak: abstrak,
                temaBidangFokus: temaBidangFokus,
                bidangFokus: bidangFokus,
                ruangLingkup: ruangLingkup,
                lamaKegiatan: lamaKegiatan,
            }
    
    
            if (req.file !== undefined) {
    
                const optionsCloudinary =  {
                    folder: "P3MPolimdo/PDF/usulanPengabdian"
                }
    
                const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)
    
                const {public_id,secure_url} = UploadPDF
    
                const options = {
                    name: "Usulan Proposal",
                    nameUser: user.name,
                    idPengabdian: Number(id),
                    urlPdf: secure_url,
                    pdf_id: public_id,
                    namePdf: req.file.originalname
                }
    
                const cekDataDokumenPengabdian = await prisma.dokumen.findMany({
                    where: {
                        name: options.name,
                        nameUser: user.name,
                        idPengabdian: Number(id),
                    }
                })
    
                if (cekDataDokumenPengabdian.length !== 0) {
                    await prisma.dokumen.update({
                        where: {
                            id: cekDataDokumenPengabdian[0]?.id
                        },
                        data: options
                    })
                }else{
                    await prisma.dokumen.create({
                        data: options
                    })

                    dataPengabdian.statusPengabdian = 3

                }
    
    
            }
            
            console.log(getStatusPengabdianDiajuakn)
            
            const pengabdian = await prisma.pengabdian.update({
                where: {
                    id: Number(id)
                },
                data: dataPengabdian
            })

    
            return res.status(201).json(responseModel.success(201, pengabdian))
        }

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deletePengabdian = async (req, res, next) => {
    try{

        const {id} = req.params
        const user = req.user[0]


        const getpengabdiandelete = await prisma.Pengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include : {
                partisipasiPengabdian: true,
                Dokumen: true,
                reviewPengabdian: true,
                notification: true
            }
        })

        if (getpengabdiandelete.statusPengabdian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Pengabdian Telah Diajukan"))
        }

        const name = getpengabdiandelete.judul

        if (getpengabdiandelete?.Dokumen?.length !== 0) {
    
    
            await prisma.dokumen.delete({
                where: {
                    id: getpengabdiandelete.Dokumen[0].id
                }
            })
        }

        if (getpengabdiandelete?.partisipasiPengabdian.length !== 0 ) {     
            await prisma.partisipasiPengabdian.deleteMany({
                where: {
                    judulPengabdian: name
                },
            })
        }

        if (getpengabdiandelete?.notification.length !== 0 ) {     
            await prisma.notification.deleteMany({
                where: {
                    judulPengabdian: name
                },
            })
        }
        
        if (getpengabdiandelete?.reviewPengabdian.length !== 0) {

            await prisma.nilaiPengabdian.deleteMany({
                where: {
                    idReviewPengabdian: getpengabdiandelete?.reviewPengabdian.id
                }
            })
            
            await prisma.reviewPengabdian.deleteMany({
                where: {
                    judulPengabdian: name
                },
            })
        }

        const deletePengabdian = await prisma.Pengabdian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, deletePengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllAssesmentPengabdian,
    getPengabdianForNilai,
    getPengabdianArrov,
    getAllPengabdianByKapro,
    getByAllPengabdianForCatatanHarian,
    getByAllPengabdianForLaporan,
    getAllDiajukanPengabdian,
    getAllKeangotaanPengabdian,
    UpdateStatusPartisiPasiPengabdian,
    getStatisticByUser,
    getAllPengusulPengabdian,
    getByAllPengabdian,
    getByIdPengabdian,
    createPengabdiann,
    updatePengabdian,
    deletePengabdian,
    getAllLolosPengabdian,
    getAllSeleksiPengabdian,
    getAllDitolakPengabdian
}