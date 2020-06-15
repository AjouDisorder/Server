var db = require('../mongoCollections')
var Menu_DB = db.collection_menu()
var Restaurant_DB = db.collection_restaurant()

module.exports = {
    getMenuByCategory: function (req, res) {
        Menu_DB.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "maxDistance": 2000,
                "spherical": true,
                "query": {
                    "type": req.query.type
                }

            }
        }]).exec((err2, menuByC) => {
            if (err2) {
                res.json({ "result": "search fail!" });
            }
            else {
                res.json(menuByC);
            }
        });

    },
    getMenuByTime: function (req, res) {
        var res_searchDate = new Date(req.query.year, req.query.month - 1, req.query.date, req.query.hour, req.query.min);
        var searchDate = new Date(res_searchDate.getTime() + (3600000*9))
        var searchTimeInt = parseInt(res_searchDate.toTimeString().substr(0,5).replace(":", ""))
        
        Menu_DB.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "maxDistance": 2000,
                "spherical": true,
                "query": {
                    "$and" : [{startDateObject : {"$lt": searchDate}}, {endDateObject : {"$gt": searchDate}}, 
                        {startTimeInt : {"$lt": searchTimeInt}}, {endTimeInt : {"$gt": searchTimeInt}}]
                }

            }
        }]).exec((err2, menuByT) => {
            if (err2) {
                res.json({ "result": "search fail!" });
            }
            else {
                res.json(menuByT);
            }
        });

    },
    getMenuListOfRestaurant: function (req, res) {
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant) => {
            Menu_DB.find({
                '_id': { $in: restaurant.menuidList }
            }, function (err2, menuList) {
                res.json(menuList);
            });
        })
    },
    getMenuBySearchBar: function (req, res) {
        Menu_DB.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "maxDistance": 2000,
                "spherical": true,
                "query": {
                    "title": { $regex: req.query.title, $options: 'i' }
                }
            }
        }]).exec((err2, menuByS) => {
            if (err2) {
                res.json({ "result": "search fail!" });
            }
            else {
                res.json(menuByS);
            }
        });
    },
    getRestaurantBySearchBar: function (req, res) {
        Restaurant_DB.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "maxDistance": 2000,
                "spherical": true,
                "query": {
                    "title": { $regex: req.query.title, $options: 'i' }
                }
            }
        }]).exec((err2, restByS) => {
            if (err2) {
                res.json({ "result": "search fail!" });
            }
            else {
                res.json(restByS);
            }
        });
    },
    getRestaurantByCategory: function (req, res) {
        Restaurant_DB.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                "distanceField": "distance",
                "maxDistance": 2000,
                "spherical": true,
                "query": {
                    "type": req.query.type
                }

            }
        }]).exec((err2, restByC) => {
            if (err2) {
                res.json({ "result": "search fail!" });
            }
            else {
                res.json(restByC);
            }
        });
    },
    getRestaurantDetail: function (req, res) {
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant) => {
            res.json(restaurant)
        })
    },
}
