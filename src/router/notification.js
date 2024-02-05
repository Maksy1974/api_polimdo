const router = require('express').Router()
const {getAllNotification, getJumlahNotifBaru, CreateNotification, UpdateNotificationById} = require('../controller/notification.controller')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllNotification)
router.get('/jumlahNewNotif', authJWT, getJumlahNotifBaru)
router.post('/', authJWT, CreateNotification)
router.patch('/:id', authJWT, UpdateNotificationById)

module.exports = router