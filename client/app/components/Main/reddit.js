import {annotate, Injector, Inject, Provide} from 'di';
import {http, BaseState} from '../Core'
import {CardCtrl} from '../Card'
import {Body, Title, CardState} from '../Card/state'

var co = require('co')

export class RedditBody {
  toString () {
    return 'body2: '+ Math.random()
  }
}
annotate(RedditBody, new Provide(Body))

export class RedditTitle {
  toString () {
    return 'title2: '+ Math.random()
  }
}
annotate(RedditTitle, new Provide(Title))

export class RedditCardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}
annotate(RedditCardState, new Provide(CardState))
annotate(RedditCardState, new Inject(RedditBody, RedditTitle))

export function redditInitState (Card = {}) {
  return {
    url: "http://www.reddit.com/r/pics/.json?jsonp=",
    // url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=meme&callback=",
    Elem: Card ,
  }
}
annotate(redditInitState, new Inject(CardCtrl))

function handleRedditJsonp (json) {
  var sections = [
    'domain', 'author', 'created_utc', 'id', 'name',
    'permalink', 'score', 'subreddit', 'subreddit_id',
    'thumbnail', 'title', 'url'
  ]

  return json.data.children.map((obj) => {
    var ctx = {}
    sections.map((section) => {
      ctx[section] = obj.data[section]
    })
    return ctx
  })
}

var fetchCounter = 0
export var fetchReddit = co(function* () {
  try {
    var data = handleRedditJsonp(yield http.jsonp(redditInitState().url))
    console.log('trigger action with this data now:', data, data[4], fetchCounter++)
  }
  catch (err) {throw console.error(err)}
})

