var db = require('../mongoCollections')
var Boss_DB = db.collection_boss()

module.exports = {
    updateInfo: function (req, res) {
        Boss_DB.findById(req.body.boss_id, (err, boss)=>{
            boss.bossId = req.body.bossId
            boss.password = req.body.password
            boss.name = req.body.name
            boss.sex = req.body.sex
            boss.phone = req.body.phone
            boss.save((err2, updatedBoss)=>{
                res.json(updatedBoss)
            })
        })
    }
}