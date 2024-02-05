const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const getAllDeskripsiPenilaianPenelitian = async (req, res) => {
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
                skemaPenelitian: true
            }
        }

        if (searchSkema) {
            options.where.skema = {
                contains: searchSkema
            }
        }

        const dataDeskripsiSkema = await prisma.deskripsiPenilaianPenlitian.findMany(options)

        return res.status(202).json(responseModel.success(202, dataDeskripsiSkema))


    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdDeskripsiPenilaianPenelitian = async(req, res) => {
    try{
        const {id} = req.params

        const dataByIddeskripsiPenilaianPenlitian = await prisma.deskripsiPenilaianPenlitian.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIddeskripsiPenilaianPenlitian ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createDeskripsiPenilaianPenelitian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body

        const data = {
            name: name,
            skema: skema
        }

        const dataCreateDeskripsiPenilaianPenlitian = await prisma.deskripsiPenilaianPenlitian.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateDeskripsiPenilaianPenlitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateDeskripsiPenilaianPenelitian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body
        const {id} = req.params


        const data = {
            name: name,
            skema: skema
        }

        const dataUpdateDeskripsiPenilaianPenlitian = await prisma.deskripsiPenilaianPenlitian.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataUpdateDeskripsiPenilaianPenlitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteDeskripsiPenilaianPenelitian = async (req, res) => {
    try{

        const {id} = req.params

        const datadeleteDeskripsiPenilaianPenlitian = await prisma.deskripsiPenilaianPenlitian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteDeskripsiPenilaianPenlitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    getAllDeskripsiPenilaianPenelitian,
    getByIdDeskripsiPenilaianPenelitian,
    createDeskripsiPenilaianPenelitian,
    updateDeskripsiPenilaianPenelitian,
    deleteDeskripsiPenilaianPenelitian
}