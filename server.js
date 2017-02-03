var express = require('express')
var app = express()
var config = require('./data/twitter_config')
var Twitter = require('twitter-node-client').Twitter
var twitter = new Twitter(config)
var moment = require('moment')
var jsonfile = require('jsonfile')
var fs = require('fs')

var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};


app.set('port', (process.env.PORT || 8080))
app.set('json spaces', 2)

app.use(express.static(__dirname + '/src'))

app.get('/', function(request, response) {
  response.render('pages/index')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})

/**
	* checks to see if a tweets.json file already exists
*/
function _fileExists(filePath) {
    return new Promise(function(resolve, reject) {
        fs.stat(filePath, function(err, stat) {
            if (err == null) {
                 resolve(true)
            } else if (err && err.code == 'ENOENT') {
                 resolve(false)
            }
        });
    })
}

function _getTweets(filePath) {
  return new Promise(function(resolve, reject) {
    twitter.getSearch({'q':'@realdonaldtrump "voted for you"', 'count': 100, 'tweet_mode': 'extended'}, error, function(data) {
      data = JSON.parse(data)
      data.DATE_GENERATED = moment()
      var spaces = {spaces: 2};
      jsonfile.writeFile(filePath, data, spaces, function(err) {
          if (err) {
              console.log(err)
          }
      })
      resolve(data)
    })
  })
}

app.get('/tweets', function(request, response) {
  var filePath = './data/tweets.json'
  var tweets = {}
  _fileExists(filePath).then(function(exists) {
      if (exists) {
        var today = moment();
        tweets = require(filePath)
        /* we only want to generate new tweets once per day
        * so we check against the "DATE_GENERATED" property */
        if (today.isAfter(tweets.DATE_GENERATED, 'day')) {
            // if it's been more than a day, regenerate tweets
            _getTweets(filePath).then(function(data) {
              tweets = data
              response.json(tweets)
            })
        } else {
          // if it hasn't been a day, don't regenerate
          response.json(tweets)
        }
      } else {
        // generate tweets for the first time if file doesn't exist
        _getTweets(filePath).then(function(data){
          tweets = data
          response.json(tweets)
        })
      }
  })
})
