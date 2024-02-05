const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const pagination = require('../utility/pagenation')



const prisma = new PrismaClient()

const getAllCatatanHarian = async (req, res) => {
    try{
        const user = req.user[0]
        const idPartisipasiPenelitian = []
        const idPartisipasiPengabdian = []
        const {searchJudul} = req.query
        let cekPenelitian = ''
        let cekPengabdian = ''

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
            
            cekPenelitian = await prisma.penelitian.findMany({
                where: {
                    judul: {
                        contains: searchJudul
                    }
                }
            })
    
            cekPengabdian = await prisma.pengabdian.findMany({
                where: {
                    judul: {
                        contains: searchJudul
                    }
                }
            })


            if (cekPenelitian.length !== 0) {
                options.where.judulPenelitian = {
                    contains: searchJudul
                }
                
            }else{
                options.where.judulPengabdian = {
                    contains: searchJudul
                }
            }
        }

        
        if (user.roleId === 1) {

            let cekParitisiPenelitian = ''
            let cekParitisiPengabdian = '' 
            
            
            if (options.where.judulPenelitian) {
                cekParitisiPenelitian = await prisma.partisipasiPenelitian.findMany(options)
                
            }else if (options.where.judulPengabdian) {
                cekParitisiPengabdian = await prisma.partisipasiPengabdian.findMany(options)

            }else{
                cekParitisiPenelitian = await prisma.partisipasiPenelitian.findMany({
                    orderBy: {
                        id: "asc"
                    },
                    skip: page,
                    take: row,
                })
                cekParitisiPengabdian = await prisma.partisipasiPengabdian.findMany({
                    orderBy: {
                        id: "asc"
                    },
                    skip: page,
                    take: row,
                })

            }

            // return console.log(options, cekParitisiPengabdian)

            if (cekParitisiPenelitian.length !== 0) {
                cekParitisiPenelitian.map((data) => {
                    idPartisipasiPenelitian.push(data.id)
                })
                
            }

            if (cekParitisiPengabdian.length !== 0) {
                cekParitisiPengabdian.map((data) => {
                    idPartisipasiPengabdian.push(data.id)
                })
            }



            // return console.log(idPartisipasiPenelitian, idPartisipasiPengabdian)
            
            
            const getDataAllCatatanHarian = await prisma.catatanHarian.findMany({
                where: {
                    OR: [
                        {

                            partisipasiPenelitianId: {in: idPartisipasiPenelitian},
                        },
                        {

                            partisipasiPengabdianId: {in: idPartisipasiPengabdian}
                        }
                    ]
                },
                include: {
                    partisipasiPenelitian: {
                        include: {
                            penelitian: true
                        }
                    },
                    partisipasiPengabdian: {
                        include: {
                            pengabdian: true
                        }
                    },
                    Dokumen: true
                }
            })
            
            // return console.log(getDataAllCatatanHarian)

            return res.status(200).json(responseModel.success(200, getDataAllCatatanHarian))
        }
        
        options.where.nameUser = user?.name

        let cekParitisiPenelitian = ''
        let cekParitisiPengabdian = '' 
        
        
        if (options.where.judulPenelitian) {
            cekParitisiPenelitian = await prisma.partisipasiPenelitian.findMany(options)
            
        }else if (options.where.judulPengabdian) {
            cekParitisiPengabdian = await prisma.partisipasiPengabdian.findMany(options)

        }else{
            cekParitisiPenelitian = await prisma.partisipasiPenelitian.findMany({
                where: {
                    nameUser: user?.name
                },
                orderBy: {
                    id: "asc"
                },
                skip: page,
                take: row,
            })
            cekParitisiPengabdian = await prisma.partisipasiPengabdian.findMany({
                where: {
                    nameUser: user?.name
                },
                orderBy: {
                    id: "asc"
                },
                skip: page,
                take: row,
            })

        }

        // return console.log(options, cekParitisiPengabdian)

        if (cekParitisiPenelitian.length !== 0) {
            cekParitisiPenelitian.map((data) => {
                idPartisipasiPenelitian.push(data.id)
            })
            
        }

        if (cekParitisiPengabdian.length !== 0) {
            cekParitisiPengabdian.map((data) => {
                idPartisipasiPengabdian.push(data.id)
            })
        }



        // return console.log(idPartisipasiPenelitian, idPartisipasiPengabdian)
        
        
        const getDataAllCatatanHarian = await prisma.catatanHarian.findMany({
            where: {
                OR: [
                    {

                        partisipasiPenelitianId: {in: idPartisipasiPenelitian},
                    },
                    {

                        partisipasiPengabdianId: {in: idPartisipasiPengabdian}
                    }
                ]
            },
            include: {
                partisipasiPenelitian: {
                    include: {
                        penelitian: true
                    }
                },
                partisipasiPengabdian: {
                    include: {
                        pengabdian: true
                    }
                },
                Dokumen: true
            }
        })
        
        // return console.log(getDataAllCatatanHarian)

        return res.status(200).json(responseModel.success(200, getDataAllCatatanHarian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdCatatanHarian = async (req, res) => {
    try{
        const {id} = req.params

        const getDataByIdCatatanHarian = await prisma.CatatanHarian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                partisipasiPenelitian: true,
                partisipasiPengabdian: true,
                Dokumen: true
            }
        })

        return res.status(200).json(responseModel.success(200, getDataByIdCatatanHarian))
        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createCatatanHarian = async (req, res) => {
    try{
        const {kegiatan, ttg, kehadiran, partisipasiUsulanId} = req.body
        const user = req.user[0]
        let idDokumenCatatanHarian = ''

        // console.log(partisipasiUsulanId, user.name)

        const cekPenelitianId = await prisma.partisipasiPenelitian.findMany({
            where: {
                id: Number(partisipasiUsulanId),
                nameUser: user.name
            },
            include: {
                penelitian: true
            }
        })


        const cekPengabdianId = await prisma.partisipasiPengabdian.findMany({
            where: {
                id: Number(partisipasiUsulanId),
                nameUser: user.name
            },
            include: {
                pengabdian: true
            }
        })

        // return console.log(cekPenelitianId, cekPengabdianId)


        // if (partisipasiPenelitianId) {
        //     cekPenelitianId = await prisma.partisipasiPenelitian.findUnique({
        //         where: {
        //             id: Number(partisipasiPenelitianId)
        //         },
        //         include: {
        //             penelitian: true
        //         }
        //     })
        // }else if (partisipasiPengabdianId) {
        //     cekPengabdianId = await prisma.partisipasiPengabdian.findUnique({
        //         where: {
        //             id: Number(partisipasiPengabdianId)
        //         },
        //         include: {
        //             pengabdian: true
        //         }
        //     })
            
        // }

        // return console.log(cekPenelitianId)

        const options ={
            kegiatan: kegiatan,
            ttg: ttg,
            kehadiran: kehadiran,
        }

        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/catatanHarian"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                nameUser: user.name,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            if (cekPenelitianId.length !== 0) {
                options.name = "Catatan Penelitian"
                options.idPenelitian = cekPenelitianId[0]?.penelitian?.id
            }else if (cekPengabdianId.length !== 0) {
                options.name = "Catatan Pengabdian"
                options.idPengabdian = cekPengabdianId[0]?.pengabdian?.id
            }

            const dataDokumenCatatanHarian = await prisma.Dokumen.create({
                data: options
            })

            idDokumenCatatanHarian = dataDokumenCatatanHarian.id
        }


        if (idDokumenCatatanHarian !== '') {
            options.idDokumen = idDokumenCatatanHarian
        }

        if (cekPenelitianId.length !== 0) {     
            options.partisipasiPenelitianId = Number(cekPenelitianId[0].id)
        }

        if (cekPengabdianId.length !== 0) {
            options.partisipasiPengabdianId = Number(cekPengabdianId[0].id)
        }
        
        const dataCreateCatatanHarian = await prisma.CatatanHarian.create({
            data: options
        })

        return res.status(200).json(responseModel.success(200, dataCreateCatatanHarian))
        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByIdCatatanHarian = async (req, res) => {
    try{
        const {kegiatan, ttg, kehadiran, partisipasiUsulanId} = req.body
        const {id} = req.params
        const user = req.user[0]
        let idDokumenCatatanHarian = ''

        // console.log(partisipasiPenelitianId, partisipasiPengabdianId)

        const cekPenelitianId = await prisma.partisipasiPenelitian.findMany({
            where: {
                id: Number(partisipasiUsulanId),
                nameUser: user.name
            },
            include: {
                penelitian: true
            }
        })


        const cekPengabdianId = await prisma.partisipasiPengabdian.findMany({
            where: {
                id: Number(partisipasiUsulanId),
                nameUser: user.name
            },
            include: {
                pengabdian: true
            }
        })
        

        const option = {
            kegiatan: kegiatan,
            ttg: ttg,
            kehadiran: kehadiran,
        }

        if (req.file !== undefined) {

            const cekCatatanHarian = await prisma.catatanHarian.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    Dokumen: true
                }
            })
            
            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/catatanHarian"
            }
            
            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)
            
            const {public_id,secure_url} = UploadPDF
            
            const options = {
                nameUser: user.name,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname
                
            }

            if (cekPenelitianId.length !== 0) {
                options.name = "Catatan Penelitian"
                options.idPenelitian = cekPenelitianId[0]?.penelitian?.id
            }else if (cekPengabdianId.length !== 0) {
                options.name = "Catatan Pengabdian"
                options.idPengabdian = cekPengabdianId[0]?.pengabdian?.id
            }

            // return console.log(cekCatatanHarian, options)
            
            if (cekCatatanHarian?.Dokumen?.id) {
                await prisma.Dokumen.update({
                    where: {
                        id: cekCatatanHarian.Dokumen.id
                    },
                    data: options
                })
            }else{

                const createDokumen =  await prisma.Dokumen.create({
                    data: options
                })
                // console.log("ada", createDokumen)

                idDokumenCatatanHarian = createDokumen.id
            }


        }

        if (idDokumenCatatanHarian !== '') {
            option.idDokumen = idDokumenCatatanHarian
        }

        if (cekPenelitianId.length !== 0) {     
            option.partisipasiPenelitianId = Number(cekPenelitianId[0].id)
        }

        if (cekPengabdianId.length !== 0) {
            option.partisipasiPengabdianId = Number(cekPengabdianId[0].id)
        }

        // return console.log(option)

        const dataUpdateCatatanHarian = await prisma.CatatanHarian.update({
            where: {
                id: Number(id)
            },
            data: option
        })

        return res.status(200).json(responseModel.success(200, dataUpdateCatatanHarian))

        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const deleteByIdCatatanHarian = async (req, res) => {
    try{

        const {id} = req.params

        const cekCatatanHarian = await prisma.catatanHarian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                Dokumen: true
            }
        })


        // return console.log(cekCatatanHarian?.Dokumen)

        if (cekCatatanHarian?.Dokumen !== null) {
            
            await prisma.Dokumen.delete({
                where: {
                    id: cekCatatanHarian.Dokumen.id
                }
            })
        }


        const dataDeleteCatatanHarianPengabdian = await prisma.CatatanHarian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataDeleteCatatanHarianPengabdian))
        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllCatatanHarian,
    getByIdCatatanHarian,
    createCatatanHarian,
    updateByIdCatatanHarian,
    deleteByIdCatatanHarian
}


