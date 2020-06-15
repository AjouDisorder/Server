var db = require('../mongoCollections')
var OriginMenu_DB = db.collection_originMenu()
var Restaurant_DB = db.collection_restaurant()

module.exports = {
    createOriginMenu: function(req, res){
        var newOriginMenu = new OriginMenu_DB({
            restaurant_id : req.body.restaurant_id,
            title: req.body.title, type: req.body.type,
            description: req.body.description, 
            originPrice: req.body.originPrice,
            picture: req.body.picture   //createPicture를 통해 받은 json을 여기에
        });
        newOriginMenu.save(function(err, originMenu){
            if (err) res.send(err)
            Restaurant_DB.findById(originMenu.restaurant_id, function(err2, restaurant){
                if (err2) res.send(err2)
                restaurant.originMenuList.push(originMenu)
                restaurant.save(function(err3, updatedRestaurant){
                    if (err3) res.send(err3)
                    res.json(originMenu)
                })
            })
        })
    },
    //기존 메뉴 바뀌면, 가게 origin메뉴리스트 변경
    updateOriginMenu: function (req, res) {
        OriginMenu_DB.findById(req.body.originMenu_id, (err, originMenu)=>{
            originMenu.title = req.body.title
            originMenu.description = req.body.description
            originMenu.type = req.body.type
            originMenu.originPrice = req.body.originPrice
            originMenu.picture = req.body.picture
            originMenu.save((err2, updatedOriginMenu)=>{
                Restaurant_DB.findById(originMenu.restaurant_id, (err3, restaurant)=>{
                    var idx = restaurant.originMenuList.findIndex(function(item) {
                        return item._id == String(originMenu._id)})
                    if (idx > -1) restaurant.originMenuList.splice(idx, 1, updatedOriginMenu)
                    restaurant.save((err4)=>{
                        res.json(updatedOriginMenu)
                    })
                })
            })
        })
    },
    deleteOriginMenu: function(req, res){
        OriginMenu_DB.findById(req.body.originMenu_id, (err, originMenu)=>{
            Restaurant_DB.findById(originMenu.restaurant_id, (err2, restaurant)=>{
                var idx = restaurant.originMenuList.findIndex(function(item) {
                    return item._id == String(req.body.originMenu_id)})
                if (idx > -1) restaurant.originMenuList.splice(idx, 1)
                restaurant.save(()=>{
                    OriginMenu_DB.deleteOne({_id: originMenu._id}, ()=>{
                        res.json(restaurant.originMenuList)
                    })
                })
            })
        })
    },
    getOriginMenuList: function (req, res) {
        //필요없을듯
    }
}
