const router = require('express').Router()
const {getAllAssesmentPengabdian, getPengabdianForNilai, getPengabdianArrov, getAllPengabdianByKapro, getAllLolosPengabdian, getAllSeleksiPengabdian, getAllDitolakPengabdian, getByAllPengabdianForCatatanHarian, getByAllPengabdianForLaporan, getAllKeangotaanPengabdian, getStatisticByUser, getAllDiajukanPengabdian, UpdateStatusPartisiPasiPengabdian, getAllPengusulPengabdian, getByAllPengabdian, getByIdPengabdian, createPengabdiann, updatePengabdian, deletePengabdian } = require('../controller/pengabdian.contoller')
const authJWT = require('../middleware/passport-jwt')
const {upload, MulterError} = require('../middleware/multerPdf')
const pengabdianValidator = require('../middleware/validasi/ItemPengabdian.validasi')
const validasiCreatePengabdian = require('../middleware/conditionsCreatePengabdian')
const validate = require('./../middleware/expressValidator')


router.get('/', authJWT, getByAllPengabdian)
router.get('/assesment', authJWT, getAllAssesmentPengabdian)
router.get('/nilai', authJWT, getPengabdianForNilai)
router.get('/approv', authJWT, getPengabdianArrov)
router.get('/prodi', authJWT, getAllPengabdianByKapro)
router.get('/seleksi', authJWT, getAllSeleksiPengabdian)
router.get('/lolos', authJWT, getAllLolosPengabdian)
router.get('/ditolak', authJWT, getAllDitolakPengabdian)
router.get('/catatanHarian', authJWT, getByAllPengabdianForCatatanHarian)
router.get('/laporan', authJWT, getByAllPengabdianForLaporan)
router.get('/statisticPengabdian', authJWT, getStatisticByUser)
router.get('/usulan', authJWT, getAllPengusulPengabdian)
router.get('/diajukan', authJWT, getAllDiajukanPengabdian)
router.get('/keanggotaan', authJWT, getAllKeangotaanPengabdian)
router.get('/:id', authJWT, getByIdPengabdian)
router.post('/', authJWT, upload.single('usulan_pdf'), pengabdianValidator.CreatePengabdian(), validate, validasiCreatePengabdian, MulterError, createPengabdiann)
router.patch('/:id', authJWT, upload.single('usulan_pdf'), MulterError, updatePengabdian)
router.patch('/statusPartisipasi/:id', authJWT, UpdateStatusPartisiPasiPengabdian)
router.delete('/:id', authJWT, deletePengabdian)


module.exports = router

