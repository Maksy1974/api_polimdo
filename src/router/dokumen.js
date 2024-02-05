const router = require('express').Router()
const {getByIdDokumen, updateDokumen} = require('../controller/dokumen.controller')
const authJWT = require('../middleware/passport-jwt')
const {upload, MulterError} = require('../middleware/multerPdf')


router.get('/:id', authJWT, getByIdDokumen)
router.patch('/:id', authJWT,  upload.single('usulan_pdf_revisi'), MulterError, updateDokumen)

module.exports = router

