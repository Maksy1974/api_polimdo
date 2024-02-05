const router = require('express').Router()
const {getByAllJurusan, getByIdJurusan, createJurusan, updateByIdJurusan, deleteIdJurusan} = require('../controller/jurusan.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getByAllJurusan)
router.get('/:id', authJWT, getByIdJurusan)
router.post('/', authJWT, createJurusan)
router.patch('/:id', authJWT, updateByIdJurusan)
router.delete('/:id', authJWT, deleteIdJurusan)

module.exports = router