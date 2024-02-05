const { validationResult } = require('express-validator');
const response = require('./../utility/responModel');
const fs = require('fs')

const validate = (req,res,next) => {
    try {
        // Mengambil semua error yang terjadi saat melakukan validasi di middleware sebelumnya
        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
            // Delete file uploaded by multer(previous middleware) in ~/public/static/images
            if (req.file) {
                fs.unlinkSync(req.file.path);
            } else if (req.files) {
                // jika multer menggunakan upload.array
                // Delete file uploaded by multer(previous middleware) in ~/public/static/images
                req.files.forEach((file) => {
                    fs.unlinkSync(file.path);
                })
            }
            // Semua data error disimpan di variabel errors.array()
            const dataErrorFromExpressValidator = errors.array();

            // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
            return res.status(400).json(response.error(400,dataErrorFromExpressValidator));
        } else {
            // Jika tidak ada error,maka akan masuk ke controller
            next();
        }

    } catch (error) {
        // menghapus gambar jika terjadi error pada validasi
        fs.unlinkSync(req.file.path);
        // menampilkan error
        console.log(error);
        // Saat mau mengembalikan response dari request wajib melakukan return agar server tidak error
        return res.status(500).json(response.error(500,'Internal Server Error'))
    }
}

module.exports = validate;
