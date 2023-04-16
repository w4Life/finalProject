const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.postReview = async (req, res) => {
    const id = req.params.camp_id
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully make a new review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const {camp_id, review_id} = req.params
    await Campground.findByIdAndUpdate(camp_id, {$pull: {reviews: review_id}})
    await Review.findByIdAndDelete(review_id)
    res.redirect(`/campgrounds/${camp_id}`)
}