const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const Twit = require('twit');
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig.json');
const axios = require("axios");

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

const T = new Twit(twitterConfig);
const watchCount = 3;
const fake1 = 'http://vps.papper.me:5000/fake';

const totalNum = 50;
const sendNum = 5;

/**
* Posts doxxing to the EvenMooreReal account
* @param {string} user id of the user being doxxed
* @param {string} alert id of the dox that we're countering
* @returns {boolean}
*/
module.exports = async (user='ISsAuO6fzWU9Clq9pFvE3VOyDci1', alert='-L5bLhjL5jTW_ymp87hX', context) => {
    let userDB = admin.database().ref("/users").child(user);
    let alertDB = userDB.child('alerts').child(alert);

    let alertPreInfo = await alertDB.once('value');
    let alertInfo = alertPreInfo.val();
    console.log(alertInfo)

    if(alertInfo.triggered) {
        return false;
    } else {
        alertInfo.triggered = true;
        alertDB.set(alertInfo)
    }

    let tweet = alertInfo.tweet;
    let location = alertInfo.LOC;

    let samples = []

    // actual tweets
    for(let i = 0; i < sendNum; i++) {
        let response = await axios.get(fake1);
        let sampleTweet = tweet.replace(location, response.data);
        await T.post('statuses/update', { status: sampleTweet });
        samples.push(sampleTweet);
    }

    // just more samples
    for(let i = 0; i < totalNum-sendNum; i++) {
        let response = await axios.get(fake1);
        let sampleTweet = tweet.replace(location, response.data);
        samples.push(sampleTweet);
    }

    userDB.child('sent_doxxes').push(samples);
    
    return true;
};
