var db = require('../mongoCollections')
var Review_DB = db.collection_review()
var Restaurant_DB = db.collection_restaurant()

module.exports = {
    getReviewList: function(req, res){
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant)=>{
            Review_DB.find({'_id': { $in: restaurant.reviewidList} }, (err2, reviewList)=>{
                res.json(reviewList);
            });
        })
    },
    updateReply: function(req, res){
        Review_DB.findById(req.body.review_id, (err, review)=>{
            review.reply = req.body.reply
            review.save((err2, repliedReview)=>{
                res.json(repliedReview)
            })
        })
    },
    deleteReply: function (req, res) {
        Review_DB.findById(req.body.review_id, (err, review)=>{
            review.reply = null
            review.save((err2, unrepliedReview)=>{
                res.json(unrepliedReview)
            })
        })
    }
}
