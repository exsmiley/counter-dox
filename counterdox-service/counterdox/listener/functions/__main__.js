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

        let names = [userObj[id].twitterHandle];

        for(let pid in userObj[id].protections) {
            names.push(userObj[id].protections[pid].name);
        }

        for(let name of names) {

            let params = {
                q: name,
                count: watchCount,
                tweet_mode: 'extended'
            }

            const response = await T.get('search/tweets', params);

            for(let tweet of response.data.statuses) {
                let text = tweet.full_text;
                if(tweet.hasOwnProperty('retweeted_status')) {
                    text = tweet.retweeted_status.full_text;
                }
                
                let piiStr = await lib.wpapper['pii-detector']['@0.0.1']({pii: text});

                let found = piiStr.includes('PER') && piiStr.includes('LOC');

                if(found) {
                    let user = userDB.child(id);
                    let userData = userObj[id];
                    userData.getting_doxxed = true;
                    user.set(userData);

                    // TODO add push notification
                }
            }
        }
    }    

    return true
};
