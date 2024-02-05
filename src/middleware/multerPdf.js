const responModel = require('../utility/responModel')
const multer = require('multer')

const fs = require('fs')

const store = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileLocation = './public/static/filePdf';
        if (!fs.existsSync(fileLocation)) fs.mkdirSync(fileLocation, {recursive: true})
        cb(null, fileLocation)
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, + Date.now() + '-' + file.fieldname + `.${fileType}`)
    }
})


const fileFilterImage = (req,file,cb) => {
    const typeValid = ['application/pdf']
    if (!typeValid.includes(file.mimetype)) {
        // Return agar tidak melanjutkan
        cb(null,false);
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'))
    } else {
        cb(null,true);
    }
}



const MulterError = (err, req, res, next) => {
    const makeResponseObj = {
        location : err.field
    }
    // Mendapatkan Error multer dari filed MulterError
    console.log('MASOKKKKK')
    if (err instanceof multer.MulterError) {
        // if (err.code === 'LIMIT_FILE_SIZE') {
            // console.log('inside multer limit file size')
        //     makeResponseObj.message = 'file terlalu besar,maksimal 2mb';
        //     return res.status(400).json(response.error(400,makeResponseObj));
        // }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            console.log('inside multer unexpected file')
            makeResponseObj.message = 'Format File Hanya bisa pdf';
            return res.status(400).json(response.error(400,makeResponseObj));
        } else {
            return res.status(400).json(response.error(400,err.code));
        }
    } else if (err) {
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }
    next()


}

const upload = multer({
    storage: store,
    fileFilter :fileFilterImage,
    // limits: {
    //     fileSize: 20000000
    // }
})

module.exports = {
    upload,
    MulterError
}