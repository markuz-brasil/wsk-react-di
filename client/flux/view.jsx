"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'

var {
  annotate,
  Inject,
  Provide,
  TransientScope
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  ReactStyle,
  ReactView
}

// function * ReactStyle () {
//   return yield renderStyle `
//     background: linear-gradient(to bottom, lighten(#55f5ab, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
//   `
// }

function randColor () {
  return (Math.random() * (255 - 0))|0 + 0
}

function randPer () {
  return (Math.random() * (10 - 0))|0 + 0

}

var _store = {}

function ReactStyle () {
  return function * ReactStyleRand () {
    var x0 = randPer()
    var style = `
      color: rgb(${randColor()}, ${randColor()}, ${randColor()});
      background: linear-gradient(
        to bottom,
        lighten(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) 0%,
        darken(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) ${x0}%,
        darken(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) ${x0+1}%,
        lighten(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) 100%
      );
    `
    _store.style = yield renderStyle(style)
  }
}

annotate(ReactView, new Inject(ReactStyle))
function * ReactView (style) {
  yield style
  return function () {
    c0(style)()
    return <div style={ _store.style }> { this.state.msg() } </div>
  }
}

// creating a thunk around less.render to use with c0
var _lessCfg = {compress: true}
var _div = document.createElement('div')
var _id = `tmp-id-${Math.random().toString().split('.')[1]}`
var _regex = new RegExp(`(^#${_id}{|}$)`)

function renderStyle (str = 'display: none;', opts = _lessCfg) {
  // this is equivalent of returning a promise. but better performace
  return function (next) {
    less.render(`#${_id}{ ${str} }`, opts, (err, value) => {
      // fix string
      value = value.replace(_regex, '')
      _div.style.cssText = value
      var style = {}

      for (let item of _div.style) {
        if (style[item] !== '') {
          style[item] = _div.style[item]
        }
      }
      next(err, style)
    })
  }
}
