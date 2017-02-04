var express = require('express')
var app = express()
var config = require('./data/twitter_config')
var Twitter = require('twitter-node-client').Twitter
var twitter = new Twitter(config)
var moment = require('moment')
var jsonfile = require('jsonfile')
var fs = require('fs')

var error = (err, response, body) => {
    console.log('ERROR [%s]', err);
};


app.set('port', (process.env.PORT || 8080))
app.set('json spaces', 2)

app.use(express.static(__dirname + '/src'))

app.get('/', (request, response) => {
  response.render('pages/index')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

/**
	* checks to see if a tweets.json file already exists
*/
_fileExists = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stat) => {
            if (err == null) {
                 resolve(true)
            } else if (err && err.code == 'ENOENT') {
                 resolve(false)
            }
        });
    })
}

_getTweets = (filePath) => {
  return new Promise((resolve, reject) => {
    var searchParams = {
      screen_name: 'Trump_Regrets',
      count: '50',
      tweet_mode: 'extended'
    }
    twitter.getUserTimeline(searchParams, error, (data) => {
      data = JSON.parse(data)
      data.DATE_GENERATED = moment()
      var spaces = {spaces: 2};
      jsonfile.writeFile(filePath, data, spaces, (err) => {
          if (err) {
              console.log(err)
          }
      })
      resolve(data)
    })
  })
}

app.get('/tweets', (request, response) => {
  var filePath = './data/tweets.json'
  var tweets = {}
  _fileExists(filePath).then((exists) => {
      if (exists) {
        var today = moment()
        tweets = require(filePath)
        /* we only want to generate new tweets once per day
        * so we check against the "DATE_GENERATED" property */
        if (today.isAfter(tweets.DATE_GENERATED, 'day')) {
            // if it's been more than a day, regenerate tweets
            _getTweets(filePath).then((data) => {
              tweets = data
              response.json(tweets)
            })
        } else {
          // if it hasn't been a day, don't regenerate
          response.json(tweets)
        }
      } else {
        // generate tweets for the first time if file doesn't exist
        _getTweets(filePath).then((data) => {
          tweets = data
          response.json(tweets)
        })
      }
  })
})
