const fs = require('fs')
var db = require('./mongoCollections')
var Picture_DB = db.collection_picture()

function getExtensionOfFilename(filename) {
    var _fileLen = filename.length;
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(_lastDot, _fileLen).toLowerCase();
    return _fileExt;
}

module.exports = {
    createPicture: function(req, res){
        var newPicture = new Picture_DB({
            path : req.file.path,
            contentsType : getExtensionOfFilename(req.file.path)
        })
        newPicture.save(function(err, picture){
            if (err) res.send(err)
            res.json(picture);
        })
    },
    updatePicture: function (req, res) {
        Picture_DB.findById(req.body.picture_id, function(err, picture){
            if (err) res.send(err)
            pastPath = picture.path
            picture.path = req.file.path
            picture.contentsType = getExtensionOfFilename(req.file.path)
            picture.save(function(err2, updatedPicture){
                if (err2) res.send(err2)
                fs.unlink(pastPath, function(err3){
                    if (err3) res.send(err3)
                    res.json(updatedPicture)
                })
            })
        })
    }
}
