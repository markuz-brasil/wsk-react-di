
import {http, assert} from '../../Core'

var co = require('co')

import {youTubeInitState} from './annotations'

var youtubeType = {
  category: [{term: "Music"}, {term: "Comedy"}],
  app$control: [void 0, null],
}

// app$control: void 0, // filtering restrited (Copyrighted) content out
// category: [{term: ""}], // term can be any string :)
// category: [{term: "Music"}],

function handleJsonp (json) {
  var sections = [
    'category', 'author', 'content', 'id', 'name', 'link',
    'yt$rating', 'title', 'published', 'updated'
  ]

  return json.feed.entry.filter(assert(youtubeType).is)
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
    var data = handleJsonp(yield http.jsonp(youTubeInitState().url))
  }
  catch (err) {return console.error(err)}

  // return data
  console.log('jsonp', data.length, data)
})

