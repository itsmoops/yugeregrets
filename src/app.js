import './css/main.styl'
import preact, { render, Component } from 'preact' // eslint-disable-line
import shuffle from 'array-shuffle'
import CSSTransitionGroup from 'preact-css-transition-group'
import { Howl } from 'howler'

const intro = new Howl({
  src: ['./audio/yugeregrets-intro.mp3'],
  onend: () => loopAudio()
})

const loop = new Howl({
  src: ['./audio/yugeregrets-loop.mp3'],
  loop: true
})

const end = new Howl({
  src: ['./audio/yugeregrets-end.mp3']
})

const howls = [intro, loop, end]

const blackList = ['great', 'proud', ' happy', 'thanks', 'thank you', 'courage', 'courageous', '…', '...', 'http', 'https', 'www', 'appreciate', 'god']

const sanitizeSpeech = text => text
  .replace(/^[^0-9a-z]/gi, '')
  .replace('@realDonaldTrump', 'At Real Donald Trump')

const startMusic = () => intro.play()

const loopAudio = () => loop.play()

const speakIntro = () => speak("And now, 'yuuj' regrets. By remorseful Trump voters.")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const speak = text => new Promise(resolve =>
  window.responsiveVoice.speak(sanitizeSpeech(text), 'US English Male', { rate: 0.75, pitch: 0.8, onend: resolve })
)

const filterTweets = tweets => tweets.filter(tweet => blackList.every(filter =>
  ('retweeted_status' in tweet) && !tweet.full_text.toLowerCase().includes(filter)
))

const fetchTweets = () => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest()
  request.open('GET', '/tweets', true)

  request.onload = function () {
    try {
      if (request.status >= 200 && request.status < 400) {
        resolve(JSON.parse(request.responseText))
      }
    } catch (e) {}
    reject(request)
  }

  request.onerror = () => reject(request)

  request.send()
})

const getTweets = () => fetchTweets()
  .then(msg =>
    shuffle(filterTweets(msg)).map(tweet => ({
      ...tweet,
      full_text: tweet.full_text.replace(/RT @.+?:/g, '').replace('&amp;', '&')
    }))
  )

class Tweet extends Component {
  state = { videoID: Math.floor(Math.random() * 18) + 1 }

  render () {
    const { text, author } = this.props
    const { videoID } = this.state

    return (
      <div className="tweet">
        <div className="tweet__container">
          <div className="tweet__body">
            <p className="tweet__text">{ text }</p>
            <p className="tweet__author">{ author }</p>
          </div>
        </div>

        <video key={ videoID } className="fullscreen-video" autoPlay loop muted>
          <source src={ `/video/${videoID}.webm` } type="video/webm" />
          <source src={ `/video/${videoID}.mp4` } type="video/mp4" />
        </video>
      </div>
    )
  }
}

class TweetContainer extends Component {
  render () {
    const { children, showACLUMessage } = this.props

    return (
      <div className="fullscreen fade-appear ragrats">
        { children }

        { showACLUMessage && (
          <div className="bottom__banner fade-appear">
            <span className="donate">
              Make you feel bad{'?'} You{"'"}re probably a good person. <a href="https://action.aclu.org/secure/donate-to-aclu" target="_blank">Donate to the ACLU here.</a>
            </span>
            <span className="tr__credit">
                Tweets pulled from <a href="https://twitter.com/Trump_Regrets" target="_blank">@Trump_Regrets</a>
            </span>
          </div>
        ) }
      </div>
    )
  }
}

class Intro extends Component {
  render () {
    return (
      <div className="container title-container fade-appear">
        <div className="content">
          <h1 className="title">
            Testing <br/>
          Continuous integration
          </h1>
          <h2 className="title-author">
            by <br/>
            REMORSEFUL TRUMP VOTERS
          </h2>
        </div>
      </div>
    )
  }
}

const MuteButton = ({ enabled, onClick, children }) => (
  <button className="controls__button" type="button" onClick={ () => onClick(!enabled) }>
    { children }
    { enabled ? '🔊' : '🔇' }
  </button>
)

class Controls extends Component {
  render () {
    const { music, speech, onMuteSpeech, onMuteMusic } = this.props

    return (
      <div className="controls">
        <MuteButton enabled={ music } onClick={ onMuteMusic }> Music </MuteButton>
        <MuteButton enabled={ speech } onClick={ onMuteSpeech }> Speech </MuteButton>
      </div>
    )
  }
}

class Main extends Component {
  state = {
    tweet: null,
    index: null,
    music: true,
    speech: true
  }

  componentDidMount () {
    startMusic()
    speakIntro()

    Promise.all([
      getTweets(),
      delay(10000)
    ])
      .then(([ tweets ]) => tweets.reduce((prom, tweet, index) => prom.then(() => {
        this.setState({ tweet, index })
        if (this.state.speech) speak(tweet.full_text)
        return delay(11000) // scroll transition minus fade transition
      }), Promise.resolve()))
      .then(() => loop.on('end', () => {
        loop.pause() && end.play()
      }))
  }

  render () {
    const { tweet, index, music, speech } = this.state

    return (
      <div>
        <CSSTransitionGroup transitionName="fade">
          { tweet ? (
            <TweetContainer showACLUMessage={ index > 2 } key="tweets">
              <CSSTransitionGroup transitionName="fade">
                <Tweet text={ tweet.full_text } author={ tweet.retweeted_status.user } key={ index } />
              </CSSTransitionGroup>
            </TweetContainer>
          ) : (
            <Intro key="intro" />
          ) }
        </CSSTransitionGroup>

        <Controls onMuteSpeech={ this.onMuteSpeech } onMuteMusic={ this.onMuteMusic } music={ music } speech={ speech } />

      </div>
    )
  }

  onMuteSpeech = speech => {
    this.setState({ speech })
    if (!speech) window.responsiveVoice.cancel()
  }

  onMuteMusic = music => {
    this.setState({ music })
    if (music) {
      this.state.lastPlaying.play()
    } else {
      howls.forEach((howl) => {
        if (howl.playing()) {
          howl.pause()
          this.setState({ lastPlaying: howl })
        }
      })
    }
  }
}

window.responsiveVoice.addEventListener('OnReady', () => {
  render(<Main />, document.getElementById('app'))
})
