// TODO: make blacklist of words we dont want in tweets - proud, honored, happy
// blacklist if tweet has a photo

var blackList = ["great", "proud", " happy", "thanks", "thank you"]
var tweets = []
var writtenTweet

function speakIntro() {
  responsiveVoice.speak("And now, 'yuuj' regrets. By remorseful Trump voters.", "US English Male", { rate: .75, pitch: .8})
}

function speakTweet() {
  var randStatus = tweets[Math.floor(Math.random() * tweets.length)]
  writtenTweet = randStatus.full_text
  var spokenTweet = writtenTweet.replace(/RT @.+?:/g, '').replace(/^[^0-9a-z]/gi, '').replace('&amp;','and').replace("@realDonaldTrump", "Real Donald Trump");
  console.log(spokenTweet)
  responsiveVoice.speak(spokenTweet, "US English Male", { rate: .75, pitch: .8})
}

function filterTweets() {
  tweets.forEach(function(tweet, idx){
    blackList.forEach(function(filter){
      if (tweet.full_text.indexOf(filter) > -1) {
        tweets.splice(idx, 1)
      }
    })
  })
}


if (typeof window !== "undefined") {
  $(window).load(function(){
    $.ajax({
        type: 'GET',
        dataType: 'json',
        data: {},
        url: "/tweets",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        },
        success: function (msg) {
            tweets = msg.statuses
            filterTweets()
        }
    });

    setTimeout(function(){
      speakIntro()
      speakTweet()
    }, 1000)
  })
}
