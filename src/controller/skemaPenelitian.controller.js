const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const GetAllSkemaPenelitian = async (req, res) => {
    try{
        const {searchName} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {},
            orderBy: {
                // id: "asc"
                id: 'desc'
            },
            skip: page,
            take: row
        }

        if (searchName) {
            options.where.name = {
                contains: searchName
            }
        }

        const getAllDataSkemaPenelitian = await prisma.skemaPenelitian.findMany(options)

        return res.status(202).json(responseModel.success(202, getAllDataSkemaPenelitian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const GetByIdSkemaPenelitian = async (req,res) => {
    try{
        const {id} = req.params

        const dataByIdSkemaPenelitian = await prisma.skemaPenelitian.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdSkemaPenelitian ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const CreateSkemaPenelitian = async (req, res) => {
    try{
        const {name} = req.body

        const data = {
            name: name,
        }

        const dataCreateSkema= await prisma.skemaPenelitian.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateSkema))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const UpdateByIdSkemaPenelitian = async (req, res) => {
    try{
        const {id} = req.params
        const {name} = req.body


        const UpdateDataSkemaPenelitian = await prisma.skemaPenelitian.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name
            }
        })

        return res.status(202).json(responseModel.success(202, UpdateDataSkemaPenelitian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const DeleteByIdSkemaPenelitian = async (req, res) => {
    try{
        const {id} = req.params

        console.log('Masuk')

        const dataByIdSkema = await prisma.skemaPenelitian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                deskripsiPenilaianPenlitian: true
            }
        })
       

        if (dataByIdSkema.deskripsiPenilaianPenlitian.length !== 0) {
            return res.status(404).json(responseModel.error(404, `Skema Penelitian Tidak Dapat Dihapus, Karena Masih Terhubung Dengan deskripsi Penilaian Penelitian`))
       }

        const DeleteDataSkemaPenelitian = await prisma.skemaPenelitian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(202).json(responseModel.success(202, DeleteDataSkemaPenelitian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    GetAllSkemaPenelitian,
    GetByIdSkemaPenelitian,
    CreateSkemaPenelitian,
    UpdateByIdSkemaPenelitian,
    DeleteByIdSkemaPenelitian
}