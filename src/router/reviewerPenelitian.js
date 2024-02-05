const router = require('express').Router()
const {getAllReviewerPenelitian, getByIdReviewerPenelitian, createReviewerPenelitan, updateReviewerPenelitian, updateReviewerByUserPenelitian, deleteReviewerPenelitian} = require('../controller/reviewerPenelitian')
const authJWT = require('../middleware/passport-jwt')

router.get('/', authJWT, getAllReviewerPenelitian)
router.get('/:id', authJWT, getByIdReviewerPenelitian)
router.post('/', authJWT, createReviewerPenelitan)
router.patch('/', authJWT, updateReviewerPenelitian)
router.patch('/:id', authJWT, updateReviewerByUserPenelitian)
router.delete('/:id', authJWT, deleteReviewerPenelitian)


module.exports = router