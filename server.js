var express = require('express');
var app = express();
var config = require('./data/twitter_config')
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(config);

var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};


app.set('port', (process.env.PORT || 8080));
app.set('json spaces', 2)

app.use(express.static(__dirname + '/src'));

app.get('/', function(request, response) {
  response.render('pages/index')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})

app.get('/tweets', function(request, response) {
  twitter.getSearch({'q':'@realdonaldtrump "voted for you"', 'count': 20, 'tweet_mode': 'extended'}, error, function(data) {
    response.json(JSON.parse(data))
  })
  // twitter.getSearch({'q':'"voted for you"','count': 10, 'result\_type':'popular'}, error, function(data) {
  //   response.json(JSON.parse(data))
  // })
})
