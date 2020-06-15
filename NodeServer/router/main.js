//lib
var loginService = require('../lib/loginService');
var pictureService = require('../lib/pictureService');
var userInfoService = require('../lib/userServices/userInfoService');
var userSearchService = require('../lib/userServices/userSearchService');
var userTicketService = require('../lib/userServices/userTicketService');
var userWishListService = require('../lib/userServices/userWishListService');
var userFavoriteService = require('../lib/userServices/userFavoriteService');
var userReviewService = require('../lib/userServices/userReviewService');
var bossRestaurantService = require('../lib/bossServices/bossRestaurantManageService');
var bossOriginMenuService = require('../lib/bossServices/bossOriginMenuService');
var bossMenuService = require('../lib/bossServices/bossMenuService');
var bossTicketService = require('../lib/bossServices/bossTicketService');
var bossReviewService = require('../lib/bossServices/bossReviewService');
var bossInfoService = require('../lib/bossServices/bossInfoService');
var sendPush = require('../lib/sendPush')

//multer for picture
const multer = require('multer')
const upload = multer({
   storage: multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, 'data/imgs/');
     },
     filename: function (req, file, cb) {
         cb(null, new Date().valueOf() + file.originalname);
     }
   }),
 });

module.exports = function(app){
   //Login Service
   app.post('/user/signup', function(req, res){
      loginService.userSignup(req, res)
   })
   app.post('/user/login', function(req, res){
      loginService.userLogin(req, res)
   })
   app.post('/boss/signup', function(req, res){
      loginService.bossSignup(req, res)
   })
   app.post('/boss/login', function(req, res){
      loginService.bossLogin(req, res)
   })
   app.post('/sendPush1', function(req, res){
      sendPush.push1(req, res)
   })
   app.post('/sendPush2', function(req, res){
      sendPush.push2(req, res)
   })
   

   //Picture Service
   app.post('/createPicture', upload.single('img'), function(req, res){
      pictureService.createPicture(req, res)
   })
   app.post('/updatePicture', upload.single('img'), function(req, res){
      pictureService.updatePicture(req, res)
   })

   //userServices - info service
   app.post('/user/address_update', function(req, res){
      userInfoService.setAddress(req, res)
   })
   app.post('/user/updateInfo', function(req, res){
      userInfoService.updateInfo(req, res)
   })
    //userServices - search service
   app.get('/user/getMenuBySearchBar', function(req, res){
      userSearchService.getMenuBySearchBar(req, res)
   })
   app.get('/user/getMenuByCategory', function(req, res){
      userSearchService.getMenuByCategory(req, res)
   })
   app.get('/user/getMenuByTime', function(req, res){
      userSearchService.getMenuByTime(req, res)
   })
   app.get('/user/getMenuListOfRestaurant', function(req, res){
      userSearchService.getMenuListOfRestaurant(req, res)
   })
   app.get('/user/getRestaurantBySearchBar', function(req, res){
      userSearchService.getRestaurantBySearchBar(req, res)
   })
   app.get('/user/getRestaurantByCategory', function(req, res){
      userSearchService.getRestaurantByCategory(req, res)
   })
   app.get('/user/getRestaurantDetail', function(req, res){
      userSearchService.getRestaurantDetail(req, res)
   }) 
   //userServices - ticket service
   app.get('/user/getAvailableTicketMethod', function(req, res){
      userTicketService.getAvailableTicketMethod(req, res)
   })
   app.post('/user/createTicket', function(req, res){
      userTicketService.createTicket(req, res)
   }) 
   app.post('/user/payTicket', function(req, res){ //payment_start !!
      userTicketService.payTicket(req, res)
   })
   app.post('/user/addTicketList', function(req, res){   //payment_complete !!
      userTicketService.addTicketList(req, res)
   })
   app.get('/user/getTicketList', function(req, res){    //pay log
      userTicketService.getTicketList(req, res)
   })
   //userServices - wish list service
   app.post('/user/addMenuToWishList', function(req, res){
      userWishListService.addMenuToWishList(req, res)
   })
   app.get('/user/getWishList', function(req, res){
      userWishListService.getWishList(req, res)
   })
   app.post('/user/deleteMenuInWishList', function(req, res){
      userWishListService.deleteMenuInWishList(req, res)
   })
   //userServices - favorite service
   app.post('/user/addRestaurantToFavoriteList', function(req, res){
      userFavoriteService.addRestaurantToFavoriteList(req, res)
   })
   app.get('/user/getFavoriteList', function(req, res){
      userFavoriteService.getFavoriteList(req, res)
   })
   app.post('/user/deleteRestaurantInFavoriteList', function(req, res){
      userFavoriteService.deleteRestaurantInFavoriteList(req, res)
   })
   //userServices - review service
   app.get('/user/getReviewList', (req, res)=>{
      userReviewService.getReviewList(req, res)
   })
   app.get('/user/getReviewedTicketList', (req, res)=>{
      userReviewService.getReviewedTicketList(req, res)
   })
   app.post('/user/createReview', function(req, res){
      userReviewService.createReview(req, res)
   })
   app.post('/user/updateReview', function(req, res){
      userReviewService.updateReview(req, res)
   })
   app.post('/user/deleteReview', function(req, res){
      userReviewService.deleteReview(req, res)
   })
    
   //bossServices - restaurant manage service
   app.get('/boss/getRestaurantList', function(req, res){
      bossRestaurantService.getRestaurantList(req, res)
   })
   app.post('/boss/createRestaurant', function(req, res){
      bossRestaurantService.createRestaurant(req, res)
   })
   app.post('/boss/updateRestaurant', function(req, res){
      bossRestaurantService.updateRestaurant(req, res)
   })
   app.post('/boss/deleteRestaurant', function(req, res){
      bossRestaurantService.deleteRestaurant(req, res)
   })
   //bossServices - origin menu service
   app.post('/boss/createOriginMenu', function(req, res){
      bossOriginMenuService.createOriginMenu(req, res)
   })
   app.post('/boss/updateOriginMenu', function(req, res){
      bossOriginMenuService.updateOriginMenu(req, res)
   })
   app.post('/boss/deleteOriginMenu', function(req, res){
      bossOriginMenuService.deleteOriginMenu(req, res)
   })
   app.get('/boss/getOriginMenuList', function(req, res){
      bossOriginMenuService.getOriginMenuList(req, res)
   })
   //bossServices - menu service
   app.get('/boss/getMenuList', (req, res)=>{
      bossMenuService.getMenuList(req, res)
   })
   app.post('/boss/createMenu', function(req, res){
      bossMenuService.createMenu(req, res)
   })
   app.post('/boss/updateMenu', function(req, res){
      bossMenuService.updateMenu(req, res)
   })
   app.post('/boss/deleteMenu', function(req, res){
      bossMenuService.deleteMenu(req, res)
   })
   //bossServices - ticket service
   app.get('/boss/getPaidTicketList', function(req, res){
      bossTicketService.getPaidTicketList(req, res)
   })
   app.post('/boss/setTicketDisable', function(req, res){
      bossTicketService.setTicketDisable(req, res)
   })
   app.get('/boss/getCertifiedTicketList', function(req, res){
      bossTicketService.getCertifiedTicketList(req, res)
   }) 
   //bossServices - review service
   app.get('/boss/getReviewList', function(req, res){
      bossReviewService.getReviewList(req, res)
   })
   app.post('/boss/updateReply', function(req, res){
      bossReviewService.updateReply(req, res)
   })
   app.post('/boss/deleteReply', function(req, res){
      bossReviewService.deleteReply(req, res)
   })
   //bossServices - info service
   app.post('/boss/updateInfo', function(req, res){
      bossInfoService.updateInfo(req, res)
   })
}