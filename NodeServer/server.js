var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
var router = require('./router/main')(app);

var GeoJSON = require('geojson');

var admin = require("firebase-admin");

var serviceAccount = require("./lib/realmeal-14210-firebase-adminsdk-25rwb-9861de6001.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://realmeal-14210.firebaseio.com"
});


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});

//정적파일(HTML 에서 사용되는 .js 파일, css 파일, image 파일)
//app.use(express.static('public'));  