const router = require('express').Router()
const {getAllOnlyAnggotaPenelitian, getByIdOnlyAnggotaPenelitian, createOnlyAnggotaPenelitian, updateByNidsOnlyAnggotaPenelitian, deleteByNidsOnlyAnggotaPenelitian} = require('../controller/anggotaPenelitian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllOnlyAnggotaPenelitian)
router.get('/:id', authJWT, getByIdOnlyAnggotaPenelitian)
router.post('/', authJWT, createOnlyAnggotaPenelitian)
router.patch('/:id', authJWT, updateByNidsOnlyAnggotaPenelitian)
router.delete('/:id', authJWT, deleteByNidsOnlyAnggotaPenelitian)

module.exports = router