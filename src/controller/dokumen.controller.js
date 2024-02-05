const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)

const prisma = new PrismaClient()


const getByIdDokumen = async (req, res) => {
    try{
        const {id} = req.params

        console.log(req.params)

        const dataDokumen = await prisma.dokumen.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(201).json(responseModel.success(201, dataDokumen))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const updateDokumen = async (req, res) => {
    try{
        const id = req.params.id
        
        
        if (req.file === undefined) {
            return res.status(404).json(responseModel.error(404, `Masukan FIle`))
        }

        const optionsCloudinary =  {
            folder: "P3MPolimdo/PDF/usulanPenelitianRevisi"
        }

        const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

        const {public_id,secure_url} = UploadPDF

        const options = {
            // name: "Usulan Proposal",
            // nameUser: user.name,
            // idPenelitian: Number(id),
            urlPdfRevisi: secure_url,
            pdf_idRevisi: public_id,
            namePdfRevisi: req.file.originalname
        }

        const cekDataDokumen = await prisma.dokumen.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                Pengabdian: true
            }
        })

        const updateRevisiDokumen = await prisma.dokumen.update({
            where: {
                id: Number(id)
            },
            data: options
        })

        if (cekDataDokumen.penelitian) {
            const dataReviewer = await prisma.reviewPenelitian.updateMany({
                where: {
                    judulPenelitian: cekDataDokumen.penelitian.judul
                },
                data: {
                    revisi: null
                }
            })
    
    
            await prisma.partisipasiPenelitian.updateMany({
                where: {
                    judulPenelitian: cekDataDokumen.penelitian.judul
                },
                data: {
                    statusRevisi: false
                },
            })
    
            await prisma.penelitian.update({
                where: {
                    id: cekDataDokumen.penelitian.id
                },
                data: {
                    statusRevisi: false
                }
            })
    
            const cekdataReviewer = await prisma.reviewPenelitian.findMany({
                where: {
                    judulPenelitian: cekDataDokumen.penelitian.judul
                }
            })
            
            console.log(cekdataReviewer)
    
            const dataNotification =  cekdataReviewer.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    pesan: "Penelitian Telah Di Revisi"
                }
            })
    
            await prisma.Notification.createMany({
                data: dataNotification
            })    
        }else{

            const dataReviewer = await prisma.reviewPengabdian.updateMany({
                where: {
                    judulPengabdian: cekDataDokumen.Pengabdian.judul
                },
                data: {
                    revisi: null
                }
            })
    
    
            await prisma.partisipasiPengabdian.updateMany({
                where: {
                    judulPengabdian: cekDataDokumen.Pengabdian.judul
                },
                data: {
                    statusRevisi: false
                },
            })
    
            await prisma.pengabdian.update({
                where: {
                    id: cekDataDokumen.Pengabdian.id
                },
                data: {
                    statusRevisi: false
                }
            })
    
            const cekdataReviewer = await prisma.reviewPengabdian.findMany({
                where: {
                    judulPengabdian: cekDataDokumen.Pengabdian.judul
                }
            })
            
            console.log(cekdataReviewer)
    
            const dataNotification =  cekdataReviewer.map(data => {
                return {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    pesan: "Pengabdian Telah Di Revisi"
                }
            })
    
            await prisma.Notification.createMany({
                data: dataNotification
            })
    
        }

        
        return res.status(201).json(responseModel.success(201, updateRevisiDokumen))

        
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getByIdDokumen,
    updateDokumen
}


