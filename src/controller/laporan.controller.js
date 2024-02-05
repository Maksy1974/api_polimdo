const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')



const prisma = new PrismaClient()

const getAllAssesmentKeluaranHasil = async (req, res) => {
    try{
        const {searchJudul} = req.query


        const {page, row} = pagination(req.query.page, req.query.row)
        

        const options = {
            where: {
                statusLaporan: 0
            },
            include: {
                penelitian: {
                    include: {
                        laporanKemajuan: true,
                        laporanAkhir: true
                    }
                },
                pengabdian: {
                    include: {
                        laporanKemajuan: true,
                        laporanAkhir: true
                    }
                },
                partisipasiPenelitian: true,
                partisipasiPengabdian: true,
                reviewLaporan: true
            },
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
                    },
                    statusPenelitian: 6
                }
            })
    
            cekPengabdian = await prisma.pengabdian.findMany({
                where: {
                    judul: {
                        contains: searchJudul
                    },
                    statusPengabdian: 6
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

        const cekDataLaporanAkhir = await prisma.laporanAkhir.findMany(options)

        console.log(cekDataLaporanAkhir)

        return res.status(200).json(responseModel.success(200, cekDataLaporanAkhir))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByReviewerlaporan = async (req, res) => {
    try{
        const {id} = req.params

        
        const dataReviewerLaporan = await prisma.reviewLaporan.findUnique({
            where : {
                laporanAkhirId: Number(id)
            }
        })
        

        return res.status(200).json(responseModel.success(200, dataReviewerLaporan))
        

    
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByNilaiReviewerlaporan = async (req, res) => {
    try{
        const {id} = req.params
        const {komentar, status} = req.body

        
        if (status == 3) {
            const cekDataJudul = await prisma.reviewLaporan.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    laporanAkhir: true
                }
            })

            if (cekDataJudul?.laporanAkhir?.judulPenelitian) {
                await prisma.penelitian.update({
                    where: {
                        judul:cekDataJudul?.laporanAkhir?.judulPenelitian
                    },
                    data: {
                        statusPenelitian: 7
                    }
                })
            }

            if (cekDataJudul?.laporanAkhir?.judulPengabdian) {
                await prisma.pengabdian.update({
                    where: {
                        judul:cekDataJudul?.laporanAkhir?.judulPengabdian
                    },
                    data: {
                        statusPengabdian: 7
                    }
                })
            }

        }

        
        const dataReviewerLaporan = await prisma.reviewLaporan.update({
            where : {
                id: Number(id)
            },
            data: {
                komentar: komentar,
                status: Number(status)
            }
        })

        
        

        return res.status(200).json(responseModel.success(200, dataReviewerLaporan))
        

    
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createReviewerlaporan = async (req, res) => {
    try{
        const data = req.body

        console.log(data)
        
        data.status = 1

        const createReviewerLaporan = await prisma.reviewLaporan.createMany({
            data: data
        })


        const cekJudulInLaporanAkhir = await prisma.laporanAkhir.findUnique({
            where: {
                id: data.laporanAkhirId
            }
        })

        if (cekJudulInLaporanAkhir.judulPenelitian !== null) {
            await prisma.penelitian.update({
                where: {
                    judul: cekJudulInLaporanAkhir.judulPenelitian
                },
                data: {
                    statusPenelitian: 6
                }
            })
        }
        if (cekJudulInLaporanAkhir.judulPengabdian !== null) {
            await prisma.pengabdian.update({
                where: {
                    judul: cekJudulInLaporanAkhir.judulPengabdian
                },
                data: {
                    statusPengabdian: 6
                }
            })
        }
        
        console.log(cekJudulInLaporanAkhir)
        

        

        return res.status(200).json(responseModel.success(200, createReviewerLaporan))
        

    
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateReviewerLaporan = async (req, res) => {
    try{
        
        const {Data, idDeleteReviewer} = req.body

        // return console.log(Data)
        
        
        const cekDataUser = await prisma.user.findMany({
            where: {
                name: Data.nameUser
            }
        })


        if (cekDataUser.length === 0) {
            return res.status(404).json(responseModel.error(404, `User ${Data.nameUser} Tidak Terdaftar`))

        }


        console.log(idDeleteReviewer)
        // return console.log(Data)

        if (idDeleteReviewer.length !== 0) {
            
            await prisma.reviewLaporan.delete({
                where: {
                    id: idDeleteReviewer
                }
            })

        }


        if (!Data.id && Data.nameUser) {
            await prisma.reviewLaporan.create({
                data: {
                    nameUser: Data.nameUser,
                    laporanAkhirId: Data.laporanAkhirId,
                    status: 1
                }
            })

        }
        
        if(Data.id && Data.nameUser){
            await prisma.reviewLaporan.update({
                where: {
                    id: Number(Data.id)
                },
                data: {
                nameUser: Data.nameUser
                }
            })
        }


        return res.status(200).json(responseModel.success(200, `Reviewer Penelitian Berhasil Diperbarui`))


    }catch(error) {
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getByReviewerlaporan,
    getAllAssesmentKeluaranHasil,
    createReviewerlaporan,
    updateReviewerLaporan,
    updateByNilaiReviewerlaporan
}