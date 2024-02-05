const router = require('express').Router()
const {getAllOnlyAnggotaPengabdian, getByIdOnlyAnggotaPengabdian, createOnlyAnggotaPengabdian, updateByNidsOnlyAnggotaPengabdian, deleteByNidsOnlyAnggotaPengabdian} = require('../controller/anggotaPengabdian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllOnlyAnggotaPengabdian)
router.get('/:id', authJWT, getByIdOnlyAnggotaPengabdian)
router.post('/', authJWT, createOnlyAnggotaPengabdian)
router.patch('/:id', authJWT, updateByNidsOnlyAnggotaPengabdian)
router.delete('/:id', authJWT, deleteByNidsOnlyAnggotaPengabdian)

module.exports = router