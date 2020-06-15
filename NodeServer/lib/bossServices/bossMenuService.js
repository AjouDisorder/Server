var db = require('../mongoCollections')
var OriginMenu_DB = db.collection_originMenu()
var Menu_DB = db.collection_menu()
var Restaurant_DB = db.collection_restaurant()

var schedule = require('node-schedule');

module.exports = {
    getMenuList: function(req, res){
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant)=>{
            Menu_DB.find({
                '_id': { $in: restaurant.menuidList }
            }, function(err, menuList){
                res.json(menuList);
            });
        })
    },
    createMenu: function(req, res){
        OriginMenu_DB.findById(req.body.originMenu_id, function(err, originMenu){
            Restaurant_DB.findById(originMenu.restaurant_id, function(err2, restaurant){
                const today = new Date()
                var result_start = new Date(req.body.start_year, req.body.start_month-1, req.body.start_date, req.body.start_hour, req.body.start_min)
                var result_end = new Date(req.body.end_year, req.body.end_month-1, req.body.end_date, req.body.end_hour, req.body.end_min)
                var startDateObj = new Date(result_start.getTime() + (3600000*9))
                var endDateObj = new Date(result_end.getTime() + (3600000*9))

                var newMenu = new Menu_DB({
                    token: restaurant.token,
                    originMenu : originMenu,
                    restaurantTitle : restaurant.title,
                    title : originMenu.title,
                    type : originMenu.type,
                    location : restaurant.location,
                    address : restaurant.address,
                    picture : req.body.picture,
                    discount : req.body.discount,
                    quantity : req.body.quantity,
                    method : req.body.method,
                    startDateObject : startDateObj,
                    endDateObject : endDateObj,
                    startTimeInt : parseInt(result_start.toTimeString().substr(0,5).replace(":", "")),
                    endTimeInt : parseInt(result_end.toTimeString().substr(0,5).replace(":", ""))
                })
                newMenu.save(function(err3, menu){
                    restaurant.menuidList.push(menu._id)
                    restaurant.save(function(err4, updatedRestaurant){
                        //menu end : 메뉴 삭제 / 가게 메뉴id리스트 pop
                        var destroyJob = schedule.scheduleJob(
                            `* ${req.body.end_min} ${req.body.end_hour} 
                            ${req.body.end_date} ${req.body.end_month} *`, ()=>{
                                var idx = updatedRestaurant.menuidList.findIndex(function(item) {
                                    return item == String(menu._id)})
                                if (idx > -1) updatedRestaurant.menuidList.splice(idx, 1)
                                updatedRestaurant.save(()=>{
                                    Menu_DB.deleteOne({_id: menu._id}, ()=>{
                                        destroyJob.cancel()
                                    })
                                })
                        });   

                        res.json(menu)
                    })
                })
            })
        })
    },
    updateMenu: function(req, res){
        Menu_DB.findById(req.body.menu_id, (err, menu)=>{
            var result_start = new Date(req.body.start_year, req.body.start_month-1, req.body.start_date, req.body.start_hour, req.body.start_min)
            var result_end = new Date(req.body.end_year, req.body.end_month-1, req.body.end_date, req.body.end_hour, req.body.end_min)
            var startDateObj = new Date(result_start.getTime() + (3600000*9))
            var endDateObj = new Date(result_end.getTime() + (3600000*9))

            menu.picture = req.body.picture,
            menu.discount = req.body.discount,
            menu.quantity = req.body.quantity,
            menu.method = req.body.method,
            menu.startDateObject = startDateObj,
            menu.endDateObject = endDateObj,
            menu.startTimeInt = parseInt(result_start.toTimeString().substr(0,5).replace(":", "")),
            menu.endTimeInt = parseInt(result_end.toTimeString().substr(0,5).replace(":", "")),
            menu.save((err2, updatedMenu)=>{
                Restaurant_DB.findById(updatedMenu.originMenu.restaurant_id, (err3, restaurant)=>{
                    //menu end : 메뉴 삭제 / 가게 메뉴id리스트 pop
                    var destroyJob = schedule.scheduleJob(
                        `* ${req.body.end_min} ${req.body.end_hour} 
                        ${req.body.end_date} ${req.body.end_month} *`, ()=>{
                            var idx = restaurant.menuidList.findIndex(function(item) {
                                return item == String(updatedMenu._id)})
                            if (idx > -1) restaurant.menuidList.splice(idx, 1)
                            restaurant.save(()=>{
                                Menu_DB.deleteOne({_id: updatedMenu._id}, ()=>{
                                    destroyJob.cancel()
                                })
                            })
                    });  

                    res.json(menu) 
                })
            })
        })
    },
    deleteMenu: function (req, res) {
        Menu_DB.findById(req.body.menu_id, (err, menu)=>{
            Restaurant_DB.findById(menu.originMenu.restaurant_id, (err2, restaurant)=>{
                var idx = restaurant.menuidList.findIndex(function(item) {
                    return item == String(menu._id)})
                if (idx > -1) restaurant.menuidList.splice(idx, 1)
                restaurant.save(()=>{
                    Menu_DB.deleteOne({_id: menu._id}, ()=>{
                        res.json(restaurant.menuidList)
                    })
                })
            })
        })
    }
}
