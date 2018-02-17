var request = require('request')

/**
 * Detect whether a string contains PII
 * @param {string} pii String that you would like to check for PII
 * @returns {string} PII found (person, location, or none)
 */
module.exports = (pii = 'Joe is from New York City', context, callback) => {
  var data =
    {
      'Inputs': {
        'input1': {
          'ColumnNames': [
            'Col1'
          ],
          'Values': [
            [
              pii
            ]
          ]
        }
      },
      'GlobalParameters': {}
    }
  var bodyData = JSON.stringify(data)
  var options = {
    uri: process.env.cognitive,
    method: 'POST',
    headers: {
      'Authorization': process.env.key,
      'Content-Type': 'application/json'
    },
    body: bodyData
  }
  request(options, function (error, response, body) {
    if (error) {
      return callback(error)
    }
    console.log(body) // Print the shortened url.
    var bodyParsed = JSON.parse(body)
    var values = bodyParsed.Results.output1.value.Values
    console.log(values)
    var detected = ''
    for (var i = 0; i < values.length; i++) {
      console.log(values[i])
      detected += ' ' + values[i][1] + ',' + values[i][4]
    }
    detected = detected.substring(1)
    return callback(null, detected)
  })
}
