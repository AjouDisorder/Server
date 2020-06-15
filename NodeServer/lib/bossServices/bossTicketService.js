var db = require('../mongoCollections')
var Ticket_DB = db.collection_ticket()
var Restaurant_DB = db.collection_restaurant()

module.exports = {
    getPaidTicketList: function(req, res){
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant)=>{
            Ticket_DB.find({'_id': { $in: restaurant.paidTicketidList }
            }, function(err, paidTicketList){
                 res.json(paidTicketList);
            });
        })
    },
    setTicketDisable: function(req, res){
        Ticket_DB.findById(req.body.ticket_id, (err, ticket)=>{
            ticket.available = false
            ticket.save((err2, updatedTicket)=>{
                Restaurant_DB.findById(ticket.restaurant_id, (err3, restaurant)=>{
                    restaurant.certifiedTicketidList.push(updatedTicket._id)
                    var idx = restaurant.paidTicketidList.findIndex(function(item) {
                        return item == String(updatedTicket._id)})
                    if (idx > -1) restaurant.paidTicketidList.splice(idx, 1)
                    restaurant.save((err4, updatedRestaurant)=>{
                        res.json(updatedRestaurant)
                    })
                })
            })
        })
    },
    getCertifiedTicketList: function (req, res) {
        Restaurant_DB.findById(req.query.restaurant_id, (err, restaurant)=>{
            Ticket_DB.find({
                '_id': { $in: restaurant.certifiedTicketidList }
            }, function(err, certifiedTicketList){
                 res.json(certifiedTicketList);
            });
        })
    }
}
