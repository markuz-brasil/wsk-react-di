
import {http, assert} from '../../Core'

var co = require('co')

import {youTubeInitState} from './annotations'
import {ytType, musicCategoryType} from './types'

function handleJsonp (json) {
  var sections = [
    'category', 'author', 'content', 'id', 'name', 'link',
    'yt$rating', 'title', 'published', 'updated'
  ]

  return json.feed.entry.filter((obj) => {
      // filtering restrited (Copyrighted) content out
      return assert(obj).is(ytType)
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
    var data = handleJsonp(yield http.jsonp(youTubeInitState().url))
  }
  catch (err) {return console.error(err)}

  // return data
  console.log('jsonp', data.length, data)
})

