"use strict"

import { React, less } from 'runtime'
import { di } from 'libs'

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

function * ReactStyle () {
  return yield renderStyle `
    background: linear-gradient(to bottom, lighten(#55f5ab, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
  `
}

annotate(ReactView, new TransientScope)
annotate(ReactView, new Inject(ReactStyle))
function * ReactView (style) {
  var css = yield style
  return function () {
    return <div style={ css }> { this.state.msg() } </div>
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
