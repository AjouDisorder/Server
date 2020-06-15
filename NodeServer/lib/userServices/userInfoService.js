var db = require('../mongoCollections')
var User_DB = db.collection_user()

module.exports = {
    setAddress: function(req, res){
        User_DB.findById(req.body.user_id, function (err, user) {
            if (err) res.send(err)
            user.location = { coordinates : [req.body.lng, req.body.lat] }
            user.address = req.body.address
            user.save((err2, updatedUser)=>{
                res.json(updatedUser)
            })
        })
    },
    updateInfo: function(req, res) {
        User_DB.findById(req.body.user_id, (err, user)=>{
            user.userId = req.body.userId
            user.password = req.body.password
            user.nickname = req.body.nickname
            user.name = req.body.name
            user.sex = req.body.sex
            user.phone = req.body.phone
            user.save((err2, updatedUser)=>{
                res.json(updatedUser)
            })
        })
    }
}