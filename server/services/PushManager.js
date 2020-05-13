const https = require('axios');


let PushManager = {}

const fcmID = 'key=AAAAGj37bNY:APA91bEp7lw5RiIrgn5v7s24_OJ6VPKf8eHi-Zce0H6fdQHZyUmcReyb8ySkO3WvEjNjTUqtqcTRddMu_7uR4sATQp0hBqxSw286HsUx6AucTt4GpiV6aL9H_-uhvxBxO9Y-7_c8qXvs';
const host = 'fcm.googleapis.com'
const headers = {
    Authorization: 'key=AAAAGj37bNY:APA91bEp7lw5RiIrgn5v7s24_OJ6VPKf8eHi-Zce0H6fdQHZyUmcReyb8ySkO3WvEjNjTUqtqcTRddMu_7uR4sATQp0hBqxSw286HsUx6AucTt4GpiV6aL9H_-uhvxBxO9Y-7_c8qXvs',
    Host: 'fcm.googleapis.com',
    'Content-Type': 'application/json'
}
const fcmURI = 'https://fcm.googleapis.com/fcm/send'
const statusBody = {
    received : {
        "body" : "طلبك الآن قيد التنفيذ وسيتم توصله قريبا",
        "title": "طلب جديد",
        "key_1" : "Value 1",
        "key_2" : "Value 1"
    },
    onroute: {
        "body" : "طلبك في الطريق ترقب وصوله",
        "title": "طلب جديد",
        "key_1" : "Value 1",
        "key_2" : "Value 1"
    },
    delivered: {
        "body" : "تم توصيل طلبك بنجاح",
        "title": "طلب جديد",
        "key_1" : "Value 1",
        "key_2" : "Value 1"
    }
}


PushManager.sendGlobalNotification = (title, body) => {

}

PushManager.sendDirectNotification = (title, body, deviceID) => {

}

PushManager.sendOrderNotification = async ( deviceID, status ) => {
    console.log(`Order Status is: ${status} and device ID is: ${deviceID}`);
    try{
        let message = await https.post(fcmURI, {to: deviceID, data: statusBody[status]}, {headers: headers});
    }catch(error){
        throw error;
    }
    
}

module.exports = PushManager;