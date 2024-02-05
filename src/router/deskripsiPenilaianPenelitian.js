const router = require('express').Router()
const {getAllDeskripsiPenilaianPenelitian, getByIdDeskripsiPenilaianPenelitian, createDeskripsiPenilaianPenelitian, updateDeskripsiPenilaianPenelitian, deleteDeskripsiPenilaianPenelitian} = require('../controller/deskripsiPenilaianPenelitian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllDeskripsiPenilaianPenelitian)
router.get('/:id', authJWT, getByIdDeskripsiPenilaianPenelitian)
router.post('/', authJWT, createDeskripsiPenilaianPenelitian)
router.patch('/:id', authJWT, updateDeskripsiPenilaianPenelitian)
router.delete('/:id', authJWT, deleteDeskripsiPenilaianPenelitian)


module.exports = router