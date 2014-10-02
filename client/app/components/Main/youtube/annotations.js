import {annotate, Injector, Inject, Provide} from 'di';

import {http, BaseState, assert} from '../../Core'
import {CardCtrl} from '../../Card'
import {Body, Title, CardState} from '../../Card/annotations'

var co = require('co')

class YouTubeBody {
  toString () {
    return 'body2: '+ Math.random()
  }
}
annotate(YouTubeBody, new Provide(Body))

class YouTubeTitle {
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


export class AppState extends BaseState {
  constructor (ctx) { return super(ctx) }
}
annotate(AppState, new Inject(youTubeInitState))


// change to fn
class FetchYouTubeData {
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


function youTubeState () {
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


