import './css/main.styl'
import preact, { render, Component } from 'preact' // eslint-disable-line
import shuffle from 'array-shuffle'
import CSSTransitionGroup from 'preact-css-transition-group'

const blackList = ['great', 'proud', ' happy', 'thanks', 'thank you', 'courage', 'courageous', '…', '...', 'http', 'https', 'www', 'appreciate', 'god']

const sanitizeSpeech = text => text
  .replace(/^[^0-9a-z]/gi, '')
  .replace('@realDonaldTrump', 'At Real Donald Trump')

const speakIntro = () => speak("And now, 'yuuj' regrets. By remorseful Trump voters.")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const speak = text => new Promise(resolve =>
  window.responsiveVoice.speak(sanitizeSpeech(text), 'US English Male', { rate: 0.75, pitch: 0.8, onend: resolve })
)

const filterTweets = tweets => tweets.filter(tweet => blackList.every(filter =>
  !tweet.full_text.toLowerCase().includes(filter)
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

    const videoSource = `/video/${videoID}.mp4`

    return (
      <div className="tweet">
        <div className="tweet__container">
          <div className="tweet__body">
            <p className="tweet__text">{ text }</p>
            <p className="tweet__author">{ author }</p>
          </div>
        </div>

        <video src={ videoSource } key={ videoSource } className="fullscreen-video" autoPlay loop muted />
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
          <p className="donate fade-appear">
            Make you feel bad{"?"} You{"'"}re probably a good person. <a href="https://action.aclu.org/secure/donate-to-aclu" target="_blank">Donate to the ACLU here.</a>
          </p>
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
          <div className="col-xs-6">
            <p className="title">
              Yuge <br/>
              Regrets
            </p>
          </div>
          <div className="col-xs-6">
            <p className="title-author">
              by <br/>
              REMORSEFUL TRUMP VOTERS
            </p>
          </div>
        </div>
      </div>
    )
  }
}

class Main extends Component {
  componentDidMount () {
    Promise.all([
      getTweets(),
      speakIntro()
    ])
      .then(([ tweets ]) => tweets.reduce((prom, tweet, index) => prom.then(() => {
        this.setState({ tweet, index })
        return Promise.all([
          speak(tweet.full_text),
          delay(11000) // scroll transition minus fade transition
        ])
      }), Promise.resolve()))
      .then(() => alert('done!'))
  }

  render () {
    const { tweet, index } = this.state
    return (
      <CSSTransitionGroup transitionName="fade">
        { tweet ? (
          <TweetContainer showACLUMessage={ index > 2 } key="tweets">
            <CSSTransitionGroup transitionName="fade">
              <Tweet text={ tweet.full_text } author={ `-${tweet.retweeted_status.user.screen_name}` } key={ index } />
            </CSSTransitionGroup>
          </TweetContainer>
        ) : (
          <Intro key="intro" />
        ) }
      </CSSTransitionGroup>
    )
  }
}

window.responsiveVoice.addEventListener('OnReady', () => {
  render(<Main />, document.getElementById('app'))
})
