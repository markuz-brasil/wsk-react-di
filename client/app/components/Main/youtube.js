import {annotate, Injector, Inject, Provide} from 'di';
// import {assert} from 'rtts-assert'

import {http, BaseState, assert} from '../Core'

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

function mockjsonp (url) {
  return new Promise(function(res, rej){
    setTimeout(function(){
      res('mockjsonp-'+ url +'-'+ Math.random())
    }, 0)
  })
}

// change to fn
export class FetchYouTubeData {
  constructor(state) {
    return mockjsonp(state.url)
  }
}
annotate(FetchYouTubeData, new Inject(youTubeState))

// change to fn
export class YouTubeCardState extends BaseState {
  constructor(body, title, promise) {
    return super({ body: body, title: title, promise: promise })
  }
}
annotate(YouTubeCardState, new Provide(CardState))
annotate(YouTubeCardState, new Inject(YouTubeBody, YouTubeTitle, FetchYouTubeData))


export function youTubeState () {
  return {
    url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&max-results=50&alt=json-in-script&format=5&callback=",
    id: 'youtube-'+ Math.random(),
  }
}


export function youTubeInitState (Card = {}) {
  return {
    url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&max-results=50&alt=json-in-script&format=5&callback=",
    Elem: Card ,
    id: 'youtube-'+ Math.random(),
  }
}
annotate(youTubeInitState, new Inject(CardCtrl))

assert.define(musicCategory)
function musicCategory (value) {
  var isValid
  value.forEach((d) => {
    if (d.label && d.label.toLowerCase() === 'music') {
      isValid = true
    }
  })
  return isValid
}

function youTubeType () {}
var token = assert.define(youTubeType, (value) => {
  return assert(value).isStructure({
    app$control : undefined,
    category: musicCategory,
  })
})

function handleYouTubeJsonp (json) {
  var sections = [
    'category', 'author', 'content', 'id', 'name', 'link',
    'yt$rating', 'title', 'published', 'updated'
  ]

  return json.feed.entry.filter((obj) => {
      // filtering restrited (Copyrighted) content out
      return assert(obj).is(youTubeType)
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
    // console.log('begin fetching yt')
    var data = handleYouTubeJsonp(yield http.jsonp(youTubeInitState().url))
  }
  catch (err) {return console.error(err)}

  // return data
  console.log('jsonp', data.length, data)
})

