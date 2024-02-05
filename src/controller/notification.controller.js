const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getJumlahNotifBaru = async(req, res) => {
    try{
        const user = req.user[0]

        const {page, row} = pagination(req.query.page, req.query.row)

        const dataAllNotification = await prisma.notification.findMany({
            where: {
                nameUser: user.name,
                statusReadNotification: false
            },
            skip: page,
            take: row,
        })
        
        // console.log(dataAllNotification)

        return res.status(202).json(responseModel.success(202, dataAllNotification))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getAllNotification = async(req, res) => {
    try{
        const user = req.user[0]

        const {page, row} = pagination(req.query.page, req.query.row)


        const dataAllNotification = await prisma.notification.findMany({
            where: {
                nameUser: user.name
            },
            orderBy: {
                id: "desc"
            },
            skip: page,
            take: row,
            include: {
                penelitian: {
                    include: {
                        partisipasiPenelitian: true
                    }
                },pengabdian: {
                    include: {
                        partisipasiPengabdian: true
                    }
                }
            }
        })
        
        // console.log(dataAllNotification)

        return res.status(202).json(responseModel.success(202, dataAllNotification))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const CreateNotification = async(req, res) => {
    try{
        const {nameUser, judulPenelitian, pesan} = req.body

        const createNotification = await prisma.notification.create({
            data: {
                nameUser,
                judulPenelitian,
                pesan
            }
        })

        return res.status(200).json(responseModel.success(200, createNotification))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const UpdateNotificationById = async (req, res) => {
    try{
        const { statusReadNotification } = req.body
        const {id} = req.params

        console.log(statusReadNotification, id)

        const UpdatetificationStatus = await prisma.notification.update({
            where: {
                id: Number(id)
            },
            data: {
                statusReadNotification: statusReadNotification
            }
        })

        return res.status(200).json(responseModel.success(200, UpdatetificationStatus))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, "Internal Setver Error"))
    }
}


module.exports = {
    getAllNotification,
    getJumlahNotifBaru,
    CreateNotification,
    UpdateNotificationById
}


