const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../utility/cloudinary')
// const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)


const prisma = new PrismaClient()

const getAllRevisiPenelitian = async (req, res) => {
    try{

        const dataGetRevisiPenelitian = await prisma.reviewPenelitian.findMany({
            where: {
                NOT: {
                    revisi: null
                },
            },
            include: {
                penelitian: true
            }
        })

        return res.status(200).json(responseModel.success(200, dataGetRevisiPenelitian))


    }catch(error){
        console.log(error)
        return res.status(500).json(responseModel.error(500, `Internal Server Error`))
    }
}


module.exports = {
    getAllRevisiPenelitian
}
