const router = require('express').Router()
const {getByAllPenjadwalan, getByIdPenjadwalan, createPenjadwalan, updateByIdPenjadwalan, deleteIdPenjadwalan} = require('../controller/penJadwalan.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getByAllPenjadwalan)
router.get('/:id', authJWT, getByIdPenjadwalan)
router.post('/', authJWT, createPenjadwalan)
router.patch('/:id', authJWT, updateByIdPenjadwalan)
router.delete('/:id', authJWT, deleteIdPenjadwalan)

module.exports = router