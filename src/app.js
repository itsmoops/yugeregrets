// TODO: make blacklist of words we dont want in tweets - proud, honored, happy
// blacklist if tweet has a photo

var blackList = ["great", "proud", " happy", "thanks", "thank you", "courage", "courageous", "…", "...", "http", "https", "www", "appreciate", "god"]
var tweets = []
var writtenTweet = ""

function loadTweet() {
  $('#title').removeClass("fade-in")
  $('#title').addClass("fade-out")
  setTimeout(function(){
    var randStatus = tweets[Math.floor(Math.random() * tweets.length)]
    writtenTweet = randStatus.full_text.replace(/RT @.+?:/g, '')
    $("#tweet").text(writtenTweet)
    $("#author").text("-" + randStatus.user.screen_name)
    $("#tweet-container").addClass("scroll-up")
    $('#ragrats').addClass("fade-in")
    speakTweet(writtenTweet)
    setTimeout(function(){
      $("#donate").addClass("fade-in")
      setTimeout(function(){
        $("#reset").addClass("fade-in")
      }, 5000)
    }, 15000)
  }, 3000)
}

function speakTweet(writtenTweet) {
  var spokenTweet = writtenTweet.replace(/^[^0-9a-z]/gi, '').replace('&amp;','and').replace("@realDonaldTrump", "At Real Donald Trump");
  responsiveVoice.speak(spokenTweet, "US English Male", { rate: .75, pitch: .8})
}

function speakIntro() {
  responsiveVoice.speak("And now, 'yuuj' regrets. By remorseful Trump voters.", "US English Male", { rate: .75, pitch: .8, onend: loadTweet})
}

function filterTweets() {
  tweets.forEach(function(tweet, idx){
    blackList.forEach(function(filter){
      if (tweet.full_text.toLowerCase().indexOf(filter) > -1) {
        tweets.splice(idx, 1)
      }
    })
  })
}

function loadVideo() {
  var num = Math.floor(Math.random() * 13) + 1
  var sourceUrl = "./video/" + num + ".webm"
  var video = document.getElementById("video")
  video.src = sourceUrl
  video.load()
}

if (typeof window !== "undefined") {
  loadVideo()

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
      // loadTweet()
      speakIntro()
    }, 1500)
  })
}
