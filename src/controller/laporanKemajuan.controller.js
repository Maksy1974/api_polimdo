const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getByAllLaporanKemajuan = async (req, res) => {
    try{
        const user = req.user[0]
        const judulPenelitian = []
        const judulPengabdian = []
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


            // return console.log(cekPenelitian, cekPengabdian)
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

        // return console.log(options)
        
        if (user.roleId === 1) {

            options.include = {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                biayaKegiatan: true,
                partisipasiPenelitian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPengabdian: {
                    include: {
                        user: true
                    }
                },
            }


            console.log(options, cekPenelitian, cekPengabdian)
            
            
            const cekDataLaporan = await prisma.laporanKemajuan.findMany(options)
            
            // return console.log(cekDataLaporan)
            
            return res.status(200).json(responseModel.success(200, cekDataLaporan))
        }
        console.log(options, cekPenelitian, cekPengabdian)

        if (user.roleId !== 2) {
            options.where.nameUser = user?.name
        }

        let cekParitisiPenelitian = ''
        let cekParitisiPengabdian = '' 

        // return console.log(options.where.judulPengabdian)
        
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
                judulPenelitian.push(data.judulPenelitian)
            })
            
        }

        if (cekParitisiPengabdian.length !== 0) {
            cekParitisiPengabdian.map((data) => {
                judulPengabdian.push(data.judulPengabdian)
            })
        }


        

        const cekDataLaporan = await prisma.laporanKemajuan.findMany({
            where: {
                OR: [
                    {
                        judulPenelitian: {in: judulPenelitian}
                    },
                    {
                        judulPengabdian: {in: judulPengabdian}
                    }
                ]
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                biayaKegiatan: true,
                partisipasiPenelitian: {
                    include: {
                        user: true
                    }
                },
                partisipasiPengabdian: {
                    include: {
                        user: true
                    }
                }
            }
        })

        console.log(cekDataLaporan)


        return res.status(200).json(responseModel.success(200, cekDataLaporan))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByIdLaporanKemajuan = async (req, res) => {
    try{

        const {id} = req.params

        const getDataByIdLaporanKemajuan = await prisma.laporanKemajuan.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                biayaKegiatan: true
            }
        })

        return res.status(200).json(responseModel.success(200, getDataByIdLaporanKemajuan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const CreateLaporanKemajuan = async (req, res) => {
    try{

        const {judul, url_jurnal, biayaLuaran} = req.body
        const user = req.user[0]
        let idDokumenCatatanHarian = ''

        let options = {
            URLJurnal: url_jurnal
        } 


        biayaLuaran.map((data) => {
            console.log(data)
        })
        // return 

        const cekPatisiPenelitian = await prisma.partisipasiPenelitian.findMany({
            where: {
                judulPenelitian: judul,
                nameUser: user.name,
                jabatan: "Ketua Pengusul"
            }, include: {
                penelitian: true,
            }
        })

        const cekPatisiPengabdian = await prisma.partisipasiPengabdian.findMany({
            where: {
                judulPengabdian: {
                    contains: judul
                },
                nameUser: user.name,
                jabatan: "Ketua Pengusul"
            },include: {
                pengabdian: true
            }
        })
        
        // return console.log(cekPatisiPenelitian, cekPatisiPengabdian, judul)
        
        if (cekPatisiPenelitian.length !== 0) {
            options.judulPenelitian = judul,
            options.partisipasiPenelitianId = cekPatisiPenelitian[0].id
        }else if (cekPatisiPengabdian.length !== 0) {
            options.judulPengabdian = judul,
            options.partisipasiPengabdianId = cekPatisiPengabdian[0].id
        }


        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/laporanKemajuan"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Laporan Kemajuan",
                nameUser: user.name,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            if (cekPatisiPenelitian) {
                options.idPenelitian = cekPatisiPenelitian?.penelitian?.id
            }else{
                options.idPengabdian = cekPatisiPengabdian?.pengabdian?.id
            }

            const dataDokumenCatatanHarian = await prisma.dokumen.create({
                data: options
            })

            idDokumenCatatanHarian = dataDokumenCatatanHarian.id
        }

        if (idDokumenCatatanHarian !== '') {
            options.idDokumen = idDokumenCatatanHarian
        }

        
        const dataCreateLaporanKemajuan = await prisma.LaporanKemajuan.create({
            data: options
        })

        if (dataCreateLaporanKemajuan) {
            biayaLuaran.map(data => {
                data.LaporanKemajuanId = dataCreateLaporanKemajuan.id
            })


            await prisma.biayaKegiatan.createMany({
                data: biayaLuaran
            })
        }
        
        return res.status(200).json(responseModel.success(200, dataCreateLaporanKemajuan))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const UpdateByIdLaporanKemajuan = async (req, res) => {
    try{

        const {judul, url_jurnal, biayaLuaran, idDeleteBiaya} = req.body
        const user = req.user[0]
        const {id} = req.params

        console.log(idDeleteBiaya)
        if (idDeleteBiaya?.length !== 0 && idDeleteBiaya !== undefined) {
            
            idDeleteBiaya.map(async data => {
                await prisma.biayaKegiatan.delete({
                    where: {
                        id: Number(data)
                    }
                })

            })

        }

        const option = {
            URLJurnal: url_jurnal
        } 

        const cekLaporanKemajuan = await prisma.laporanKemajuan.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true
            }
        })

        if (cekLaporanKemajuan.penelitian) {
            option.judulPenelitian = judul
        }else{
            option.judulPengabdian = judul
        }


        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/laporanKemajuan"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Laporan Kemajuan",
                nameUser: user.name,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            if (cekLaporanKemajuan.penelitian) {
                options.idPenelitian = cekLaporanKemajuan?.penelitian.id
            }else{
                options.idPengabdian= cekLaporanKemajuan?.pengabdian.id
            }

            if (cekLaporanKemajuan?.Dokumen?.id) {
                await prisma.dokumen.update({
                    where: {
                        id: cekLaporanKemajuan?.Dokumen.id
                    },
                    data: options
                })
            }else{
                const createDokumen =  await prisma.dokumen.create({
                    data: options
                })
                // console.log("ada", createDokumen)

                option.idDokumen = createDokumen.id
            }

        }

        const dataCreateLaporanKemajuan = await prisma.laporanKemajuan.update({
            where:  {
                id: Number(id)
            },
            data: option
        })

        biayaLuaran.map(async (data,i ) => {
            // console.log(data)
            if (!data.id) {
                
                await prisma.biayaKegiatan.create({
                    data: {
                        uraian: data.uraian,
                        jumlah: data.jumlah,
                        LaporanKemajuanId: dataCreateLaporanKemajuan.id

                    }
                })

            }else{
                
                await prisma.biayaKegiatan.update({
                    where: {
                        id: Number(data.id)
                  },
                  data: {
                    uraian: data.uraian,
                    jumlah: data.jumlah,
                    LaporanKemajuanId: dataCreateLaporanKemajuan.id
                  }
                })
            }
        })

        return res.status(200).json(responseModel.success(200, dataCreateLaporanKemajuan))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const DeleteByIdLaporanKemajuan = async (req, res) => {
    try{

        const {id} = req.params

        const ceklaporanKemajuan = await prisma.laporanKemajuan.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                biayaKegiatan: true
            }
        })

        if (ceklaporanKemajuan?.Dokumen?.id) {
            
            await prisma.dokumen.delete({
                where: {
                    id: ceklaporanKemajuan.Dokumen.id
                }
            })
            
        }

        await prisma.biayaKegiatan.deleteMany({
            where: {
                LaporanKemajuanId: ceklaporanKemajuan.id
            }
        })


        const dataDeleteLaporanKemajuan = await prisma.laporanKemajuan.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataDeleteLaporanKemajuan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

module.exports = {
    getByAllLaporanKemajuan,
    getByIdLaporanKemajuan,
    CreateLaporanKemajuan,
    UpdateByIdLaporanKemajuan,
    DeleteByIdLaporanKemajuan
}

