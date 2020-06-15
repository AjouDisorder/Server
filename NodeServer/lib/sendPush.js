var db = require('./mongoCollections')

module.exports = {
    push1: function (req, res) {
        var FCM = require('fcm-node')

        var serverKey = 'AAAAATL5vJQ:APA91bHWndoQiAFdXtclaCzpl8BTRTqhTLORvKXdyZqDTg2G7tk70AvcSbZp_7qEiTCVGahsJOGpT1n2U7IwEkSVr18_ehvfJ9vvrnGsAKjNFW82HDbxU10wY1ckb8jz7hfpcHfeZRzH'
        var destToken = req.body.destToken
        var menu = req.body.menu

        var message = {
            to: destToken,

            notification: {
                title : "상품 구매 알림",
                body : menu + "가 구매 되었습니다",
                sound : "default",
                click_action : "FCM_PLUGIN_ACVIVITY"

            }
        };
        var fcm = new FCM(serverKey)

        fcm.send(message, function(err, response) {
            if(err){
                console.error('push fail');
                console.error(err);
            }
            console.log("push success");
            console.log(response)

        })

       
    },
    push2: function (req, res) {
        var FCM = require('fcm-node')

        var serverKey = 'AAAAATL5vJQ:APA91bHWndoQiAFdXtclaCzpl8BTRTqhTLORvKXdyZqDTg2G7tk70AvcSbZp_7qEiTCVGahsJOGpT1n2U7IwEkSVr18_ehvfJ9vvrnGsAKjNFW82HDbxU10wY1ckb8jz7hfpcHfeZRzH'
        var menu = req.body.menu
        var destTopic = req.body.topic
        var topic = '/topics/' + destTopic

        var message = {
            to: topic,

            notification: {
                title : "상품 판매 알림",
                body : menu + "가 할인중입니다",
                sound : "default",
                click_action : "FCM_PLUGIN_ACVIVITY"

            }
        };
        var fcm = new FCM(serverKey)

        fcm.send(message, function(err, response) {
            if(err){
                console.error('push fail');
                console.error(err);
            }
            console.log("push success");
            console.log(response)

        })

       
    }
}

