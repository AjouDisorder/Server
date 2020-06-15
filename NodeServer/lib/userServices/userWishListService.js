var db = require('../mongoCollections')
var Menu_DB = db.collection_menu()
var User_DB = db.collection_user()

//메뉴종료되면, 메뉴리스트에서 pop
module.exports = {
    addMenuToWishList: function(req, res){
        User_DB.findById(req.body.user_id, (err, user)=>{
            user.wishList.push(req.body.menu_id)
            user.save(()=>{
                res.json(user.wishList)
            })
        })
    },
    getWishList: function(req, res){
        User_DB.findById(req.query.user_id, (err, user)=>{
            Menu_DB.find({'_id': { $in: user.wishList } }, (err, aliveMenuList)=>{
                user.wishList = new Array()
                for (var i = 0; i<aliveMenuList.length; i++){
                    user.wishList.push(aliveMenuList[i]._id)
                }
                user.save(()=>{
                    res.json(aliveMenuList);
                })
            });
        })
    },
    deleteMenuInWishList: function (req, res) {
        User_DB.findById(req.body.user_id, (err, user)=>{
            var idx = user.wishList.findIndex(function(item) {
                return item == String(req.body.menu_id)})
            if (idx > -1) user.wishList.splice(idx, 1)
            user.save(()=>{
                res.json(user.wishList)
            })
        })
    }
}
