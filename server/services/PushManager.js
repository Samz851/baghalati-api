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
    processing : {
        "body" : "تم اعداد طلب وهو قيد التوصيل",
        "title": "طلب جديد",
        "key_1" : "Value 1",
        "key_2" : "Value 1"
    },
    delivering: {
        "body" : "طلبك في الطريق ترقب وصوله",
        "title": "طلب جديد",
        "key_1" : "Value 1",
        "key_2" : "Value 1"
    }
}


PushManager.sendGlobalNotification = (title, body) => {

}

PushManager.sendDirectNotification = (title, body, deviceID) => {

}

PushManager.sendOrderNotification = ( deviceID, status ) => {
    let message = await https.post(fcmURI, {to: deviceID, data: statusBody[status]}, {headers: headers});
    
}

module.exports = PushManager;