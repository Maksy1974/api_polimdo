const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const getByAllLaporanAkhir = async (req, res) => {
    try{
        const user = req.user[0]
        const judulPenelitian = []
        const judulPengabdian = []
        const {searchJudul} = req.query
        let cekPengabdian = ''
        let cekPenelitian = ''

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

            options.include = {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                biayaKegiatan: true,
                reviewLaporan: true,
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


            const cekDataLaporanAkhir = await prisma.laporanAkhir.findMany(options)
    
            return res.status(200).json(responseModel.success(200, cekDataLaporanAkhir))
        }

        options.where.nameUser = user?.name

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

        const cekDataLaporanAkhir = await prisma.laporanAkhir.findMany({
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
                reviewLaporan: true,
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

        return res.status(200).json(responseModel.success(200, cekDataLaporanAkhir))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByIdLaporanAkhir = async (req, res) => {
    try{

        const {id} = req.params

        const getDataByIdLaporanAkhir = await prisma.laporanAkhir.findUnique({
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

        return res.status(200).json(responseModel.success(200, getDataByIdLaporanAkhir))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const CreateLaporanAkhir = async (req, res) => {
    try{

        const {judul, url_jurnal, biayaLuaran} = req.body
        const user = req.user[0]
        let idDokumenCatatanHarian = ''

        const options = {
            URLJurnal: url_jurnal
        }

        biayaLuaran.map((data) => {
            console.log(data)
        })
        // return 

        const cekLaporanAkhirPenelitianTelahAda = await prisma.laporanAkhir.findMany({
            where: {
                judulPenelitian: judul
            }
        })

        const cekLaporanAkhirPengabdianTelahAda = await prisma.laporanAkhir.findMany({
            where: {
                judulPengabdian: judul
            }
        })

        // return console.log(cekLaporanAkhirTelahAda.length)

        if (cekLaporanAkhirPenelitianTelahAda.length !== 0 || cekLaporanAkhirPengabdianTelahAda.length !== 0) {
            return res.status(404).json(responseModel.error(404, `Laporan Akhir Telah DImasukan`))
        }

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
                judulPengabdian: judul,
                nameUser: user.name,
                jabatan: "Ketua Pengusul"
            },include: {
                pengabdian: true
            }
        })

        if (cekPatisiPenelitian.length !== 0) {
            options.judulPenelitian = judul,
            options.partisipasiPenelitianId = cekPatisiPenelitian[0].id

            await prisma.penelitian.update({
                where: {
                    judul: judul
                },
                data: {
                    statusPenelitian: 6
                }
            })
        }else if (cekPatisiPengabdian.length !== 0) {
            options.judulPengabdian = judul,
            options.partisipasiPengabdianId = cekPatisiPengabdian[0].id

            await prisma.pengabdian.update({
                where: {
                    judul: judul
                },
                data: {
                    statusPengabdian: 6
                }
            })
        }

        // const cekPenelitian = await prisma.penelitian.findUnique({
        //     where: {
        //         judul: judul
        //     }
        // })

        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/laporanAkhir"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Laporan Akhir",
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

        options.statusLaporan = 0


        const dataCreateLaporanAkhir = await prisma.laporanAkhir.create({
            data: options
        })

        if (dataCreateLaporanAkhir) {
            biayaLuaran.map(data => {
                data.LaporanAkhirId = dataCreateLaporanAkhir.id
            })


            await prisma.biayaKegiatan.createMany({
                data: biayaLuaran
            })
        }

        return res.status(200).json(responseModel.success(200, dataCreateLaporanAkhir))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const UpdateByIdLaporanAkhir = async (req, res) => {
    try{

        const {judul, biayaLuaran, idDeleteBiaya} = req.body
        const user = req.user[0]
        const {id} = req.params
        const option = {} 

        console.log(id, idDeleteBiaya)

        biayaLuaran.map((data) => {
            console.log(data)
        })

        // return
        if (idDeleteBiaya !== undefined) {
            idDeleteBiaya.map(async id => {
                await prisma.biayaKegiatan.deleteMany({
                    where: {
                        id: Number(id)
                    }
                })

            })
        }

        biayaLuaran.map(async (data, i) => {
            if (data.id) {
                console.log(data)
                await prisma.biayaKegiatan.update({
                    where: {
                        id: Number(data.id)
                    },
                    data: {
                        uraian: data.uraian,
                        jumlah: data.jumlah
                        // LaporanAkhirId: Number(id)
                    }
                })
            }else{
                
                await prisma.biayaKegiatan.create({
                    data: {
                        uraian: data.uraian,
                        jumlah: data.jumlah,
                        LaporanAkhirId: Number(id)
                    }
                })
            }
        })


        // return

        const cekLaporanAkhir = await prisma.LaporanAkhir.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                reviewLaporan: true
            }
        })

        if (cekLaporanAkhir.penelitian) {
            option.judulPenelitian = judul
        }else{
            option.judulPengabdian = judul
        }

        if (req.file !== undefined) {

            const optionsCloudinary =  {
                folder: "P3MPolimdo/PDF/laporanAkhir"
            }

            const UploadPDF = await uploadCloudinary(req.file.path, optionsCloudinary)

            const {public_id,secure_url} = UploadPDF

            const options = {
                name: "Laporan Akhir",
                nameUser: user.name,
                urlPdf: secure_url,
                pdf_id: public_id,
                namePdf: req.file.originalname

            }

            if (cekLaporanAkhir.penelitian) {
                options.idPenelitian = cekLaporanAkhir?.penelitian.id
            }else{
                options.idPengabdian= cekLaporanAkhir?.pengabdian.id
            }

            if (cekLaporanAkhir?.Dokumen?.id) {
                await prisma.dokumen.update({
                    where: {
                        id: cekLaporanAkhir?.Dokumen.id
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

        const dataCreateLaporanAkhir = await prisma.laporanAkhir.update({
            where:  {
                id: Number(id)
            },
            data: option
        })

        if (cekLaporanAkhir?.reviewLaporan.status === 2) {
            await prisma.reviewLaporan.update({
                where: {
                    id: cekLaporanAkhir?.reviewLaporan.id
                },
                data: {
                    status: 1,
                    komentar: null
                }
            })
        }

        return res.status(200).json(responseModel.success(200, dataCreateLaporanAkhir))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const DeleteByIdLaporanAkhir = async (req, res) => {
    try{

        const {id} = req.params

        const cekLaporanAkhir = await prisma.laporanAkhir.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: true,
                pengabdian: true,
                Dokumen: true,
                reviewLaporan: true
            }
        })

        if (cekLaporanAkhir?.Dokumen?.id) {     
            await prisma.dokumen.delete({
                where: {
                    id: cekLaporanAkhir.Dokumen.id
                }
            })
        }

        await prisma.biayaKegiatan.deleteMany({
            where: {
                LaporanKemajuanId: cekLaporanAkhir.id
            }
        })

        console.log(id)

        if (cekLaporanAkhir.reviewLaporan) {
            await prisma.reviewLaporan.delete({
                where: {
                    id: cekLaporanAkhir.reviewLaporan.id
                }
            })
        }

        const dataDeleteLaporanAkhir = await prisma.laporanAkhir.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataDeleteLaporanAkhir))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    getByAllLaporanAkhir,
    getByIdLaporanAkhir,
    CreateLaporanAkhir,
    UpdateByIdLaporanAkhir,
    DeleteByIdLaporanAkhir
}