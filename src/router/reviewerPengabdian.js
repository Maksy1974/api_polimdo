const router = require('express').Router()
const {getAllReviewerPengabdian, getByIdReviewerPengabdian, createReviewerPengabdian, updateReviewerPengabdian, updateReviewerByUserPengabdian, deleteReviewerPengabdian} = require('../controller/reviewerPengabdian')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllReviewerPengabdian)
router.get('/:id', authJWT, getByIdReviewerPengabdian)
router.post('/', authJWT, createReviewerPengabdian)
router.patch('/', authJWT, updateReviewerPengabdian)
router.patch('/:id', authJWT, updateReviewerByUserPengabdian)
router.delete('/:id', authJWT, deleteReviewerPengabdian)


module.exports = router