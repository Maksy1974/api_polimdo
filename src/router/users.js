const router = require('express').Router();
const {getAllUser, getByIdUser, createUser, updateUserByIdRoleAdmin, updateUserById, deleteUserById, login} = require('../controller/users.controller')
const authJWT = require('../middleware/passport-jwt')
const {upload, MulterError} = require('../middleware/multerImg')
const userValidator = require('./../middleware/validasi/user.validator')
const validate = require('./../middleware/expressValidator')

router.get('/', authJWT, getAllUser);

router.get('/:id', authJWT, getByIdUser);

router.post('/', authJWT, createUser);

router.patch('/:id',authJWT, upload.single('profile_picture'), MulterError,  userValidator.update(), validate, updateUserById);

router.patch('/roleAdmin/:id',authJWT, updateUserByIdRoleAdmin);

router.delete('/:id', authJWT, deleteUserById);

router.post('/login', userValidator.login(), validate, login)




module.exports = router;
