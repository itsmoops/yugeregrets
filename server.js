const express = require('express')
const config = require('./data/twitter_config')
const Twitter = require('twitter-node-client').Twitter
const moment = require('moment')
const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')

const twitter = new Twitter(config)
const app = express()

const error = (err, response, body) => console.log('ERROR [%s]', err) // eslint-disable-line

app.set('port', process.env.PORT || 8080)
app.set('json spaces', 2)

app.use(express.static(path.join(__dirname, '/src')))

app.get('/', (request, response) => {
  response.render('pages/index')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

/**
* checks to see if a tweets.json file already exists
*/
const fileExists = filePath => new Promise((resolve, reject) => {
  fs.stat(filePath, (err, stat) => {
    if (!err) {
      resolve(true)
    } else if (err && err.code === 'ENOENT') {
      resolve(false)
    } else {
      reject(err)
    }
  })
})

const getTweets = filePath => new Promise((resolve, reject) => {
  const searchParams = {
    screen_name: 'Trump_Regrets',
    count: '50',
    tweet_mode: 'extended'
  }
  twitter.getUserTimeline(searchParams, error, data => {
    data = JSON.parse(data)
    data.unshift({
      DATE_GENERATED: moment()
    })

    jsonfile.writeFile(filePath, data, { spaces: 2 }, function(err) {
      if (err) console.error(err)
    })
    resolve(data)
  })
})

app.get('/tweets', (request, response) => {
  const filePath = './data/tweets.json'

  let tweets = {}

  fileExists(filePath).then((exists) => {
    if (exists) {
      const today = moment()
      tweets = require(filePath)
      /* we only want to generate new tweets once per day
      * so we check against the "DATE_GENERATED" property */
      if (today.isAfter(tweets[0].DATE_GENERATED, 'hour')) {
        // if it's been more than a day, regenerate tweets
        getTweets(filePath).then(data => {
          tweets = data
          response.json(tweets)
        })
      } else {
        // if it hasn't been a day, don't regenerate
        response.json(tweets)
      }
    } else {
      // generate tweets for the first time if file doesn't exist
      getTweets(filePath).then((data) => {
        tweets = data
        response.json(tweets)
      })
    }
  })
})
