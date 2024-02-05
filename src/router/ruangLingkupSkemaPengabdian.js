const router = require('express').Router()
const {getAllRuangLingkupSkemaPengabdian, getByIdRuangLingkupSkemaPengabdian, createRuangLingkupSkemaPengabdian, updateRuangLingkupSkemaPengabdian, deleteRuangLingkupSkemaPengabdian} = require('../controller/ruangLingkupSkemaPengabdian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllRuangLingkupSkemaPengabdian)
router.get('/:id', authJWT, getByIdRuangLingkupSkemaPengabdian)
router.post('/', authJWT, createRuangLingkupSkemaPengabdian)
router.patch('/:id', authJWT, updateRuangLingkupSkemaPengabdian)
router.delete('/:id', authJWT, deleteRuangLingkupSkemaPengabdian)


module.exports = router