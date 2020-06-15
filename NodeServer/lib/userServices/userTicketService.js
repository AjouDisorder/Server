var db = require('../mongoCollections')
var Menu_DB = db.collection_menu()
var Ticket_DB = db.collection_ticket()
var User_DB = db.collection_user()
var Restaurant_DB = db.collection_restaurant()

function randomString(len) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i=0; i<len; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

module.exports = {
    getAvailableTicketMethod: function(req, res){
        //아마 없어질듯
    },
    payTicket: function (req, res) {
        //(아마 이거 없어지고, 새로운 함수로 검증하기 위해 BE에서 날릴듯?)
    },
    createTicket: function(req, res){
        //FE : 메뉴 id와 user id를 넘겨줘야함 -> 티켓 어디에 저장되는지 잘..
        //먼저 서버에서 검증 필요,,
        Menu_DB.findById(req.body.menu_id, function(err, menu){
            if (menu.quantity - req.body.quantity < 0){
                res.json({"result" : "fail : menu sold out"})
            }else{
                menu.quantity -= req.body.quantity
                menu.save(function(error, updatedMenu){
                    User_DB.findById(req.body.user_id, function(err2, user){
                        var newTicket = new Ticket_DB({
                            restaurant_id : menu.originMenu.restaurant_id,
                            restaurantTitle : menu.restaurantTitle,
                            address : menu.address,
                            location : menu.location,
                            quantity : req.body.quantity,
                            totalPrice : req.body.totalPrice,
                            userName : user.name,
                            menuName : menu.originMenu.title,
                            method : req.body.method,
                            value : randomString(8),
                            messageForBoss : req.body.messageForBoss,
                            startDateObject : menu.startDateObject,
                            endDateObject : menu.endDateObject
                        })
                        newTicket.save(function(err3, ticket){
                            user.ticketidList.push(ticket._id)
                            user.save(function(err4){
                                Restaurant_DB.findById(ticket.restaurant_id, function(err5, restuarant){
                                    restuarant.profit += ticket.totalPrice
                                    restuarant.paidTicketidList.push(ticket._id)
                                    //가게 menuidList에서 삭제
                                    if (menu.quantity == 0){
                                        var idx = restuarant.menuidList.findIndex(function(item) {
                                            return item == String(updatedMenu._id)})
                                        if (idx > -1) restuarant.menuidList.splice(idx, 1)
                                        //메뉴db에서 삭제
                                        Menu_DB.deleteOne({_id: menu._id}, ()=>{})
                                    }
                                    restuarant.save(function(err6){   
                                        res.json(ticket)
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    },
    addTicketList: function(req, res){
        //아마 없어질듯
    },
    getTicketList: function(req, res){
        User_DB.findById(req.query.user_id, (err, user)=>{
            Ticket_DB.find({
                '_id': { $in: user.ticketidList }
            }, function(err, ticketList){
                 res.json(ticketList);
            });
        })
    }
}
