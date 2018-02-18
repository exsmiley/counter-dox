const Twit = require('twit');

const twitterConfig = {
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret,
  timeout_ms:           5*1000,  // optional HTTP request timeout to apply to all requests. 
}

const T = new Twit(twitterConfig);
const watchCount = 3;

/**
* Posts specified tweet to the RealTotallyreal account
* @param {string} status to post to twitter
* @returns {string}
*/
module.exports = async (status = 'I am the most real account on Twitter! #real #totallyreal', context) => {

    const response = await T.post('statuses/update', { status: status });
    return `Posted "${status}" to @RealTotallyreal!`;
};