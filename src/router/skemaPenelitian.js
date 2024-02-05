const router = require('express').Router()
const {GetAllSkemaPenelitian, GetByIdSkemaPenelitian, CreateSkemaPenelitian, UpdateByIdSkemaPenelitian, DeleteByIdSkemaPenelitian} = require('../controller/skemaPenelitian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, GetAllSkemaPenelitian)
router.get('/:id', authJWT, GetByIdSkemaPenelitian)
router.post('/', authJWT, CreateSkemaPenelitian)
router.patch('/:id', authJWT, UpdateByIdSkemaPenelitian)
router.delete('/:id', authJWT, DeleteByIdSkemaPenelitian)


module.exports = router