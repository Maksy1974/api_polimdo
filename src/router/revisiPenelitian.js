const router = require('express').Router()
const {getAllRevisiPenelitian} = require('../controller/revisiPenelitian.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllRevisiPenelitian)

module.exports = router