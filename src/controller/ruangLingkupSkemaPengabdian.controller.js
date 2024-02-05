const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const getAllRuangLingkupSkemaPengabdian = async(req, res) => {
    try{
        const {searchSkema} = req.query
        const {skemaPengabdian} = req.query

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

        if (skemaPengabdian) {
            options.where.skema = {
                contains: skemaPengabdian
            }
        }

        const getAllRuangLingkupBySkema = await prisma.ruangLingkupSkemaPengabdian.findMany(options)

        console.log(getAllRuangLingkupBySkema, searchSkema)

        return res.status(202).json(responseModel.success(202, getAllRuangLingkupBySkema))


    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const getByIdRuangLingkupSkemaPengabdian  = async(req, res) => {
    try{
        const {id} = req.params

        const dataByIdRuangLingkupSkemaPengabdian  = await prisma.ruangLingkupSkemaPengabdian.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdRuangLingkupSkemaPengabdian ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createRuangLingkupSkemaPengabdian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body

        const data = {
            name: name,
            skema: skema
        }

        const dataCreateRuangLingkupSkemaPengabdian = await prisma.ruangLingkupSkemaPengabdian.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateRuangLingkupSkemaPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateRuangLingkupSkemaPengabdian = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, skema} = req.body
        const {id} = req.params


        const data = {
            name: name,
            skema: skema
        }

        const dataUpdateRuangLingkupSkemaPengabdian = await prisma.ruangLingkupSkemaPengabdian.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataUpdateRuangLingkupSkemaPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const deleteRuangLingkupSkemaPengabdian = async (req, res) => {
    try{

        const {id} = req.params

        const datadeleteRuangLingkupSkemaPengabdian = await prisma.ruangLingkupSkemaPengabdian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteRuangLingkupSkemaPengabdian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

module.exports = {
    getAllRuangLingkupSkemaPengabdian,
    getByIdRuangLingkupSkemaPengabdian,
    createRuangLingkupSkemaPengabdian,
    updateRuangLingkupSkemaPengabdian,
    deleteRuangLingkupSkemaPengabdian
}