const responseModel = require('../utility/responModel')
const { PrismaClient } = require('@prisma/client')
const jwtWebToken = require("../utility/jwtWebtoken")
const cloudinary = require('../utility/cloudinary')
const uploadCloudinary = async (path, opts) => await cloudinary.CloudinaryUpload(path,opts)
const deleteCloudinary = async (opts) => await cloudinary.CloudinaryDelete(opts)
const fs = require('fs')
const pagination = require('../utility/pagenation')


const prisma = new PrismaClient()


const login = async (req, res, next) => {
  try{
    const {email, password} = req.body
    let jwt = ''
    
    const loginEmail = await prisma.user.findUnique({
      where: {
        email: email
      },include: {
        jurusan: true,
        role: true,
      }
    
    })

    const loginUserName = await prisma.user.findUnique({
      where: {
        username: email
      },include: {
        jurusan: true,
        role: true,
      }
    })

    if (loginEmail === null && loginUserName === null) {
        return res.status(404).json(responseModel.error(404, `Email Atau Username Tidak Terdaftar`))
    }
    
    if (loginEmail || loginUserName) {

      if (loginEmail) {
        
        if (loginEmail.password !== password) {
          return res.status(404).json(responseModel.error(404, `Password Tidak Cocok, Masukan kembali password yang sesuai`))
        }

        jwt = jwtWebToken(loginEmail)
      }else{
        
        if (loginUserName.password !== password) {
          return res.status(404).json(responseModel.error(404, `Password Tidak Cocok, Masukan kembali password yang sesuai`))
        }

        jwt = jwtWebToken(loginUserName)
      }

    }

    return res.status(200).json(responseModel.success(200, jwt))

  }catch(error){
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}

const createUser = async (req, res, next) => {
  try {
    
    const {name, nomor_tlp, email, password, username, nidn, nim, jurusanId, roleId} = req.body

    const dataCreate = {
      name: name,
      email: email,
      password: password,
      username: username,
      roleId: Number(roleId),
    }

    if (nomor_tlp) {
      dataCreate.nomor_tlp = nomor_tlp
    }
    if (jurusanId) {
      dataCreate.jurusanId = jurusanId
    }

    if(nidn || nim){
      nidn === null ? dataCreate.nim = nim : dataCreate.nidn = nidn 
    }
    
    const users = await prisma.User.create({
      data: dataCreate
    })
    return res.status(201).json(responseModel.success(201, users))

  } catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}


const getAllUser = async (req, res, next) => {
  try {

    const {nidn, name, Role, jabatanKampus} = req.query
    
    const {page, row} = pagination(req.query.page, req.query.row)

    const options = {
      where: {},
      orderBy: {
        id: "asc"
      },
      skip: page,
      take: row,
      include: {
        jurusan: true,
        role: true,
        prodi: true,
      } 
    }

    if (nidn) {
      options.where.nidn = String(nidn)
    }

    if (Role) {
      options.where.roleId = Number(Role)
    }

    if (name) {
      options.where.name = {
        contains: name
      }
    }

    if (jabatanKampus) {
      options.where.jabtan_kampus = {
        contains: jabatanKampus
     } 
    }
    

    // if (searchName?.length == 0) {
    //   return res.status(201).json(responseModel.success(201, []))
    // }
    
    const users = await prisma.User.findMany(options)

    console.log(users)

    return res.status(201).json(responseModel.success(201, users))
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}



const getByIdUser = async (req, res, next) => {
  try {

    const {id} = req.params
   
    const users = await prisma.User.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        jurusan: true,
        role: true,
        prodi: true,
        jenisKelamin: true
        // {
        //   include: {
        //     kotaOrKabupaten: {
        //       include: {
        //         kecamatan: true
        //       }
        //     }
        //   }
        // }
      }
    })
    return res.status(200).json(responseModel.success(200, users))
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}

const updateUserByIdRoleAdmin = async (req,res) => {
  try{
    const {id} = req.params
    // const {name, roleId} = req.user[0]
    const {name, email, password, username, roleId, jabatan_kampus} = req.body

    const dataUserUpdate = await prisma.user.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        jurusan: true,
        prodi: true
      }
    })

    // return console.log(dataUserUpdate)

    const dataUpdate = {
      name: name,
      email: email,
      username: username,
      roleId: Number(roleId),
      password: password
    }

    // return console.log(jabatan_kampus)
    if (jabatan_kampus.length !== 0) {
      if (jabatan_kampus == "Kepala Jurusan" && !dataUserUpdate.jurusanId) {
          return res.status(404).json(responseModel.error(404, 'User Belum Melengkapi Data Jurusan'))
      }else if (jabatan_kampus == "Kepala Program Studi" && !dataUserUpdate.prodiId) {
          return res.status(404).json(responseModel.error(404, 'User Belum Melengkapi Data Program Studi'))
      }


      dataUpdate.jabtan_kampus = jabatan_kampus
    }

    const users = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: dataUpdate
    })
    

    return res.status(200).json(responseModel.success(200, users))


  }catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}


const updateUserById = async (req, res, next) => {
  try {
    const {id} = req.params
    const user = req.user[0]

    const {name, nomor_tlp, email, password, username, nidn, nim, prodiId, roleId,jurusanId, alamat, jnsKelaminName, jabatan, pendidikanTerakhir, sinta, tanggalLahir, tempatLahir} = req.body

    console.log(jnsKelaminName)
    const dataUpdate = {
      name: name,
      email: email,
      username: username,
      roleId: Number(roleId),
      jnsKelaminName: jnsKelaminName,
      nomor_tlp: nomor_tlp,
      jurusanId: Number(jurusanId),
      prodiId: Number(prodiId),
      jabatan_fungsional: jabatan,
      pendidikan_terakhir: pendidikanTerakhir,
      sinta: sinta,
      tanggalLahir: tanggalLahir,
      tempat_lahir: tempatLahir,
      alamat: alamat
    }

    if (nidn) {
      if (!jabatan) {
        return res.status(404).json(responseModel.error(404, 'jabatan Wajib Diisi'))
      }
      if (!sinta) {
        return res.status(404).json(responseModel.error(404, 'Sinta Wajib Diisi'))
      }
    }
    
    if (password) {
      if (password !== user.password) {
            return res.status(404).json(responseModel.error(404, 'Password Anda Salah'))
        }

      if(req.body.newPassword !== req.body.newPasswordOne) {
          return res.status(404).json(responseModel.error(404, 'Password Baru Tidak Sama'))
      }
    }


    if (req.file !== undefined) {

      const optionsCloudinary =  {
        type: "image",
        folder: "P3MPolimdo/image/profile_picture"
      }

      const UploadImg = await uploadCloudinary(req.file.path, optionsCloudinary)

      // Mendestructuring publicId sebagai profile_picture_id,dan url hasil optimisasi gambar
      const {public_id,eager} = UploadImg

      // eager is the result of optimization image
      const secure_url = eager[0].secure_url

      dataUpdate.profile_picture = secure_url

      dataUpdate.profile_picture_id = public_id

      if (req.user[0].profile_picture_id) {
        await deleteCloudinary(req.user[0].profile_picture_id)
      }

      console.log(req.user[0].profile_picture_id)

      fs.unlinkSync(req.file.path)      

    }


    console.log(nidn, nim, jurusanId, username, id, dataUpdate)

    if(nidn || nim){
      nidn == null ? dataUpdate.nim = nim : dataUpdate.nidn = nidn
    }
    
    const users = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: dataUpdate
    })
    

    return res.status(200).json(responseModel.success(200, users))
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}

const deleteUserById = async (req, res, next) => {
  try {

    const {id} = req.params
    const deleteUsers = await prisma.User.delete({
      where: {
        id: Number(id)
      }
    })
    return res.status(200).json(responseModel.success(200, deleteUsers))
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseModel.error(500, `Internal Server Error`))
  }
}

module.exports = {
    login,
    createUser,
    getAllUser,
    getByIdUser,
    updateUserByIdRoleAdmin,
    updateUserById,
    deleteUserById
}