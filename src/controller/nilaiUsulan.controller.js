const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()


const updateNilaiUsulanPenelitian = async (req, res) => {
    try{
        const {nilai, revisi} = req.body
        let dataNilaiPenelitian = ''

        console.log(nilai)

        if (nilai.length !== 0) {
            dataNilaiPenelitian = await prisma.nilaiPenelitian.findUnique({
                where: {
                    id: nilai[0].id
                },
                include: {
                    reviewPenelitian: true
                }
            })
            
            
            nilai.map(async (data, i) => {
                await prisma.nilaiPenelitian.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        nilai: Number(data.nilai),
                    }
                })
    
            })
        }

        const cekReview = await prisma.reviewPenelitian.findUnique({
            where: {
                id: dataNilaiPenelitian.reviewPenelitian.id
            }
        })


        await prisma.reviewPenelitian.update({
            where: {
                id: dataNilaiPenelitian.reviewPenelitian.id
            },
            data: {
                revisi: revisi
            }
        })

        const cekPartisipasi =  await prisma.penelitian.update({
            where: {
                judul: cekReview.judulPenelitian
            },
            data: {
                statusRevisi: true
            },
            include: {
                partisipasiPenelitian: true
            }
        })

        await prisma.partisipasiPenelitian.update({
            where: {
                id: cekPartisipasi.partisipasiPenelitian[0].id
            },
            data: {
                statusRevisi: true
            }
        })


        return res.status(200).json(responseModel.success(200, `Nilai Usulan Berhasil Diperbarui`))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllNilaiPenelian = async (req, res) => {
    try{
        const {id} = req.query

        const cekReviewer = await prisma.reviewPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                nilaiPenelitian: {
                    include: {
                        deskripsiPenilaianPenlitian: true
                    }
                }
            }
        })
        
        const cekRataRataAndTotal = await prisma.nilaiPenelitian.groupBy({
            where: {
                judulPenelitian:  cekReviewer.judulPenelitian
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
            // having: {
            //     nilai: {
            //       _avg: {
            //         gt: 75,
            //       },
            //     },
            //   },
        })

        const response = {
            nilaiPenelitian: cekReviewer,
            rataRataAndTotal: cekRataRataAndTotal

        }

        return res.status(201).json(responseModel.success(201, response))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
} 

const getByIdNilaiPenelitian = async (req, res) => {
    try{
        const {id} = req.params

        const cekReviewer = await prisma.reviewPenelitian.findUnique({
            where: {
                id: Number(id)
            }
        })

        // console.log(cekReviewer.judulPenelitian)

        const cekNilaiPenelitian = await prisma.nilaiPenelitian.findMany({
            where: {
                idReviewPenelitian: Number(id)
            },
            include: {
                deskripsiPenilaianPenlitian: true
            }
        })

        // console.log(cekNilaiPenelitian)
        
        const cekRataRataAndTotal = await prisma.nilaiPenelitian.groupBy({
            where: {
                judulPenelitian:  cekReviewer.judulPenelitian,
                idReviewPenelitian: Number(id)
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
            // having: {
            //     nilai: {
            //       _avg: {
            //         gt: 75,
            //       },
            //     },
            //   },
        })

        const response = {
            nilaiPenelitian: cekNilaiPenelitian,
            rataRataAndTotal: cekRataRataAndTotal,
            Reviewer: cekReviewer

        }

        // console.log(response)
        return res.status(201).json(responseModel.success(201, response))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getAllNilaiPengabdian = async (req, res) => {
    try{
        const {id} = req.query

        const cekReviewer = await prisma.reviewPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                nilaiPengabdian: {
                    include: {
                        deskripsiPenilaianPengabdian: true
                    }
                }
            }
        })

        
        const cekRataRataAndTotal = await prisma.nilaiPengabdian.groupBy({
            where: {
                judulPengabdian:  cekReviewer.judulPengabdian
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
            // having: {
            //     nilai: {
            //       _avg: {
            //         gt: 75,
            //       },
            //     },
            //   },
        })

        const response = {
            nilaiPengabdian: cekReviewer,
            rataRataAndTotal: cekRataRataAndTotal

        }

        return res.status(201).json(responseModel.success(201, response))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
} 

const getByIdNilaiPengabdian = async (req, res) => {
    try{
        const {id} = req.params

        const cekReviewer = await prisma.reviewPengabdian.findUnique({
            where: {
                id: Number(id)
            }
        })

        // console.log(cekReviewer.judulPengabdian)

        const cekNilaiPengabdian = await prisma.nilaiPengabdian.findMany({
            where: {
                idReviewPengabdian: Number(id)
            },
            include: {
                deskripsiPenilaianPengabdian: true
            }
        })

        // console.log(cekNilaiPengabdian)
        
        const cekRataRataAndTotal = await prisma.nilaiPengabdian.groupBy({
            where: {
                judulPengabdian:  cekReviewer.judulPengabdian,
                idReviewPengabdian: Number(id)
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
            // having: {
            //     nilai: {
            //       _avg: {
            //         gt: 75,
            //       },
            //     },
            //   },
        })

        const response = {
            nilaiPengabdian: cekNilaiPengabdian,
            rataRataAndTotal: cekRataRataAndTotal,
            Reviewer: cekReviewer

        }

        // console.log(response)
        return res.status(201).json(responseModel.success(201, response))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateNilaiUsulanPengabdian = async (req, res) => {
    try{
        const {nilai, revisi} = req.body
        let dataNilaiPengabdian = ''

        console.log(nilai)

        if (nilai.length !== 0) {
            dataNilaiPengabdian = await prisma.nilaiPengabdian.findUnique({
                where: {
                    id: nilai[0].id
                },
                include: {
                    reviewPengabdian: true
                }
            })
            
            
            nilai.map(async (data, i) => {
                await prisma.nilaiPengabdian.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        nilai: Number(data.nilai),
                    }
                })
    
            })
        }

        const cekReview = await prisma.reviewPengabdian.findUnique({
            where: {
                id: dataNilaiPenelitian.reviewPengabdian.id
            }
        })


        await prisma.reviewPengabdian.update({
            where: {
                id: dataNilaiPengabdian.reviewPengabdian.id
            },
            data: {
                revisi: revisi
            }
        })

        await prisma.penelitian.update({
            where: {
                judul: cekReview.judulPenelitian
            },
            data: {
                statusRevisi: true
            }
        })

        const cekPartisipasi =  await prisma.pengabdian.update({
            where: {
                judul: cekReview.judulPengabdian
            },
            data: {
                statusRevisi: true
            },
            include: {
                partisipasiPengabdian: true
            }
        })

        await prisma.partisipasiPengabdian.update({
            where: {
                id: cekPartisipasi.partisipasiPengabdian[0].id
            },
            data: {
                statusRevisi: true
            }
        })



        return res.status(200).json(responseModel.success(200, `Nilai Usulan Berhasil Diperbarui`))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    updateNilaiUsulanPenelitian,
    getAllNilaiPenelian,
    getByIdNilaiPenelitian,
    getAllNilaiPengabdian,
    getByIdNilaiPengabdian,
    updateNilaiUsulanPengabdian
}