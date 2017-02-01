var config = require('../data/twitter_config')
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(config);

var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

$(document).ready(function(){
  var tweets = twitter.getSearch({'q':'I voted for you','count': 10}, error, success);
  // $.ajax({
  //       type: 'GET',
  //       dataType: 'jsonp',
  //       data: {},
  //       url: "https://api.twitter.com/1.1/search/tweets.json?q=I%20voted%20for%20you&count=20",
  //       error: function (jqXHR, textStatus, errorThrown) {
  //           console.log(jqXHR)
  //       },
  //       success: function (msg) {
  //           console.log(msg);
  //       }
  //   });
})
