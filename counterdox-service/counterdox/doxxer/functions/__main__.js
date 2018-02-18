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
let userDB = admin.database().ref("/users");;

const T = new Twit(twitterConfig);
const watchCount = 3;

/**
* Posts doxxing to the EvenMooreReal account
* @param {string} tweet the original tweet
* @param {string} location the text of the location in the tweet
* @param {string} id of the user being attacked
* @returns {boolean}
*/
module.exports = async (tweet = 'Daniel does not live in Hanover', location='Hanover', id='GbNAbzAZ40RK20g4rYaOje6N8ox2', context) => {
    const fake1 = 'http://vps.papper.me:5000/fake';
    let db = userDB.child(id).child('sent_doxxes');

    let totalNum = 500;
    let sendNum = 5;
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

    db.push(samples);
    
    return true;
};
