const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const getByIdPenjadwalan = async (req, res) => {
    try{
        const {id} = req.params

        const dataByIdJadwalP3M = await prisma.jadwalP3M.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, dataByIdJadwalP3M ))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const getByAllPenjadwalan = async (req, res) => {
    try{

        const search = req.query.search

        const {searchJudulJadwal} = req.query
        

        const {page, row} = pagination(req.query.page, req.query.row)

        const options = {
            where: {},
            orderBy: {
                id: "asc"
            },
            skip: page,
            take: row,
        }

        if (searchJudulJadwal) {
            options.where.jadwalJudul = {
                contains: searchJudulJadwal
            }
        }

        if (search) {
            options.where.jadwalJudul = search
        }

        // return console.log(options)


        const dataAllJadwalP3M = await prisma.jadwalP3M.findMany(options)

        return res.status(200).json(responseModel.success(200, dataAllJadwalP3M))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const createPenjadwalan = async (req, res) => {
    try{

        // const {id} = req.user[0]

        const {jadwalJudul, tglMulai, tglAkhir, keterangan} = req.body

        const data = {
            jadwalJudul: jadwalJudul,
            tglMulai: tglMulai,
            tglAkhir: tglAkhir
        }

        // return console.log(data)

        if (keterangan) {
            data.keterangan = keterangan
        }

        const dataCreateJadwalP3M = await prisma.jadwalP3M.create({
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataCreateJadwalP3M))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


const updateByIdPenjadwalan = async (req, res) => {
    try{
        // const {id} = req.user[0]

        const {jadwalJudul, tglMulai, tglAkhir, keterangan} = req.body
        const {id} = req.params

        const data = {
            jadwalJudul: jadwalJudul,
            tglMulai: tglMulai,
            tglAkhir: tglAkhir
        }

        if (keterangan) {
            data.keterangan = keterangan
        }

        const dataUpdateJadwalP3M = await prisma.jadwalP3M.update({
            where: {
                id: Number(id)
            },
            data: data
        })

        return res.status(200).json(responseModel.success(200, dataUpdateJadwalP3M))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}

const deleteIdPenjadwalan = async (req, res) => {
    try{

        const {id} = req.params

        const datadeleteJadwalP3M = await prisma.jadwalP3M.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json(responseModel.success(200, datadeleteJadwalP3M))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getByAllPenjadwalan,
    getByIdPenjadwalan,
    createPenjadwalan,
    updateByIdPenjadwalan,
    deleteIdPenjadwalan
}