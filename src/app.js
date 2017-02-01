var config = require('../src/data/twitter_config')
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(config);

var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

// $(document).ready(function(){
  // var tweets = twitter.getSearch({'q':'voted for you','count': 10}, error, success);
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
  //
  // TODO: make blacklist of words we dont want in tweets - proud, honored, happy
  // blacklist if tweet has a photo
  // make whitelist of words that make sure its related to trump - trump @realDonaldTrump
  // convert @realDonaldTrump to "At real donald trump"
// })

if (typeof window !== "undefined") {
  $(window).load(function(){
    setTimeout(function(){
      // var voicelist = responsiveVoice.getVoices();
      // voicelist.forEach(function(voice){
      //   console.log(voice.name)
      // })
      responsiveVoice.speak("And now, 'yuuj' regrets. By remorseful Trump voters.", "US English Male", { rate: .75, pitch: .8})

      setTimeout(function(){
        // responsiveVoice.speak(msg, "US English Male", { rate: .75 })
      }, 1000)

    }, 750)
  })
}
