if (typeof document !== "undefined") {
  $(document).ready(function(){
    // TODO: make blacklist of words we dont want in tweets - proud, honored, happy
    // blacklist if tweet has a photo
    // make whitelist of words that make sure its related to trump - trump @realDonaldTrump
    // convert @realDonaldTrump to "At real donald trump"
  })
}

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
