const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const Twit = require('twit');
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig.json');

const twitterConfig = {
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret,
  timeout_ms:           5*1000,  // optional HTTP request timeout to apply to all requests. 
}

admin.initializeApp({
    databaseURL: 'https://counterdox-2f53d.firebaseio.com/',
    credential: admin.credential.cert(serviceAccount)
});
let userDB = admin.database().ref("/users");;

const T = new Twit(twitterConfig);
const watchCount = 3;


/**
* Cron job to figure out if specific users are getting doxed :O
* @returns {boolean}
*/
module.exports = async (context) => {
    let usersObjFinder = await userDB.once('value');
    let userObj = usersObjFinder.val();

    for(let id in userObj) {
        let lastSeenDB = userDB.child(id).child('lastSeen');
        let lastSeenFinder = await lastSeenDB.once('value');
        let lastSeen = lastSeenFinder.val();
        console.log(lastSeen)
        if(!lastSeen) {
            lastSeen = [];
        } else {
            let els = []
            for(let el in lastSeen) {
                els.push(lastSeen[el]);
            }
            lastSeen = els;
        }
        console.log(lastSeen)
        let seenSet = new Set(lastSeen);

        let names = [userObj[id].twitterHandle];

        for(let pid in userObj[id].protections) {
            names.push(userObj[id].protections[pid].name);
        }

        // manage them on a user level in case there are duplicates
        let seenTweets = new Set();
        console.log(`Managing ${id}...`);

        for(let name of names) {
            console.log(name)
            let params = {
                q: name,
                count: watchCount,
                tweet_mode: 'extended'
            }

            const response = await T.get('search/tweets', params);
            if(!response.data.statuses) {
                continue;
            }
            for(let tweet of response.data.statuses) {

                let text = tweet.full_text;
                if(tweet.hasOwnProperty('retweeted_status')) {
                    text = tweet.retweeted_status.full_text;
                }

                let dedupText = tweet.id + '|' + text + '|' + Date.parse(tweet.created_at);
                if(seenTweets.has(text) || tweet.user.screen_name == 'EvenMooreReal' || seenSet.has(dedupText)) {
                    continue;
                } else {
                    seenTweets.add(text)
                }

                let piiStr = await lib.wpapper['pii-detector']['@0.0.2']({pii: text});

                let found = piiStr.includes('PER') && (piiStr.includes('LOC') || piiStr.includes('ORG'));
                
                if(found) {
                    let doxInfo = {};
                    const fields = piiStr.split(';');
                    for(let field of fields) {
                        const fieldData = field.split('|')
                        const dataInfo = fieldData.slice(0, fieldData.length-1).join();
                        let fieldType = fieldData[fieldData.length-1];
                        if(fieldType == 'ORG') {
                            fieldType = 'LOC';
                        }
                        doxInfo[fieldType] = dataInfo;
                    }
                    doxInfo['tweet'] = text;
                    doxInfo['triggered'] = false;

                    let alerts = userDB.child(id).child('alerts');
                    await alerts.push(doxInfo);
                    await userDB.child(id).child('getting_doxxed').set(false);
                    seenSet.add(dedupText);
                    // TODO add push notification
                }
            }

            // add dedup stuff
            let dedupArray = Array.from(seenSet);
            dedupArray.sort(function(x,y) {
                let xsplit = x.split('|')
                let x1 = parseInt(xsplit[xsplit.length-1])
                let ysplit = y.split('|')
                let y1 = parseInt(ysplit[ysplit.length-1])
                return x1-y1;
            });
            dedupArray = dedupArray.slice(0,5);

            let dedupObj = {};

            for(let val of dedupArray) {
                dedupObj[lastSeenDB.push().key] = val;
            }

            lastSeenDB.set(dedupObj);
        }
    }    

    return true
};
