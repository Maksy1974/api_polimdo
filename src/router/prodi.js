const router = require('express').Router()
const {getByAllProdi, getByIdProdi, createProdi, updateByIdProdi, deleteIdProdi} = require('../controller/prodi.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getByAllProdi)
router.get('/:id', authJWT, getByIdProdi)
router.post('/', authJWT, createProdi)
router.patch('/:id', authJWT, updateByIdProdi)
router.delete('/:id', authJWT, deleteIdProdi)

module.exports = router