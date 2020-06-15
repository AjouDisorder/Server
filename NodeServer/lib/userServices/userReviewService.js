var db = require('../mongoCollections')
var Ticket_DB = db.collection_ticket()
var Review_DB = db.collection_review()
var Restaurant_DB = db.collection_restaurant()
var User_DB = db.collection_user()

function addAverageGrade(avrGrade, NumOfPeople, inputGrade){
    return ((avrGrade * NumOfPeople) + inputGrade) / (NumOfPeople + 1)
}
function subAverageGrade(avrGrade, NumOfPeople, popGrade){
    if (NumOfPeople == 1){ return 0 }
    return ((avrGrade * NumOfPeople) - popGrade) / (NumOfPeople - 1)
}

module.exports = {
    createReview: function(req, res){
        Ticket_DB.findById(req.body.ticket_id, (err, selectedTicket)=>{
            var newReview = new Review_DB({
                ticket : selectedTicket,
                grade : req.body.grade,
                description : req.body.description,
                picture : req.body.picture,
                restaurant_id : selectedTicket.restaurant_id
            })
            newReview.save((err2, createdReview)=>{
                res.json(createdReview)
                Restaurant_DB.findById(selectedTicket.restaurant_id, (err3, restaurant)=>{
                    restaurant.avrGrade = addAverageGrade(
                        restaurant.avrGrade, restaurant.reviewidList.length, createdReview.grade)
                    restaurant.reviewidList.push(createdReview._id)
                    restaurant.save(()=>{
                        User_DB.findById(req.body.user_id, (err4, user)=>{
                            user.reviewedTicketList.push(selectedTicket._id)
                            user.save(()=>{ })
                        })
                    })
                })
            })
        })
    },
    updateReview: function (req, res) {
        Review_DB.findById(req.body.review_id, (err, review)=>{
            review.description = req.body.description
            review.picture = req.body.picture
            review.save((err2, updatedReview)=>{
                res.json(updatedReview)
            })
        })
    },
    deleteReview: function (req, res) {
        //가게 평점, review리스트에서 삭제 -> 리뷰 데이터 삭제
        Review_DB.findById(req.body.review_id, (err, review)=>{
            Restaurant_DB.findById(review.restaurant_id, (err2, restaurant)=>{
                restaurant.avrGrade = subAverageGrade(
                    restaurant.avrGrade, restaurant.reviewidList.length, review.grade)
                var idx = restaurant.reviewidList.findIndex(function(item) {
                    return item == String(review._id)})
                if (idx > -1) restaurant.reviewidList.splice(idx, 1)
                restaurant.save(()=>{
                    res.json(restaurant.reviewidList)
                })
            })
            Review_DB.deleteOne({_id: review._id}, ()=>{ })
        })
    },
    getReviewList: function(req, res){
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant)=>{
            Review_DB.find({'_id': { $in: restaurant.reviewidList} }, (err2, reviewList)=>{
                res.json(reviewList);
            });
        })
    },
    getReviewedTicketList: function(req, res){
        User_DB.findById(req.query.user_id, (err, user)=>{
            Ticket_DB.find({'_id': { $in: user.reviewedTicketList} }, (err2, reviewedTicketList)=>{
                res.json(reviewedTicketList)
            })
        })
    }
}