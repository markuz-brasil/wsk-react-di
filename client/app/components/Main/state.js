import {annotate, Injector, Inject, Provide} from 'di';
import {http, BaseState} from '../Core'
import {CardCtrl} from '../Card'
import {Body, Title, CardState} from '../Card/state'

var co = require('co')

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

var url = initState().url
co(function* () {
  try {
    var data = handleRedditJsonp(yield http.jsonp(url))
    console.log('trigger action with this data now:', data, data[4])
  }
  catch (err) {throw console.error(err)}
})()

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

export function initState (Card = {}) {
  return {
    url: "http://www.reddit.com/r/pics/.json?jsonp=",
    Elem: Card ,
  }
}
annotate(initState, new Inject(CardCtrl))

export class AppState extends BaseState {
  constructor (ctx) { return super(ctx) }
}
annotate(AppState, new Inject(initState))



