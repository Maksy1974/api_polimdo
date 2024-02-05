const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getByIdProdi = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdProdi = await prisma.prodi.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdProdi ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllProdi = async (req, res) => {
    try{

        const {nameJurusan} = req.query

        const {searchName} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)


        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

    
        if (searchName) {
            options.where.name = {
                contains: searchName
            }
        }

        
        if (nameJurusan) {

            const dataAllProdi = await prisma.prodi.findMany({
                where: {
                    nameJurusan: nameJurusan
                }
            })
    
            return res.status(200).json(responseModel.success(200, dataAllProdi))
        }

        const dataAllProdi = await prisma.prodi.findMany(options)
    
        return res.status(200).json(responseModel.success(200, dataAllProdi))



    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createProdi = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name, nameJurusan} = req.body

        const data = {
            name: name,
            nameJurusan: nameJurusan
        }

        const dataCreateProdi = await prisma.prodi.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateProdi))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByIdProdi = async (req, res) => {
    try{
        // const {id} = req.user[0]

        const {name, nameJurusan} = req.body
        const {id} = req.params


        const data = {
            name: name,
            nameJurusan: nameJurusan
        }

        const dataUpdateProdi = await prisma.prodi.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataUpdateProdi))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteIdProdi = async (req, res) => {
    try{

        const {id} = req.params

        const datadeleteProdi = await prisma.prodi.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteProdi))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getByAllProdi,
    getByIdProdi,
    createProdi,
    updateByIdProdi,
    deleteIdProdi
}