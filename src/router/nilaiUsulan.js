const router = require('express').Router()
const {updateNilaiUsulanPenelitian, getAllNilaiPenelian, getByIdNilaiPenelitian, updateNilaiUsulanPengabdian, getAllNilaiPengabdian, getByIdNilaiPengabdian} = require('../controller/nilaiUsulan.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/penelitian', authJWT, getAllNilaiPenelian)
router.get('/penelitian/:id', authJWT, getByIdNilaiPenelitian)
router.post('/penelitian', authJWT, updateNilaiUsulanPenelitian)



router.get('/pengabdian', authJWT, getAllNilaiPengabdian)
router.get('/pengabdian/:id', authJWT, getByIdNilaiPengabdian)
router.post('/pengabdian', authJWT, updateNilaiUsulanPengabdian)



module.exports = router