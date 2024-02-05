const {body, params, query} = require('express-validator')

const CreatePenelitian = () => {
    return [
        body('judul', 'Judul Penelitian Wajib Diisi').notEmpty(),
        body('skema', 'Skema Penelitian Wajib Diisi').notEmpty(),
        body('abstrak', 'Abstrak Penelitian Wajib Diisi').notEmpty(),
        body('jenisTKT', 'Jenis TKT Penelitian Wajib Diisi').notEmpty(),
        body('jenisTargetTKT', 'Target TKT Penelitian Wajib Diisi').notEmpty(),
        body('biayaLuaran', 'Biaya Luaran Penelitian Wajib Diisi').notEmpty(),
        body('bidangFokus', 'Bidang Fokus Penelitian Wajib Diisi').notEmpty(),
        body('lamaKegiatan', 'Lama Kegiatan Penelitian Wajib Diisi').notEmpty(),
    ]
}

// const UpdatePenelitian = () => {
//     return [
//         body('judul', 'Judul Penelitian Wajib Diisi').notEmpty(),
//         body('skema', 'Skema Penelitian Wajib Diisi').notEmpty(),
//         body('abstrak', 'Abstrak Penelitian Wajib Diisi').notEmpty(),
//         body('jenisTKT', 'Jenis Penelitian TKT Wajib Diisi').notEmpty(),
//         body('jenisTargetTKT', 'Target TKT Penelitian Wajib Diisi').notEmpty(),
//         body('biayaLuaran', 'Biaya Luaran Penelitian Wajib Diisi').notEmpty(),
//         body('bidangFokus', 'Bidang Fokus Penelitian Wajib Diisi').notEmpty(),
//         body('lamaKegiatan', 'Lama Kegiatan Penelitian Wajib Diisi').notEmpty(),
//     ]
// }


module.exports = {
    CreatePenelitian,
    // UpdatePenelitian
}