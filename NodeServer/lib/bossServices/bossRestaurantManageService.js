var db = require('../mongoCollections')
var OriginMenu_DB = db.collection_originMenu()
var Menu_DB = db.collection_menu()
var Review_DB = db.collection_review()
var User_DB = db.collection_user()
var Restaurant_DB = db.collection_restaurant()
var Boss_DB = db.collection_boss()

module.exports = {
    getRestaurantList: function(req, res){
        //boss_id로 restaurantList를 조회
        Boss_DB.findById(req.query.boss_id, function(err, boss){
            Restaurant_DB.find({'_id': { $in: boss.restaurantidList} }, (err2, restaurantList)=>{
                res.json(restaurantList);
            });
        })
    },
    createRestaurant: function (req, res) {
        Boss_DB.findById(req.body.boss_id, function(err, boss){
            var newRestaurant = new Restaurant_DB({
                token: boss.bossToken,
                title: req.body.title, type: req.body.type,
                description: req.body.description, 
                address: req.body.address,
                //req.body.lat과 req.body.lng를 필수로 넣어줘야함
                location : {
                    coordinates : [req.body.lng, req.body.lat]
                },
                phone: req.body.phone,
                picture: req.body.picture,  //createPicture로 !
                originMenuList: [],
                menuidList: [], paidTicketidList: [],
                certifiedTicketidList: [], reviewidList: [],
                favoriteUseridList: [],
            });
            newRestaurant.save(function(err2, restaurant){
                if (err2) res.send(err2)
                Boss_DB.findById(req.body.boss_id, function(err3, boss){
                    if (err3) res.send(err3)
                    boss.restaurantidList.push(restaurant._id)
                    boss.save(function(err4, updatedBoss){
                        if (err4) res.send(err4)
                        res.json(restaurant)
                    })
                })
            }) 
        })
    },
    updateRestaurant: function(req, res){
        Restaurant_DB.findById(req.body.restaurant_id, (err, restaurant)=>{
            restaurant.title = req.body.title
            restaurant.type = req.body.type
            restaurant.description = req.body.description
            restaurant.address = req.body.address
            //req.body.lat과 req.body.lng를 필수로 넣어줘야함
            restaurant.location = { coordinates : [req.body.lng, req.body.lat] }
            restaurant.phone = req.body.phone
            restaurant.picture = req.body.picture
            restaurant.save((err2, updatedRestaurant)=>{
                res.json(updatedRestaurant)
            })
        })
    },
    deleteRestaurant: function (req, res) {
        /*
            0. 조건 : 가게의 paid티켓List와 메뉴List에 아무것도 없어야함
            1. 사장님의 가게 id리스트에서 pop
            2. 가게의 originMenuList, 리뷰List에 각 db삭제
            3. 가게의즐찾userList들을 찾아서 -> user의 즐찾 list에서 가게 삭제
            4. 실제 가게 db에서 삭제
        */
        Restaurant_DB.findById(req.body.restaurant_id, (err, restaurant)=>{
            if (restaurant.paidTicketidList.length != 0 || restaurant.menuidList.length != 0){
                res.json({"result" : "fail : must clear paidTicketidList and menuidList"})
            }else{
                Boss_DB.findById(req.body.boss_id, (err2, boss)=>{
                    var idx = boss.restaurantidList.findIndex(function(item) {
                        return item == String(restaurant._id)})
                    if (idx > -1) boss.restaurantidList.splice(idx, 1)
                    boss.save((err3, updatedBoss)=>{
                        res.json(updatedBoss)
                    })

                    OriginMenu_DB.deleteMany({restaurant_id: restaurant._id}, ()=>{
                        Review_DB.deleteMany({restaurant_id: restaurant._id}, ()=>{
                            User_DB.find({'_id': { $in: restaurant.favoriteUseridList } }, (err4, favoriteUserList)=>{
                                for (var i = 0; i<favoriteUserList.length; i++){
                                    var idx = favoriteUserList[i].favoriteRestaurantidList.findIndex(function(item) {
                                        return item == String(restaurant._id)})
                                    if (idx > -1) favoriteUserList[i].favoriteRestaurantidList.splice(idx, 1)
                                    favoriteUserList[i].save(()=>{ })
                                }
                                Restaurant_DB.deleteOne({_id: restaurant._id}, ()=>{ })
                            })
                        })
                    })
                })
            }
        })
    }
}
