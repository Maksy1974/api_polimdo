const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()

const GetAllSkemaPengabdian = async (req, res) => {
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

        const getAllDataSkemaPengabdian = await prisma.skemaPengabdian.findMany(options)

        return res.status(202).json(responseModel.success(202, getAllDataSkemaPengabdian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const GetByIdSkemaPengabdian = async (req,res) => {
    try{
        const {id} = req.params

        const dataByIdSkemaPengabdian = await prisma.skemaPengabdian.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdSkemaPengabdian ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const CreateSkemaPengabdian = async (req, res) => {
    try{
        const {name} = req.body

        const data = {
            name: name,
        }

        const dataCreateSkema= await prisma.skemaPengabdian.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateSkema))

    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const UpdateByIdSkemaPengabdian = async (req, res) => {
    try{
        const {id} = req.params
        const {name} = req.body


        const UpdateDataSkemaPengabdian = await prisma.skemaPengabdian.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name
            }
        })

        return res.status(202).json(responseModel.success(202, UpdateDataSkemaPengabdian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const DeleteByIdSkemaPengabdian = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdSkema = await prisma.skemaPengabdian.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                deskripsiPenilaianPengabdian: true
            }
        })
       

        if (dataByIdSkema.deskripsiPenilaianPengabdian.length !== 0) {
            return res.status(404).json(responseModel.error(404, `Skema Pengabdian Tidak Dapat Dihapus, Karena Masih Terhubung Dengan deskripsi Penilaian Pengabdian`))
       }

        const UpdateDataSkemaPengabdian = await prisma.skemaPengabdian.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(202).json(responseModel.success(202, UpdateDataSkemaPengabdian))

    }catch(error){
        console.log(error)   
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}



module.exports = {
    GetAllSkemaPengabdian,
    GetByIdSkemaPengabdian,
    CreateSkemaPengabdian,
    UpdateByIdSkemaPengabdian,
    DeleteByIdSkemaPengabdian
}