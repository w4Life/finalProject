const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')   
const {isLoggedIn, validateReview, isReviewAuthor} = require('../utils/middleware')
const reviewController = require('../controllers/reviewController')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview))

router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router