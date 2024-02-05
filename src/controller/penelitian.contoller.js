const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const getAllAssesmentPenelitian = async (req, res) => {
    try{
        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)
        

        const options = {
            where: {
                statusPenelitian: 3
            },
            include:{
                reviewPenelitian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPenelitian: {
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

        const getAllPenelitian = await prisma.penelitian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getPenelitianForNilai = async(req, res) => {
    try{
        
        const {name, roleId} = req.user[0]
        let dataNilaiReviewerAndJudul = []
        let dataPenelitian = []

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
            dataPenelitian = await prisma.penelitian.findMany({
                where:{
                    statusPenelitian: {in: [3,4,5,6,7]}
                },
                include: {
                    reviewPenelitian: true,
                }
            })

            console.log(dataPenelitian)
        }else{

            options.where.nameUser = name
    
            const getAllPartisiPenelitian = await prisma.partisipasiPenelitian.findMany(options)
    
    
            const judulParisipasi = [...getAllPartisiPenelitian.map(data => data.judulPenelitian)]

            // console.log(getAllPartisiPenelitian, options)

            dataPenelitian = await prisma.penelitian.findMany({
                where:{
                    statusPenelitian: {in: [4,5,6,7]},
                    judul: {in: judulParisipasi}
                },
                include: {
                    reviewPenelitian: true,
                }
            })
        }

        dataPenelitian.map(async data => {

            const penelitian = await prisma.penelitian.findUnique({
                where: {
                    judul: data.judul
                }
            })

            const cekRataRataAndTotal = await prisma.nilaiPenelitian.groupBy({
                where: {
                    judulPenelitian:  data.judul
                },
                by: ['judulPenelitian', 'idReviewPenelitian'],
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
                    judulPenelitian: 'desc',
                },
            })

            dataNilaiReviewerAndJudul.push({
                penelitian: penelitian,
                nilaiPenelitian: cekRataRataAndTotal
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

const getPenelitianArrov = async(req,res) => {
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

        options.where.statusPenelitian = 1
        
        options.include = {
            partisipasiPenelitian: {
                include: {
                    user: true
                }
            },
            reviewPenelitian: true,
            nilaiPenelitian: true
        }

        const getAllPenelitian = await prisma.penelitian.findMany(options)

        console.log(getAllPenelitian)

        return res.status(200).json(responseModel.success(200, getAllPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllPenelitianByKapro = async(req, res) => {
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
                penelitian: {
                    include: {
                        reviewPenelitian: true,
                        partisipasiPenelitian: true,
                        Dokumen: true,
                        nilaiPenelitian: true
                    }
                }
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judulPenelitian = {
                contains: searchJudul
            }
        }

        const getAllPenelitian = await prisma.partisipasiPenelitian.findMany(options)

        console.log(getAllPenelitian)
        return res.status(200).json(responseModel.success(200, getAllPenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByAllPenelitianForCatatanHarian = async (req, res) => {
    try{
        const {name, roleId} = req.user[0]
        const {statusPenelitian} = req.query
        const judulPenelitian = []

        const options = {
            where: {},
        }

        if (roleId === 1) {
            const getAllPenelitianByDibiayai = await prisma.penelitian.findMany({
                where: {
                    statusPenelitian: Number(statusPenelitian)
                }
            })

            console.log(getAllPenelitianByDibiayai)

            return res.status(200).json(responseModel.success(200, getAllPenelitianByDibiayai))

        }


        if (statusPenelitian == 5) {
            options.where.statusPenelitian = Number(statusPenelitian)
        }

        const getAllPenelitianByDibiayai = await prisma.penelitian.findMany(options)

        getAllPenelitianByDibiayai.map(data => {
            judulPenelitian.push(data.judul)
        })

        const getPartisipasiPeneltianByUsulanDibiayai = await prisma.partisipasiPenelitian.findMany({
            where: {    
                nameUser: {
                    contains: name
                },
                judulPenelitian: {in: judulPenelitian}
            },
            // include: {
            //     user: true,
            //     penelitian: true
            // }
        })

        return res.status(200).json(responseModel.success(200, getPartisipasiPeneltianByUsulanDibiayai))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllPenelitianForLaporan = async (req, res) => {
    try{

        const {name, roleId} = req.user[0]
        const {statusPenelitian} = req.query
        const judulPenelitian = []

        const options = {
            where: {},
            // include:{
                // user: true,
                // partisipasiPenelitian: true
                // }
            }
            
            if (roleId === 1) {
                const getAllPenelitianByDibiayai = await prisma.penelitian.findMany({
                    where: {
                        statusPenelitian: Number(statusPenelitian)
                    }
                })
                
                
                return res.status(200).json(responseModel.success(200, getAllPenelitianByDibiayai))
                
            }
            
            
            if (statusPenelitian == 5) {
                options.where.statusPenelitian = Number(statusPenelitian)
            }
            
            const getAllPenelitianByDibiayai = await prisma.penelitian.findMany(options)
            
            console.log(getAllPenelitianByDibiayai)
            getAllPenelitianByDibiayai.map(data => {
                judulPenelitian.push(data.judul)
            })

        const getPartisipasiPeneltianByUsulanDibiayai = await prisma.partisipasiPenelitian.findMany({
            where: {    
                nameUser: {
                    contains: name
                },
                jabatan: "Ketua Pengusul",
                judulPenelitian: {in: judulPenelitian}
            },
            // include: {
            //     user: true,
            //     penelitian: true
            // }
        })

        console.log(getPartisipasiPeneltianByUsulanDibiayai)

        return res.status(200).json(responseModel.success(200, getPartisipasiPeneltianByUsulanDibiayai))

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

        const getAllPenelitianByTahun = await prisma.PartisipasiPenelitian.findMany(options)

        let jumlah = [0,0,0,0]
        
        getAllPenelitianByTahun.filter((data) => {
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

const getAllDiajukanPenelitian = async (req, res) => {
    try{
        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)
        

        const options = {
            where: {
                statusPenelitian: 2
            },
            include:{
                reviewPenelitian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPenelitian: {
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

        const getAllPenelitian = await prisma.penelitian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllPengusulPenelitian = async (req, res) => {
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
                penelitian: {
                    include: {
                        reviewPenelitian: true,
                        partisipasiPenelitian: true,
                        Dokumen: true,
                        nilaiPenelitian: true
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
            options.where.judulPenelitian = {
                contains: searchJudul
            }
        }

        if (req.query?.statusRevisi === 'true') {
            options.where.statusRevisi = true
        }


        const getAllPenelitian = await prisma.partisipasiPenelitian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllLolosPenelitian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPenelitian = []

        const options = {
            where: {},
            include: {
                penelitian: true
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

        const cekStatusPenelitian = await prisma.partisipasiPenelitian.findMany(options)


        cekStatusPenelitian.map((data) => {
            judulPenelitian.push(data.judulPenelitian)
        })

        const cekDataPenelitianLolos = await prisma.penelitian.findMany({
            where: {
                judul: {in: judulPenelitian},
                statusPenelitian: 3
            }
        })
        
        console.log(cekDataPenelitianLolos)

        return res.status(200).json(responseModel.success(200, cekDataPenelitianLolos))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllSeleksiPenelitian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPenelitian = []

        const options = {
            where: {},
            include: {
                penelitian: true
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

        const cekStatusPenelitian = await prisma.partisipasiPenelitian.findMany(options)


        cekStatusPenelitian.map((data) => {
            judulPenelitian.push(data.judulPenelitian)
        })

        const cekDataPenelitianSeleksi = await prisma.penelitian.findMany({
            where: {
                judul: {in: judulPenelitian},
                statusPenelitian: 1
            }
        })
        
        console.log(cekDataPenelitianSeleksi)

        return res.status(200).json(responseModel.success(200, cekDataPenelitianSeleksi))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllDitolakPenelitian = async (req, res) => {
    try{

        const {roleId, name} = req.user[0]
        const judulPenelitian = []

        const options = {
            where: {},
            include: {
                penelitian: true
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

        const cekStatusPenelitian = await prisma.partisipasiPenelitian.findMany(options)


        cekStatusPenelitian.map((data) => {
            judulPenelitian.push(data.judulPenelitian)
        })

        const cekDataPenelitianDitolak = await prisma.penelitian.findMany({
            where: {
                judul: {in: judulPenelitian},
                statusPenelitian: 2
            }
        })
        
        console.log(cekDataPenelitianDitolak)

        return res.status(200).json(responseModel.success(200, cekDataPenelitianDitolak))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllKeangotaanPenelitian = async (req, res) => {
    try{
        const {name} = req.user[0]
        const judulPenelitian = []

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
                penelitian: {
                    include: {
                        reviewPenelitian: true,
                        partisipasiPenelitian: true,
                        Dokumen: true,
                        nilaiPenelitian: true
                    }
                }
            },
            skip: page,
            take: row,
        }


        if (searchJudul) {
            options.where.judulPenelitian = {
                contains: searchJudul
            }
        }

        const getAllPenelitian = await prisma.PartisipasiPenelitian.findMany(options)

        getAllPenelitian.map((data) => {
            judulPenelitian.push(data.judulPenelitian)
        })

        
        
        
        const getKetuaPenelitian = await prisma.partisipasiPenelitian.findMany({
            where: {
                judulPenelitian: {
                    in: judulPenelitian,  
                },
                jabatan : "Ketua Pengusul"
            },
            include: {
                user: true,
                penelitian: true
            }
        })
        
        console.log(getAllPenelitian)
        const pushKetuaPenelitianInPenelitian = []

        getAllPenelitian.map((data, index) => {
            getAllPenelitian[index].DataKetuaPenelitian = getKetuaPenelitian[index]
        })
        

        return res.status(200).json(responseModel.success(200, getAllPenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const UpdateStatusPartisiPasiPenelitian = async (req, res) => {
    try{
        const {id} = req.params
        const {statusPartisipasi, judul} = req.body

        
        if (statusPartisipasi === 2) {
            const getDeleteStatusPartisiPenelitianUser = await prisma.partisipasiPenelitian.delete({
                where: {
                    id: Number(id)
                }
            })

            return res.status(200).json(responseModel.success(200, getDeleteStatusPartisiPenelitianUser))
        }


        const getAllPenelitian = await prisma.PartisipasiPenelitian.findMany({
            where: {
                judulPenelitian:  judul,
                statusPartisipasi: 0
            },
        })

        const getPartisiPenelitianByKetua = await prisma.PartisipasiPenelitian.findMany({
            where: {
                judulPenelitian:  judul,
                jabatan: 'Ketua Pengusul'
            },
        })


        // return console.log(getPartisiPenelitianByKetua)


        const getEditStatusPartisipasiPenelitianUser =await prisma.partisipasiPenelitian.update({
            where: {
                id: Number(id)
            },
            data: {
                statusPartisipasi: Number(statusPartisipasi)
            }
        })


        // console.log(getEditStatusPartisipasiPenelitianUser)

        await prisma.notification.create({
            data: {
                nameUser: getPartisiPenelitianByKetua[0].nameUser,
                judulPenelitian: judul,
                pesan: `${getEditStatusPartisipasiPenelitianUser.jabatan} Telah Menerima Persetujuan Penelitian`
            }
        })

        return res.status(200).json(responseModel.success(200, getEditStatusPartisipasiPenelitianUser))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllPenelitian = async (req, res, next) => {
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

            options.where.NOT = {statusPenelitian : 0}

            options.include = {
                partisipasiPenelitian: {
                    include: {
                        user: true
                    }
                },
                reviewPenelitian: true,
                nilaiPenelitian: true
            }
            
            
            const getAllPenelitian = await prisma.penelitian.findMany(options)
            
            console.log(getAllPenelitian, options)

            return res.status(200).json(responseModel.success(200, getAllPenelitian))
            
        }


        options.where.nameUser = name

        options.include = {
            user: true,
            penelitian: {
                include: {
                    reviewPenelitian: true,
                    nilaiPenelitian: true
                }
            }
        }


        const getAllPenelitian = await prisma.PartisipasiPenelitian.findMany(options)

        return res.status(200).json(responseModel.success(200, getAllPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdPenelitian = async (req, res, next) => {
    try{

        const idPenelitian = req.params.id

        const getByIdPenelitian = await prisma.Penelitian.findUnique({
            where: {
                id: Number(idPenelitian)
            },
            include: {
                partisipasiPenelitian: {
                    include: {
                        user: true,
                    }
                },
                Dokumen: true
            }
        })

        return res.status(200).json(responseModel.success(200, getByIdPenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createPenelitian = async (req, res, next) => {
    try{
        const {judul, skema, abstrak, jenisTKT, jenisTargetTKT, biayaLuaran, bidangFokus, lamaKegiatan, DataAnggotaDosen, DataAnggotaMahasiswa} = req.body
        const user = req.user[0]
        const nemeMhasiswa = []


        DataAnggotaDosen.map((data, i) => {
            data.statusAkun = Number(data.statusAkun)
            data.statusPartisipasi = Number(data.statusPartisipasi)
        })

        // return console.log(skema.toLowerCase() === "penelitian kerja sama" || skema.toLowerCase() === "penelitian pascasajana")

        const valuesIsYes = []
        // if (skema.toLowerCase() === "penelitian kerja sama" || skema.toLowerCase() === "penelitian pascasarjana") {
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
            const newDataNotDaftar = DataAnggotaMahasiswa.filter((data) => {
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
            return Tes.judulPenelitian = judul
        })

        
        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {
            DataAnggotaMahasiswa.map((Tes) => {
                return Tes.judulPenelitian = judul
            })
        }
        
        DataAnggotaDosen.map((tes) => {
            delete tes.nidn
        })
                
        const dataPenelitian = {
            judul: judul,
            skema: skema,
            abstrak: abstrak,
            jenisTKT: jenisTKT, 
            jenisTargetTKT: jenisTargetTKT,
            biayaLuaran: biayaLuaran,
            bidangFokus: bidangFokus,
            lamaKegiatan: lamaKegiatan,
            statusPenelitian: 0,
            statusRevisi: false
        }
        
        
        const penelitian = await prisma.penelitian.create({
            data: dataPenelitian
        })



        
        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/usulanPenelitian"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Usulan Proposal",
                nameUser: user.name,
                idPenelitian: penelitian.id,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            await prisma.dokumen.create({
                data: options
            })

        }


        // return console.log(DataAnggotaDosen)

        await prisma.partisipasiPenelitian.createMany({
            data: DataAnggotaDosen
        })

        const dataNotificationDosen =  DataAnggotaDosen.map(data => {
            if (data.jabatan !== "Ketua Pengusul") {
                return {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    pesan: "Permintaan Keanggotaan Penelitian"
                } 
            }

        })

        await prisma.Notification.createMany({
            data: dataNotificationDosen
        })

       
        if (DataAnggotaMahasiswa !== undefined && DataAnggotaMahasiswa.length !== 0) {

            const newDataPartisipasiMahasiswa = DataAnggotaMahasiswa.map((data) => ({
                nameUser: data.nameUser,
                judulPenelitian: data.judulPenelitian,
                jabatan: "Mahasiswa",
                tugasdlmPenlitian: data.tugasdlmPenlitian,
                statusAkun: 0,
                statusPartisipasi: 1
            }))

            const dataNotificationMahasiswa =  DataAnggotaMahasiswa.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    pesan: "Anda Terdaftar Pada Penelitian"
                }
            })


            await prisma.PartisipasiPenelitian.createMany({
                data: newDataPartisipasiMahasiswa
            })


            await prisma.Notification.createMany({
                data: dataNotificationMahasiswa
            })
        }


        return res.status(201).json(responseModel.success(201, penelitian))
        
        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const updatePenelitian = async (req, res, next) => {
    try{


        const {id} = req.params
        const {judul, tema, abstraksi, jenisTKT, jenisTargetTKT, biayaLuaran, bidangFokus, lamaKegiatan, statusPenelitian, DataAnggotaDosen, statusDibiayai} = req.body
        const user = req.user[0]

        if (statusDibiayai == true) {

            console.log(statusDibiayai)
            const idDobiayai = []
            const judulUpdate = []
            
            const cekRevisi = await prisma.reviewPenelitian.findMany({
                where: {
                    revisi: null
                }
            })
            
            cekRevisi.map((data, i) => {
                idDobiayai.push(data.id)
            })

            
            const cekStatusPenelitianDIbiayai = await prisma.nilaiPenelitian.groupBy({
                where: {
                    idReviewPenelitian: {in: idDobiayai}
                },
                by: ['judulPenelitian'],
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
                    judulPenelitian: 'desc',
                },
                having: {
                    nilai: {
                      _avg: {
                        gt: 75,
                      },
                    },
                  },
            })


            cekStatusPenelitianDIbiayai.map((data) => {
                judulUpdate.push(data.judulPenelitian)
            })

            
            const updateStatusPenelitianDibiayai = await prisma.penelitian.updateMany({
                where: {
                    judul: {in: judulUpdate}
                },
                data: {
                    statusPenelitian: 5
                }
            })


            const updateStatusPenelitianGagalDibiayai = await prisma.penelitian.updateMany({
                where: {
                    judul: {notIn: judulUpdate}
                },
                data: {
                    statusPenelitian: 4
                }
            })

            const cekpartisipenelitianDibiayai = await prisma.partisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: {in: judulUpdate}
                }
            })

            const cekpartisipenelitianGagalbiayai = await prisma.partisipasiPenelitian.findMany({
                where: {
                    judulPenelitian: {notIn: judulUpdate}
                }
            })

            const dataNotificationDibiayai = cekpartisipenelitianDibiayai.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    pesan: "Penelitian Kalian Dibiayai"
                }
            })

            const dataNotificationNotbiayai = cekpartisipenelitianGagalbiayai.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    pesan: "Penelitian Kalian Tidak Dibiayai"
                }
            })

            await prisma.Notification.createMany({
                data: dataNotificationDibiayai
            })

            await prisma.Notification.createMany({
                data: dataNotificationNotbiayai
            })


            // console.log(cekpartisipenelitianDibiayai)
            // console.log(cekpartisipenelitianGagalbiayai)
            return res.status(201).json(responseModel.success(201, cekStatusPenelitianDIbiayai))

        }else{
            const getStatusPenelitianDiajuakn = await prisma.penelitian.findUnique({
                where: {
                    id: Number(id)
                }
            })

            // Validasi Edit Status Penelitian DI ajikan >>>
            if (user.roleId === 3) {        
                if (getStatusPenelitianDiajuakn.statusPenelitian === 1 && getStatusPenelitianDiajuakn.statusRevisi === false) {
                    return res.status(404).json(responseModel.error(404, "Penelitian Telah Diajukan Dan Sedang Tidak Direvisi"))
                }
            }
            
    
            
            
            if (statusPenelitian === 1) {

                const cekPartisiPenelitianBelumSetuju = await prisma.partisipasiPenelitian.findMany({
                    where: {
                        judulPenelitian: getStatusPenelitianDiajuakn.judul,
                        statusPartisipasi: 0,
                        statusAkun: 1
                    }
                })
    
                if (cekPartisiPenelitianBelumSetuju.length > 0) {
                    
                    let nama = ""
                    let jabatan = ""
                    
                    cekPartisiPenelitianBelumSetuju.map((data) => {
                        nama = data.nameUser
                        jabatan = data.jabatan 
                    })
                    
                    
                    return res.status(404).json(responseModel.error(404, `${nama} ${jabatan} Belum Menyetujui`))
                }
                
                const penelitianUpdateStatus = await prisma.Penelitian.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        statusPenelitian: statusPenelitian
                    }
                })
                
                
                return res.status(201).json(responseModel.success(201, penelitianUpdateStatus))
                
            }
            
            if (statusPenelitian === 2) {
    
                const penelitianUpdateStatus = await prisma.Penelitian.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        statusPenelitian: statusPenelitian
                    }
                })
    
    
                return res.status(201).json(responseModel.success(201, penelitianUpdateStatus))
                
            }


            if (statusDibiayai == true) {
                
                const cekRevisi = await prisma.reviewPenelitian.findMany({
                    where: {
                        revisi: null,
                    }
                })

            }
            
            const dataPenelitian = {
                judul: judul,
                tema: tema,
                abstraksi: abstraksi,
                jenisTKT: jenisTKT, 
                jenisTargetTKT: jenisTargetTKT,
                biayaLuaran: biayaLuaran,
                bidangFokus: bidangFokus,
                lamaKegiatan: lamaKegiatan,
            }
    
    
            if (req.file !== undefined) {
    
                const optionsCloudinary =  {
                    folder: "P3MPolimdo/PDF/usulanPenelitian"
                }
    
                const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)
    
                const {public_id,secure_url} = UploadPDF
    
                const options = {
                    name: "Usulan Proposal",
                    nameUser: user.name,
                    idPenelitian: Number(id),
                    urlPdf: secure_url,
                    pdf_id: public_id,
                    namePdf: req.file.originalname
                }
    
                const cekDataDokumenPenelitian = await prisma.Dokumen.findMany({
                    where: {
                        name: options.name,
                        nameUser: user.name,
                        idPenelitian: Number(id),
                    }
                })
    
                if (cekDataDokumenPenelitian.length !== 0) {
                    await prisma.Dokumen.update({
                        where: {
                            id: cekDataDokumenPenelitian[0]?.id
                        },
                        data: options
                    })
                }else{
                    await prisma.Dokumen.create({
                        data: options
                    })

                    dataPenelitian.statusPenelitian = 3
                }
    
    
            }
            
            console.log(getStatusPenelitianDiajuakn)
            
            const penelitian = await prisma.Penelitian.update({
                where: {
                    id: Number(id)
                },
                data: dataPenelitian
            })

    
            return res.status(201).json(responseModel.success(201, penelitian))
        }

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deletePenelitian = async (req, res, next) => {
    try{

        const {id} = req.params
        const user = req.user[0]


        const getpenelitianindelete = await prisma.Penelitian.findUnique({
            where: {
                id: Number(id)
            },
            include : {
                partisipasiPenelitian: true,
                Dokumen: true,
                reviewPenelitian: true,
                notification: true
            }
        })

        if (getpenelitianindelete.statusPenelitian === 1 && user.roleId !== 1) {
            return res.status(404).json(responseModel.error(404, "Penelitian Telah Diajukan"))
        }
        
        const name = getpenelitianindelete.judul
        
        if (getpenelitianindelete?.Dokumen?.length !== 0) {
    
    
            await prisma.Dokumen.delete({
                where: {
                    id: getpenelitianindelete.Dokumen[0].id
                }
            })
        }
        
        if (getpenelitianindelete?.partisipasiPenelitian.length !== 0 ) {     
            await prisma.PartisipasiPenelitian.deleteMany({
                where: {
                    judulPenelitian: name
                },
            })
        }

        if (getpenelitianindelete?.notification.length !== 0 ) {     
            await prisma.notification.deleteMany({
                where: {
                    judulPenelitian: name
                },
            })
        }
        
        if (getpenelitianindelete?.reviewPenelitian.length !== 0) {

            await prisma.nilaiPenelitian.deleteMany({
                where: {
                    idReviewPenelitian: getpenelitianindelete?.reviewPenelitian.id
                }
            })
            
            await prisma.reviewPenelitian.deleteMany({
                where: {
                    judulPenelitian: name
                },
            })
        }



        const deletePenelitian = await prisma.Penelitian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, deletePenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllAssesmentPenelitian,
    getPenelitianForNilai,
    getPenelitianArrov,
    getAllPenelitianByKapro,
    getByAllPenelitianForCatatanHarian,
    getByAllPenelitianForLaporan,
    getStatisticByUser,
    getAllDiajukanPenelitian,
    getAllPengusulPenelitian,
    getAllKeangotaanPenelitian,
    UpdateStatusPartisiPasiPenelitian,
    getByAllPenelitian,
    getByIdPenelitian,
    createPenelitian,
    updatePenelitian,
    deletePenelitian,
    getAllLolosPenelitian,
    getAllDitolakPenelitian,
    getAllSeleksiPenelitian
}