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

var _lessCfg = {compress: true}
var _div = document.createElement('div')
function renderStyle (str = '', opts = _lessCfg) {
  var id = `tmp-id-${Math.random().toString().split('.')[1]}`
  var regex = new RegExp(`(^#${id}{|}$)`)

  return function (next) {
    less.render(`#${id}{ ${str} }`, opts, (err, value) => {
      // fix string
      value = value.replace(regex, '')
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

function * ReactStyle () {
  return yield renderStyle`
    background: linear-gradient(to bottom, lighten(#00f500, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
    border-radius: 0px;
    margin-bottom: 0px;
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

annotate(ReactStyleSync, new Provide(ReactStyle))
function * ReactStyleSync () {
  // 0.1 sec long async op
  // take a look at co's API for help
  return { background: '#cbbdbe'}
}
