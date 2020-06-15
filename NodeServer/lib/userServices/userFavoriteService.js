var db = require('../mongoCollections')
var User_DB = db.collection_user()
var Restaurant_DB = db.collection_restaurant()

module.exports = {
    addRestaurantToFavoriteList: function(req, res){
        User_DB.findById(req.body.user_id, (err, user)=>{
            user.favoriteRestaurantidList.push(req.body.restaurant_id)
            user.save(()=>{
                res.json(user.favoriteRestaurantidList)
            })
            Restaurant_DB.findById(req.body.restaurant_id, (err2, restaurant)=>{
                restaurant.favoriteCount += 1
                restaurant.favoriteUseridList.push(user._id)
                restaurant.save(()=>{ })
            })
        })
    },
    getFavoriteList: function (req, res) {
        User_DB.findById(req.query.user_id, (err, user)=>{
            Restaurant_DB.find({'_id': { $in: user.favoriteRestaurantidList }}, 
            (err2, favoriteRestaurantList)=>{
                res.json(favoriteRestaurantList);
            });
        })
    },
    deleteRestaurantInFavoriteList: function (req, res) {
        User_DB.findById(req.body.user_id, (err, user)=>{
            var idx = user.favoriteRestaurantidList.findIndex(function(item) {
                return item == String(req.body.restaurant_id)})
            if (idx > -1) user.favoriteRestaurantidList.splice(idx, 1)
            user.save(()=>{
                res.json(user.favoriteRestaurantidList)
            })
            Restaurant_DB.findById(req.body.restaurant_id, (err2, restaurant)=>{
                restaurant.favoriteCount -= 1
                var idx = restaurant.favoriteUseridList.findIndex(function(item) {
                    return item == String(req.body.user_id)})
                if (idx > -1) restaurant.favoriteUseridList.splice(idx, 1)
                restaurant.save(()=>{ })
            })
        })
    }
}