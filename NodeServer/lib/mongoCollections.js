var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/disorder', {
  useUnifiedTopology: true, useNewUrlParser: true,
  //user: 'admin', pass: 'eltmdhej123'
}).then(()=>{
  console.log('Mongo Connected!');
}).catch(err =>{
  console.log('Mongo Connection Failed!');
  process.exit()
})

const picture = mongoose.Schema({
  path : String,
  data : Buffer,
  contentsType : String
})

const originMenu = mongoose.Schema({
  restaurant_id : String, //restaurant's PK
  title : String,
  description : String,
  type : String,
  originPrice : Number,
  picture : picture
})

const menu = mongoose.Schema({
  token : String,
  originMenu : originMenu,
  restaurantTitle : String,
  title : String,
  type : String,
  location : {
    type : {
      type : String,
      default : 'Point'
    },
    coordinates: {
      type : [Number],
      index : '2dsphere'
  }},
  address : String,
  picture : picture,
  discount : Number,
  quantity : Number,
  startDateObject : Date,
  endDateObject : Date,
  startTimeInt : Number,
  endTimeInt : Number,
  method : String //'takeout', 'forhere', 'both',
})

const ticket = mongoose.Schema({  //구입한 시간 필요할듯?
  token : String,
  restaurant_id : String, //restaurant's PK
  restaurantTitle : String,
  address : String,
  location : {
    type : {
      type : String,
      default : 'Point'
    },
    coordinates: {
      type : [Number],
      index : '2dsphere'
  }},
  quantity : Number,
  totalPrice : Number,
  userName : String,
  menuName : String,
  method : String, //'takeout' or 'forhere'
  value : String,  //random String
  available : { type: Boolean, default: true },
  messageForBoss : String,
  startDateObject : Date,
  endDateObject : Date
})

const review = mongoose.Schema({
  ticket : ticket,
  restaurant_id : String,
  grade : Number,
  description : String,
  picture : picture,
  reply : { type: String, default: null }
})

const user = mongoose.Schema({
  userId : String,
  password : String,
  nickname : String,
  name : String,
  dateOfBirth : String,
  sex : String,
  phone : String,
  address : String,
  location : {
    type : {
      type : String,
      default : 'Point'
    },
    coordinates: {
      type : [Number],
      index : '2dsphere'
  }},
  ticketidList : [String],
  reviewedTicketList : [String],
  favoriteRestaurantidList : [String], //restaurant's PK
  wishList : [String] //메뉴id
})

const restaurant = mongoose.Schema({
  token : String,
  title : String,
  type : String,
  location : {
    type : {
      type : String,
      default : 'Point'
    },
    coordinates: {
      type : [Number],
      index : '2dsphere'
    }
  },
  description : String,
  address : String,
  phone : String,
  picture : picture,
  originMenuList : [originMenu],
  menuidList : [String],
  paidTicketidList : [String],
  certifiedTicketidList : [String],
  reviewidList : [String],
  favoriteCount : { type: Number, default: 0 },
  favoriteUseridList : [String], //user's PK
  profit : { type: Number, default: 0 },
  avrGrade : { type: Number, default: 0 }
})

const boss = mongoose.Schema({
  bossToken : String,//boss token
  bossId : String,
  password : String,
  name : String,
  dateOfBirth : String,
  sex : String,
  phone : String,
  restaurantidList : [String]
})

module.exports = {
  collection_picture:function(){
      return mongoose.model('picture', picture);    
  },
  collection_originMenu:function(){
    return mongoose.model('originMenu', originMenu);
  },
  collection_menu:function(){
    return mongoose.model('menu', menu);
  },
  collection_ticket:function(){
    return mongoose.model('ticket', ticket);
  },
  collection_review:function(){
    return mongoose.model('review', review);
  },
  collection_user:function(){
    return mongoose.model('user', user);
  },
  collection_reply:function(){
    return mongoose.model('reply', reply);
  },
  collection_boss:function(){
    return mongoose.model('boss', boss);
  },
  collection_restaurant:function(){
    return mongoose.model('restaurant', restaurant);
  },
}