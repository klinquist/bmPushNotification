const MINIMUM_REQUIRED_TRANSMIT_TIME_SECONDS = 2;
const TALK_GROUPS_TO_MONITOR = [3100];
const ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS = 900;  // 0 = don't use this feature


//Enter your pushover (https://pushover.net/) user key & token here... this is an array that can handle >1 object of userkey & tokens!
const pushUsers = [{
    user: 'XXX',
    token: 'XXX'
}];


//Do not display messages older than CACHE_SECONDS ago and do not display messages with a duplicate SessionID within CACHE_SECONDS. The default value is typically fine here.
const CACHE_SECONDS = 60;
const io = require('socket.io-client');
const moment = require('moment');
const NodeCache = require('node-cache');
const sessionIdCache = new NodeCache({ stdTTL: CACHE_SECONDS });
const lastHeardCache = new NodeCache();
const BM_DEFAULT_URL = 'https://api.brandmeister.network';
const BM_DEFAULT_OPTS = {
    path: '/lh',
    reconnection: true
};
const socket = io(BM_DEFAULT_URL, BM_DEFAULT_OPTS);

socket.open();

socket.on('connect', () => {
    console.log('Connected to BM API');
});

const Push = require('pushover-notifications');
const pushes = [];

for (let i = 0; i < pushUsers.length; i++){
    pushes.push(new Push({ user: pushUsers[i].user, token: pushUsers[i].token}));
}


socket.on('mqtt', (msg) => {
    const lhMsg = JSON.parse(msg.payload);
    if (TALK_GROUPS_TO_MONITOR.indexOf(lhMsg.DestinationID) > -1 && lhMsg.Event == 'Session-Stop' && (lhMsg.Stop - lhMsg.Start) >= MINIMUM_REQUIRED_TRANSMIT_TIME_SECONDS && !sessionIdCache.get(lhMsg.SessionID)) {
        sessionIdCache.set(lhMsg.SessionID, true);
        if ((Math.round(new Date().getTime() / 1000) - lhMsg.Stop) <= CACHE_SECONDS) {
            const lastHeard = lastHeardCache.get(lhMsg.DestinationID);
            lastHeardCache.set(lhMsg.DestinationID, new Date().getTime());
            if (!ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS || (ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS && (!lastHeard || new Date().getTime() - lastHeard > ONLY_NOTIFY_IF_NO_TRANSMISSIONS_FOR_SECONDS * 1000))) {
                const duration = moment.duration(0 - (new Date().getTime() - lastHeard)).humanize();
                const msg = `Talkgroup ${lhMsg.DestinationID} - Transmission from ${lhMsg.SourceCall} lasted ${lhMsg.Stop - lhMsg.Start} seconds. The previous transmission was ${duration} ago.`;
                console.log(msg);
                pushes.forEach((push)=>{
                    push.send({
                        message: msg,
                        priority: 1
                    });
                });
            } else {
                console.log('Not notifying, last activity was too soon.');
            }
        }
    }
});





