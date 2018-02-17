var request = require('request')

/**
 * A basic Hello World function
 * @param {string} pii String that you would like to check for PII
 * @returns {boolean}  Whether the string contains an address
 */
module.exports = (pii = 'Joe is from New York City', context, callback) => {
  var options = {
    uri: process.env.cognitive,
    method: 'POST',
    Authorization: process.env.key,
    json: {
      'Values': ['Joe is from New York City']
    }
  }
  request(options, function (error, response, body) {
    if (error) {
      return callback(error)
    }
    console.log(body.id) // Print the shortened url.
    return callback(null, body)
  })
}
