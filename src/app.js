import './css/main.styl'
import 'core-js/shim'
import preact, { render, Component } from 'preact' // eslint-disable-line
import shuffle from 'array-shuffle'
import CSSTransitionGroup from 'preact-css-transition-group'
import { Howl } from 'howler'

const TWEET_BLACK_LIST = [ /^…/, /…$/, /^\.\.\./, /\.\.\.$/, /https?:/, /www/ ]

const NUMBER_OF_VIDEOS = 18

const VIDEO_IDS = shuffle([...Array(NUMBER_OF_VIDEOS).keys()])

const WEBM_SUPPORT = (() => {
  const testEl = document.createElement('video')
  return !!(testEl.canPlayType && testEl.canPlayType('video/webm; codecs="vp8, vorbis"'))
})()

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

const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1

const sanitizeSpeech = text => sanitizeText(text)
  .replace('@realDonaldTrump', 'At Real Donald Trump!')
  .toLowerCase()
  .replace(/^[^0-9a-z]/gi, '')
  .replace('#', 'hashtag')

const sanitizeText = text => text
  .replace(/RT @.+?:/g, '')
  .replace('&amp;', '&')

const startMusic = () => intro.play()

const loopAudio = () => loop.play()

const speakIntro = () => speak("And now, yuuj regrets. By remorseful Trump voters.")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const speak = text => new Promise(resolve =>
  window.responsiveVoice.speak(sanitizeSpeech(text), 'US English Male', { rate: 0.75, pitch: 0.8, onend: resolve })
)

const filterTweets = tweets => tweets.filter(tweet => TWEET_BLACK_LIST.every(filter =>
  ('retweeted_status' in tweet) && !filter.test(tweet.full_text.toLowerCase())
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
      ...tweet
    }))
  )

class Tweet extends Component {
  render () {
    const { index, tweet } = this.props
    const { id_str: id, full_text: text, user } = tweet.retweeted_status
    const videoID = VIDEO_IDS[index % NUMBER_OF_VIDEOS] + 1

    return (
      <div className="tweet">
        <div className="tweet__container">
          <div className="tweet__body">
            <p className="tweet__text">{ sanitizeText(text) }</p>
            <a className="tweet__author" target="_blank" href={ `http://twitter.com/${user.screen_name}/status/${id}` }>
              @{ user.screen_name }
            </a>
          </div>
        </div>

        <video key={ videoID } src={`/video/${videoID}.${WEBM_SUPPORT ? 'webm' : 'mp4'}`} className="fullscreen-video" autoPlay loop muted="true" />
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

        <span className="tr-credit fade-appear">
          Tweets pulled from <a href="https://twitter.com/Trump_Regrets" target="_blank">@Trump_Regrets</a>
        </span>

        { showACLUMessage && (
          <div className="bottom__banner fade-appear">
            <span className="donate">
              Make you feel bad{'?'} You{"'"}re probably a good person. <a href="https://action.aclu.org/secure/donate-to-aclu" target="_blank">Donate to the ACLU here.</a>
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
            Yuge <br/>
            Regrets
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
  <button className={ `controls__button controls__button--${enabled ? 'enabled' : 'disabled'}` } type="button" onClick={ () => onClick(!enabled) }>
    { children }
  </button>
)

class Controls extends Component {
  render () {
    const { music, speech, onMuteSpeech, onMuteMusic } = this.props
    const isVoiceSupported = window.responsiveVoice.voiceSupport()

    return (
      <div className="controls fade-appear">
        <MuteButton enabled={ music } onClick={ onMuteMusic }>
          <svg version="1.1" width="32" height="32" viewBox="0 0 32 32" className="controls__icon">
            <path d="M30 0h2v23c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-11.501l-16 3.556v15.444c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-19.501l18-4z"></path>
          </svg>
        </MuteButton>
        { (isVoiceSupported && !isiOS && !isAndroid) && (
          <MuteButton enabled={ speech } onClick={ onMuteSpeech }>
            <svg version="1.1" width="32" height="32" viewBox="0 0 32 32" className="controls__icon">
              <path d="M22.485 25.985c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 4.094-4.094 4.094-10.755 0-14.849-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c2.55 2.55 3.954 5.94 3.954 9.546s-1.404 6.996-3.954 9.546c-0.293 0.293-0.677 0.439-1.061 0.439v0zM17.157 23.157c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.534-2.534 2.534-6.658 0-9.192-0.586-0.586-0.586-1.536 0-2.121s1.535-0.586 2.121 0c3.704 3.704 3.704 9.731 0 13.435-0.293 0.293-0.677 0.439-1.061 0.439z"></path>
              <path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path>
            </svg>
          </MuteButton>
        ) }
      </div>
    )
  }
}

class SocialShare extends Component {
  render() {
    return (
      <div className="social__share">
        <div className="fb-share-button share"
             data-href="http://www.yugeregrets.com/"
             data-layout="button_count"
             data-size="small"
             data-mobile-iframe="true">
        </div>
        <div className="share">
          <a href="https://twitter.com/share" class="twitter-share-button" data-text="Yuge Regrets" data-hashtags="trumpregrets" data-related="Trump_Regrets" data-show-count="false">Tweet</a>
          <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
      </div>
    )
  }
}

class Main extends Component {
  state = {
    tweet: null,
    index: null,
    music: isiOS ? false : true,
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
        const { speech } = this.state

        this.setState({ tweet, index })

        if (speech) speak(tweet.full_text)

        return delay(11000) // scroll transition minus fade transition
      }), Promise.resolve()))
      .then(() => loop.on('end', () => {
        loop.pause() && end.play()
      }))
  }

  render () {
    const { tweet, index, music, speech } = this.state

    return (
      <div className="fill">
        <CSSTransitionGroup transitionName="fade">
          { tweet ? (
            <TweetContainer showACLUMessage={ index > 2 } key="tweets">
              <CSSTransitionGroup transitionName="fade">
                <Tweet tweet={tweet} key={ '' + index } index={ index } />
              </CSSTransitionGroup>
            </TweetContainer>
          ) : (
            <Intro key="intro" />
          ) }
        </CSSTransitionGroup>

        <Controls onMuteSpeech={ this.onMuteSpeech } onMuteMusic={ this.onMuteMusic } music={ music } speech={ speech } />

        <SocialShare />

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
