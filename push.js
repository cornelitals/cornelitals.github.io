const webPush = require('web-push');
     
const vapidKeys = {
   "publicKey": "BCiLSKZipmYhF8J08Y01vXif23cFiWJe4rEG0yEQXjngVQ5bnySbsHvI8hbPJQtZ0_0-7PiDUZwyphuRuL6Qnrs",
   "privateKey": "u7fWEv0CMuS8A_B4U8l9h354ZIZBjizyzAzSrbKoeKk"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ei36wmVM-ww:APA91bFiXt4LLdJOMPAjdwWfbXQ8HWIuAVnjcgH9TqVwlGXUZgal4aop1QVOQpfmYYkJYKpm1g2B5m2z07echO9K94u9NmhO_tkmeqwdnNpb-UEsdoYhJosT33sCVtJMaUZp-jsV7o62",
   "keys": {
       "p256dh": "BAworjs0VZugfc4OusuQrUuL70hKV85KWfmZDFSw3myv4OBVFYhTjJD2ofpeg+uL8WCZRXPpBduIDtP5eKypiqU=",
       "auth": "cujg5Pgn54I6FhGh0kU7qg=="
   }
};

const payload = "Congratulations! Now you can receive push notifications!";
 
const options = {
   gcmAPIKey: "276296065142",
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);