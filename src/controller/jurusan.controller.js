const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getByIdJurusan = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdJurusan = await prisma.jurusan.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdJurusan ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllJurusan = async (req, res) => {
    try{
        const {searchName} = req.query

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
            include: {
                prodi: true,
            } 
        }

    
        if (searchName) {
            options.where.name = {
                contains: searchName
            }
        }


        const dataAllJurusan = await prisma.jurusan.findMany(options)

        return res.status(200).json(responseModel.success(200, dataAllJurusan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createJurusan = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {name} = req.body

        const data = {
            name: name,
        }

        const dataCreateJurusan= await prisma.jurusan.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateJurusan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByIdJurusan = async (req, res) => {
    try{
        // const {id} = req.user[0]

        const {name} = req.body
        const {id} = req.params


        const data = {
            name: name,
        }

        const dataUpdateJurusan = await prisma.jurusan.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        prisma.prodi.update({
            where: {
                nameJurusan: name
            },
            data: {
                nameJurusan: name
            }
        })

        return res.status(200).json(responseModel.success(200, dataUpdateJurusan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteIdJurusan = async (req, res) => {
    try{

        const {id} = req.params

        const dataByIdJurusan = await prisma.jurusan.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                prodi: true
            }
        })

        if (dataByIdJurusan.prodi.length !== 0) {
             return res.status(404).json(responseModel.error(404, `Jurusan Tidak Dapat Dihapus, Karena Masih Terhubung Dengan Prodi`))
        }

        const datadeleteJurusan = await prisma.jurusan.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteJurusan))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getByAllJurusan,
    getByIdJurusan,
    createJurusan,
    updateByIdJurusan,
    deleteIdJurusan
}