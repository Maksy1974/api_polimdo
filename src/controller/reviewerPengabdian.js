const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getAllReviewerPengabdian = async (req,res) => {
    try{
        const {judul, idJudulPengabdian} = req.query
        const user = req.user[0]

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        if (idJudulPengabdian) {
            const cekPengabdian = await prisma.pengabdian.findUnique({
                where: {
                    id: Number(idJudulPengabdian)
                },
                include: {
                    reviewPengabdian: true
                }
            })

            return res.status(200).json(responseModel.success(200, cekPengabdian))

        }

        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

        if (searchJudul) {
            options.where.judulPengabdian = {
                contains: searchJudul
            }
        }

        if (user.roleId === 1) {

            options.where.judulPengabdian = judul

            options.include = {
                user: true,
                pengabdian: true
            }
            
            const getAllReviewPengabdianByNamePengabdian = await prisma.reviewPengabdian.findMany(options)


            // console.log(getAllReviewPengabdianByNamePengabdian)
            return res.status(200).json(responseModel.success(200, getAllReviewPengabdianByNamePengabdian))

        }

        if (user.roleId === 2) {   
            
            options.where.nameUser = user.name

            options.include = {
                user: true,
                pengabdian: {
                    include: {
                        reviewPengabdian:true
                    }
                },
                nilaiPengabdian: true
            }

            const getAllReviewerPengabdianForUserReviewer = await prisma.reviewPengabdian.findMany(options)
    
    
            return res.status(200).json(responseModel.success(200, getAllReviewerPengabdianForUserReviewer))
        }



    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByIdReviewerPengabdian = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdReviewerPengabdian = await prisma.reviewPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: true,
                pengabdian: true,
                nilaiPengabdian: {
                    include: {
                        deskripsiPenilaianPengabdian: true
                    }
                }
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdReviewerPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createReviewerPengabdian = async (req, res) => {
    try{
        const data = req.body

        const nameUserCek = data.map((value) => value.nameUser)

        
        const cekDataUser = await prisma.user.findMany({
            where: {
                name: {in: nameUserCek}
            }
        })

        const CekDuplikatUser  = nameUserCek.some((e, i, arr) => arr.indexOf(e) !== i)

        if (CekDuplikatUser === true) {
            return res.status(404).json(responseModel.error(404, `Duplikat Nama Reviewer`))
        }

        const valuesIsYes = []

        cekDataUser.map((data) => {
            valuesIsYes.push(data.name)
        })

        
        const dataNot = []
        
        let newDataNotDaftar = nameUserCek.filter((nama) => {
            const redy = valuesIsYes.includes(nama)
            if (redy === false) {
                return dataNot.push(nama)
            }
        })


        if (newDataNotDaftar.length !== 0) {
            
            console.log(newDataNotDaftar)
    
            return res.status(404).json(responseModel.error(404, `User ${newDataNotDaftar.map((data) => data)} Tidak Terdaftar`))

        }


        const dataNotificationMahasiswa = data.map(data => {
            return {
                nameUser: data.nameUser,
                judulPengabdian: data.judulPengabdian,
                pesan: "Berikan Review Pengabdian"
            }
        })
        
        
        const createReviewerPengabdian = await prisma.reviewPengabdian.createMany({
            data: data
        })
        
        await prisma.Notification.createMany({
            data: dataNotificationMahasiswa
        })

        return res.status(200).json(responseModel.success(200, createReviewerPengabdian))
        

    
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateReviewerPengabdian = async (req, res) => {
    try{
        
        const {Data, idDeleteReviewer} = req.body

        
        const nameUserCek = Data.map((value) => value.nameUser)
        
        
        const cekDataUser = await prisma.user.findMany({
            where: {
                name: {in: nameUserCek}
            }
        })

        const valuesIsYes = []

        cekDataUser.map((data) => {
            valuesIsYes.push(data.name)
        })

        
        const dataNot = []
        
        let newDataNotDaftar = nameUserCek.filter((nama) => {
            const redy = valuesIsYes.includes(nama)
            if (redy === false) {
                return dataNot.push(nama)
            }
        })


        if (newDataNotDaftar.length !== 0) {
            
            console.log(newDataNotDaftar)
    
            return res.status(404).json(responseModel.error(404, `User ${newDataNotDaftar.map((data) => data)} Tidak Terdaftar`))

        }

        const nameUserCekCreate  = nameUserCek.some((e, i, arr) => arr.indexOf(e) !== i)

        if (nameUserCekCreate === true) {
            return res.status(404).json(responseModel.error(404, `Duplikat Nama Reviewer`))
        }


        console.log(idDeleteReviewer)

        if (idDeleteReviewer.length !== 0) {
            const dataDeleteReviwer =  await prisma.reviewPengabdian.findMany({
                where: {
                    id: {in: idDeleteReviewer}
                }
            })

            const dataCreateNotif = {}
            
            await prisma.reviewPengabdian.deleteMany({
                where: {
                    id: {in: idDeleteReviewer}
                }
            })

            dataDeleteReviwer.map((data) => {
                dataCreateNotif.nameUser = data.nameUser
                dataCreateNotif.judulPengabdian = data.judulPengabdian
                dataCreateNotif.pesan = "Review Pengabdian Dibatalkan"
            })

            await prisma.notification.createMany({
                data: dataCreateNotif
            })

        }

       

        Data.map(async (data,i ) => {
            // console.log(data)
            if (!data.id) {

                await prisma.notification.create({
                    data: {
                        nameUser : data.nameUser,
                        judulPengabdian : data.judulPengabdian,
                        pesan : "Berikan Review Pengabdian"
                    }
                })
                
                await prisma.reviewPengabdian.create({
                    data: {
                        nameUser: data.nameUser,
                        judulPengabdian: data.judulPengabdian,
                        sebagai: data.sebagai
                    }
                })

            }else{

                await prisma.notification.create({
                    data: {
                        nameUser : data.nameUser,
                        judulPengabdian : data.judulPengabdian,
                        pesan : "Berikan Review Pengabdian"
                    }
                })
                
                await prisma.reviewPengabdian.update({
                    where: {
                        id: data.id
                  },
                  data: {
                    nameUser: data.nameUser,
                    judulPengabdian: data.judulPengabdian,
                    sebagai: data.sebagai
                  }
                })
            }
        })


        return res.status(200).json(responseModel.success(200, `Reviewer Pengabdian Berhasil Diperbarui`))


    }catch(error) {
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateReviewerByUserPengabdian = async (req, res) => {
    try{
        const {id} = req.params
        const {nilai, revisi} = req.body
        const dataUserPartisipasi = []
        const idNilai = []


        
        
        const cekByIdDataReviewer = await prisma.reviewPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                pengabdian: {
                    include: {
                        partisipasiPengabdian: true
                    }
                },
                nilaiPengabdian: true
            }
        })


        // return console.log(cekByIdDataReviewer.pengabdian.partisipasiPengabdian[0].nameUser)


        nilai.map((data, i) => {
           data.idReviewPengabdian = cekByIdDataReviewer.id
           data.judulPengabdian = cekByIdDataReviewer.judulPengabdian

           if (data?.nilai) {
               data.nilai = Number(data.nilai)
           }
        })

        
        if (revisi) {

            await prisma.partisipasiPengabdian.updateMany({
                where: {
                    judulPengabdian: cekByIdDataReviewer.judulPengabdian
                },
                data: {
                    statusRevisi: true
                },
            })

            await prisma.pengabdian.update({
                where: {
                    id: cekByIdDataReviewer.pengabdian.id
                },
                data: {
                    statusRevisi: true
                }
            })

            await prisma.notification.create({
                data: {
                    nameUser: cekByIdDataReviewer.pengabdian.partisipasiPengabdian[0].nameUser,
                    judulPengabdian: cekByIdDataReviewer.judulPengabdian,
                    pesan: "Pengabdian Terdaftar Revisi"
                }
            })

        }

        if (cekByIdDataReviewer.nilaiPengabdian.length !== 0) {
            
            await prisma.nilaiPengabdian.deleteMany({
                where: {
                    idReviewPengabdian: cekByIdDataReviewer.id
                }
            })
            
        }

        await prisma.nilaiPengabdian.createMany({
            data: nilai
        })
        
        
        const dataUpdateReviewerByUserPengabdian = await prisma.reviewPengabdian.update({
            where: {
                id: cekByIdDataReviewer.id
            },
            data: {
                revisi: revisi
            },
            include: {
                nilaiPengabdian: true
            }
        })


        return res.status(200).json(responseModel.success(200, dataUpdateReviewerByUserPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteReviewerPengabdian = async (req, res) => {
    try{
        const {id} = req.params

        console.log(id)

        const deleteReviewerPengabdian = await prisma.reviewPengabdian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, deleteReviewerPengabdian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllReviewerPengabdian,
    getByIdReviewerPengabdian,
    createReviewerPengabdian,
    updateReviewerPengabdian,
    updateReviewerByUserPengabdian,
    deleteReviewerPengabdian,
}