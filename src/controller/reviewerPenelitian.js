const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getAllReviewerPenelitian = async (req,res) => {
    try{
        const {judul, idJudulPenelitian} = req.query
        const user = req.user[0]

        const {searchJudul} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        if (idJudulPenelitian) {
            const cekPenelitian = await prisma.penelitian.findUnique({
                where: {
                    id: Number(idJudulPenelitian)
                },
                include: {
                    reviewPenelitian: true
                }
            })

            return res.status(200).json(responseModel.success(200, cekPenelitian))

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
            options.where.judulPenelitian = {
                contains: searchJudul
            }
        }

        if (user.roleId === 1) {

            options.where.judulPenelitian = judul

            options.include = {
                user: true,
                penelitian: true
            }
            
            const getAllReviewPenelitianByNamePenelitian = await prisma.reviewPenelitian.findMany(options)


            // console.log(getAllReviewPenelitianByNamePenelitian)
            return res.status(200).json(responseModel.success(200, getAllReviewPenelitianByNamePenelitian))

        }

        if (user.roleId === 2) {   
            
            options.where.nameUser = user.name

            options.include = {
                user: true,
                penelitian: {
                    include: {
                        reviewPenelitian:true
                    }
                },
                nilaiPenelitian: true
            }

            const getAllReviewerPenelitianForUserReviewer = await prisma.ReviewPenelitian.findMany(options)
    
    
            return res.status(200).json(responseModel.success(200, getAllReviewerPenelitianForUserReviewer))
        }



    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByIdReviewerPenelitian = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdReviewerPenelitian = await prisma.reviewPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: true,
                penelitian: true,
                nilaiPenelitian: {
                    include: {
                        deskripsiPenilaianPenlitian: true
                    }
                }
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdReviewerPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const createReviewerPenelitan = async (req, res) => {
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
                judulPenelitian: data.judulPenelitian,
                pesan: "Berikan Review Penelitian"
            }
        })
        
        
        const createReviewerPenelitian = await prisma.ReviewPenelitian.createMany({
            data: data
        })
        
        await prisma.Notification.createMany({
            data: dataNotificationMahasiswa
        })

        return res.status(200).json(responseModel.success(200, createReviewerPenelitian))
        

    
    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateReviewerPenelitian = async (req, res) => {
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
            const dataDeleteReviwer =  await prisma.reviewPenelitian.findMany({
                where: {
                    id: {in: idDeleteReviewer}
                }
            })

            const dataCreateNotif = {}
            
            await prisma.reviewPenelitian.deleteMany({
                where: {
                    id: {in: idDeleteReviewer}
                }
            })

            dataDeleteReviwer.map((data) => {
                dataCreateNotif.nameUser = data.nameUser
                dataCreateNotif.judulPenelitian = data.judulPenelitian
                dataCreateNotif.pesan = "Review Penelitian Dibatalkan"
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
                        judulPenelitian : data.judulPenelitian,
                        pesan : "Berikan Review Penelitian"
                    }
                })
                
                await prisma.reviewPenelitian.create({
                    data: {
                        nameUser: data.nameUser,
                        judulPenelitian: data.judulPenelitian,
                        sebagai: data.sebagai
                    }
                })

            }else{

                await prisma.notification.create({
                    data: {
                        nameUser : data.nameUser,
                        judulPenelitian : data.judulPenelitian,
                        pesan : "Berikan Review Penelitian"
                    }
                })
                
                await prisma.reviewPenelitian.update({
                    where: {
                        id: data.id
                  },
                  data: {
                    nameUser: data.nameUser,
                    judulPenelitian: data.judulPenelitian,
                    sebagai: data.sebagai
                  }
                })
            }
        })


        return res.status(200).json(responseModel.success(200, `Reviewer Penelitian Berhasil Diperbarui`))


    }catch(error) {
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateReviewerByUserPenelitian = async (req, res) => {
    try{
        const {id} = req.params
        const {nilai, revisi} = req.body
        const dataUserPartisipasi = []
        const idNilai = []



        // return console.log(req.body)
        
        
        const cekByIdDataReviewer = await prisma.reviewPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                penelitian: {
                    include: {
                        partisipasiPenelitian: true
                    }
                },
                nilaiPenelitian: true
            }
        })


        // return console.log(cekByIdDataReviewer.penelitian.partisipasiPenelitian[0].nameUser)


        nilai.map((data, i) => {
           data.idReviewPenelitian = cekByIdDataReviewer.id
           data.judulPenelitian = cekByIdDataReviewer.judulPenelitian

           if (data?.nilai) {
               data.nilai = Number(data.nilai)
           }
        })
        
        if (revisi) {

            await prisma.partisipasiPenelitian.updateMany({
                where: {
                    judulPenelitian: cekByIdDataReviewer.judulPenelitian
                },
                data: {
                    statusRevisi: true
                },
            })

            await prisma.penelitian.update({
                where: {
                    id: cekByIdDataReviewer.penelitian.id
                },
                data: {
                    statusRevisi: true
                }
            })

            await prisma.notification.create({
                data: {
                    nameUser: cekByIdDataReviewer.penelitian.partisipasiPenelitian[0].nameUser,
                    judulPenelitian: cekByIdDataReviewer.judulPenelitian,
                    pesan: "Penelitian Terdaftar Revisi"
                }
            })

        }

        if (cekByIdDataReviewer.nilaiPenelitian.length !== 0) {
            
            await prisma.nilaiPenelitian.deleteMany({
                where: {
                    idReviewPenelitian: cekByIdDataReviewer.id
                }
            })
            
        }

        await prisma.NilaiPenelitian.createMany({
            data: nilai
        })
        
        
        const dataUpdateReviewerByUserPenelitian = await prisma.reviewPenelitian.update({
            where: {
                id: cekByIdDataReviewer.id
            },
            data: {
                revisi: revisi
            },
            include: {
                nilaiPenelitian: true
            }
        })


        return res.status(200).json(responseModel.success(200, dataUpdateReviewerByUserPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteReviewerPenelitian = async (req, res) => {
    try{
        const {id} = req.params

        console.log(id)

        const deleteReviewerPenelitian = await prisma.reviewPenelitian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, deleteReviewerPenelitian))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllReviewerPenelitian,
    getByIdReviewerPenelitian,
    createReviewerPenelitan,
    updateReviewerPenelitian,
    updateReviewerByUserPenelitian,
    deleteReviewerPenelitian,
}