const router = require('express').Router()
const {GetAllSkemaPengabdian, GetByIdSkemaPengabdian, CreateSkemaPengabdian, UpdateByIdSkemaPengabdian, DeleteByIdSkemaPengabdian} = require('../controller/skemaPengabdian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, GetAllSkemaPengabdian)
router.get('/:id', authJWT, GetByIdSkemaPengabdian)
router.post('/', authJWT, CreateSkemaPengabdian)
router.patch('/:id', authJWT, UpdateByIdSkemaPengabdian)
router.delete('/:id', authJWT, DeleteByIdSkemaPengabdian)


module.exports = router