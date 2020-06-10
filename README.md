### bmPushNotification

This is a small nodejs script that will connect to the Brandmeister server and send you a push notification for any new transmission.

A new transmission is defined as a transmission after X seconds of silence.  By default, X is 900 (15 minutes)


If you don't have nodejs installed, that will be step 1 (don't know if it's installed? Go to a command prompt and type `node`)

After cloning this repo and entering the folder, edit `index.js` to define your preferred talkgroups and enter your pushover userkey & token (https://pushover.net/).  Supports more than one if you want to run this service for multiple users that want to be notified about the same talkgroup activity.

Then,

```
npm install
node index.js
```

