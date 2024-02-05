const {body, params, query} = require('express-validator')

const login = () => {
    return [
        body('email','email Or Username wajib diisi').notEmpty(),
        body('password','password wajib diisi').notEmpty(),
    ]
}

const update = () => {
    return [
        body('username', 'username Wajib Diisi').notEmpty(),
        body('name', 'name Wajib Diisi').notEmpty(),
        body('nomor_tlp', 'nomor telepon Wajib Diisi').notEmpty(),
        body('email', 'email Wajib Diisi').notEmpty(),
        body('jurusanId', 'Jurusan Wajib Diisi').notEmpty(),
        body('prodiId', 'prodi Wajib Diisi').notEmpty(),
        body('jnsKelaminName', 'jenis kelamin Wajib Diisi').notEmpty(),
        body('pendidikanTerakhir', 'Pendidikan Terakhir Wajib Diisi').notEmpty(),
        body('tanggalLahir', 'Tanggal Lahir Wajib Diisi').notEmpty(),
        body('tempatLahir', 'Tempat Lahir Wajib Diisi').notEmpty(),
        body('alamat', 'Alamat Wajib Diisi').notEmpty(),
    ]
}


module.exports = {
    login,
    update
}