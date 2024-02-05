const router = require('express').Router()
const {getAllDeskripsiPenilaianPengabdian, getByIdDeskripsiPenilaianPengabdian, createDeskripsiPenilaianPengabdian, updateDeskripsiPenilaianPengabdian, deleteDeskripsiPenilaianPengabdian} = require('../controller/deskripsiPenilaianPengabdian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllDeskripsiPenilaianPengabdian)
router.get('/:id', authJWT, getByIdDeskripsiPenilaianPengabdian)
router.post('/', authJWT, createDeskripsiPenilaianPengabdian)
router.patch('/:id', authJWT, updateDeskripsiPenilaianPengabdian)
router.delete('/:id', authJWT, deleteDeskripsiPenilaianPengabdian)


module.exports = router