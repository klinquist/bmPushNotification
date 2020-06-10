### bmPushNotification

This is a small nodejs script that will connect to the Brandmeister server and send you a push notification for any new transmission.

A new transmission is defined as a transmission after X seconds of silence.  By default, X is 900 (15 minutes)

Edit `index.js` to define your preferred talkgroups and enter your pushover userkey & token (https://pushover.net/).  Supports more than one if you want to run this service for multiple users that want to be notified about the same talkgroup activity.


Install & run:
```
npm install
node index.js
```

