const ExpressError = require('../utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('../validateSchema.js')
const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {camp_id, review_id} = req.params;
    const review = await Review.findById(review_id)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${camp_id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        console.dir(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        console.dir(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
