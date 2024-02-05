const router = require('express').Router()
const {getByAllLaporanKemajuan, getByIdLaporanKemajuan, CreateLaporanKemajuan, UpdateByIdLaporanKemajuan, DeleteByIdLaporanKemajuan} = require('../controller/laporanKemajuan.controller')
const {getByAllLaporanAkhir, getByIdLaporanAkhir, CreateLaporanAkhir, UpdateByIdLaporanAkhir, DeleteByIdLaporanAkhir} = require('../controller/laporanAkhir.controller')
const {getByReviewerlaporan, createReviewerlaporan, getAllAssesmentKeluaranHasil, updateReviewerLaporan, updateByNilaiReviewerlaporan} = require('../controller/laporan.controller')
const authJWT = require('../middleware/passport-jwt')
const {upload, MulterError} = require('../middleware/multerPdf')


// Kemajuan
router.get('/kemajuan', authJWT, getByAllLaporanKemajuan)
router.get('/kemajuan/:id', authJWT, getByIdLaporanKemajuan)
router.post('/kemajuan', authJWT, upload.single('laporan_kemajuan_pdf'), MulterError, CreateLaporanKemajuan)
router.patch('/kemajuan/:id', upload.single('laporan_kemajuan_pdf'), MulterError, authJWT, UpdateByIdLaporanKemajuan)
router.delete('/kemajuan/:id', authJWT, DeleteByIdLaporanKemajuan)

// Akhir
router.get('/akhir', authJWT, getByAllLaporanAkhir)
router.get('/akhir/:id', authJWT, getByIdLaporanAkhir)
router.post('/akhir', authJWT, upload.single('laporan_akhir_pdf'), MulterError, CreateLaporanAkhir)
router.patch('/akhir/:id', upload.single('laporan_akhir_pdf'), MulterError, authJWT, UpdateByIdLaporanAkhir)
router.delete('/akhir/:id', authJWT, DeleteByIdLaporanAkhir)


router.get('/assesment', authJWT, getAllAssesmentKeluaranHasil)
router.post('/review', authJWT, createReviewerlaporan)
router.get('/reviewer/:id', authJWT, getByReviewerlaporan)
router.patch('/review', authJWT, updateReviewerLaporan)
router.patch('/reviewer/:id', authJWT, updateByNilaiReviewerlaporan)




module.exports = router