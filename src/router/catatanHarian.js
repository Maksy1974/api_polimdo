const router = require('express').Router()
const {getAllCatatanHarian, getByIdCatatanHarian, createCatatanHarian, updateByIdCatatanHarian, deleteByIdCatatanHarian} = require('../controller/catatanHarian.controller')
const authJWT = require('../middleware/passport-jwt')
const {upload, MulterError} = require('../middleware/multerPdf')


router.get('/', authJWT, getAllCatatanHarian)
router.get('/:id', authJWT, getByIdCatatanHarian)
router.post('/', authJWT, upload.single('catatan_harian_pdf'), MulterError, createCatatanHarian)
router.patch('/:id', upload.single('catatan_harian_pdf'), MulterError, authJWT, updateByIdCatatanHarian)
router.delete('/:id', authJWT, deleteByIdCatatanHarian)

module.exports = router