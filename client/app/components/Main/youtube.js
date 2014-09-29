import {annotate, Injector, Inject, Provide} from 'di';
// import {assert} from 'rtts-assert'

import {http, BaseState, assert} from '../Core'
import {string, number, bool, undef} from '../Core/types'

import {CardCtrl} from '../Card'
import {Body, Title, CardState} from '../Card/state'

var co = require('co')

export class YouTubeBody {
  toString () {
    return 'body2: '+ Math.random()
  }
}
annotate(YouTubeBody, new Provide(Body))

export class YouTubeTitle {
  toString () {
    return 'title2: '+ Math.random()
  }
}
annotate(YouTubeTitle, new Provide(Title))

export class YouTubeCardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}
annotate(YouTubeCardState, new Provide(CardState))
annotate(YouTubeCardState, new Inject(YouTubeBody, YouTubeTitle))

export function youTubeInitState (Card = {}) {
  return {
    url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&max-results=50&alt=json-in-script&format=5&callback=",
    Elem: Card ,
  }
}
annotate(youTubeInitState, new Inject(CardCtrl))

console.log('--', assert.isType('0', string))
console.log('--', assert.isType(10, number))
console.log('--', assert.isType(true, bool))
console.log('--', assert.isType(undefined, undef))


function youTubeType () {}
assert.define(youTubeType, (value) => {
  return !value.app$control
})

function handleYouTubeJsonp (json) {
  var sections = [
    'category', 'author', 'content', 'id', 'name', 'link',
    'yt$rating', 'title', 'published', 'updated'
  ]

  return json.feed.entry.filter((obj) => {
      // filtering restrited content out
      return assert.isType(obj, youTubeType)
    })
    .map((obj) => {
      var ctx = {}
      sections.forEach((section) => {
        ctx[section] = obj[section]
      })
      return ctx
    })

}

var fetchCounter = 0
export var fetchYouTubeJson = co(function* () {
  try {
    var data = handleYouTubeJsonp(yield http.jsonp(youTubeInitState().url))
  }
  catch (err) {return console.error(err)}

  // return data
  console.log('jsonp', data.length, data)
  // console.log('sample data', fetchCounter++, data[4])
})

