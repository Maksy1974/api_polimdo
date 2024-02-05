const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const getAllDeskripsiPenilaianPengabdian = async (req, res) => {
    try{

        const {searchSkema} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)


        const options = {
            where: {},
            orderBy: {
                // id: "asc"
                id: "desc"
            },
            skip: page,
            take: row,
            include:{
                skemaPengabdian: true
            }
        }

        if (searchSkema) {
            options.where.skema = {
                contains: searchSkema
            }
        }

        const dataDeskripsiSkema = await prisma.deskripsiPenilaianPengabdian.findMany(options)

        return res.status(202).json(responseModel.success(202, dataDeskripsiSkema))


    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdDeskripsiPenilaianPengabdian = async(req, res) => {
    try{
        const {id} = req.params

        const dataByIdDeskripsiPenilaianPenlitian = await prisma.deskripsiPenilaianPengabdian.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdDeskripsiPenilaianPenlitian ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createDeskripsiPenilaianPengabdian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body

        const data = {
            name: name,
            skema: skema
        }

        const dataCreateDeskripsiPenilaianPengabdian = await prisma.deskripsiPenilaianPengabdian.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateDeskripsiPenilaianPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateDeskripsiPenilaianPengabdian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body
        const {id} = req.params


        const data = {
            name: name,
            skema: skema
        }

        const dataUpdateDeskripsiPenilaianPengabdian = await prisma.deskripsiPenilaianPengabdian.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataUpdateDeskripsiPenilaianPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteDeskripsiPenilaianPengabdian = async (req, res) => {
    try{

        const {id} = req.params

        const datadeleteDeskripsiPenilaianPengabdian = await prisma.deskripsiPenilaianPengabdian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteDeskripsiPenilaianPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    getAllDeskripsiPenilaianPengabdian,
    getByIdDeskripsiPenilaianPengabdian,
    createDeskripsiPenilaianPengabdian,
    updateDeskripsiPenilaianPengabdian,
    deleteDeskripsiPenilaianPengabdian
}
