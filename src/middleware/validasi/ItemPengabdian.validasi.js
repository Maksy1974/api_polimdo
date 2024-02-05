const {body, params, query} = require('express-validator')

const CreatePengabdian = () => {
    return [
        body('judul', 'Judul Pengabdian Wajib Diisi').notEmpty(),
        body('skema', 'Skema Pengabdian Wajib Diisi').notEmpty(),
        body('abstrak', 'Abstrak Pengabdian Wajib Diisi').notEmpty(),
        body('temaBidangFokus', 'Tema Bidang Fokus Pengabdian Wajib Diisi').notEmpty(),
        body('bidangFokus', 'Bidang Fokus Pengabdian Wajib Diisi').notEmpty(),
        body('ruangLingkup', 'Ruang Lingkup Pengabdian Wajib Diisi').notEmpty(),
        body('lamaKegiatan', 'Lama Kegiatan Pengabdian Wajib Diisi').notEmpty(),
    ]
}

// const UpdatePengabdian = () => {
//     return [
//         body('judul', 'Judul Pengabdian Wajib Diisi').notEmpty(),
//         body('skema', 'Skema Pengabdian Wajib Diisi').notEmpty(),
//         body('abstrak', 'Abstrak Pengabdian Wajib Diisi').notEmpty(),
//         body('temaBidangFokus', 'Tema Bidang Fokus Pengabdian Wajib Diisi').notEmpty(),
//         body('bidangFokus', 'Bidang Fokus Pengabdian Wajib Diisi').notEmpty(),
//         body('ruangLingkup', 'Ruang Lingkup Pengabdian Wajib Diisi').notEmpty(),
//         body('lamaKegiatan', 'Lama Kegiatan Pengabdian Wajib Diisi').notEmpty(),
//     ]
// }


module.exports = {
    CreatePengabdian,
    // UpdatePengabdian
}