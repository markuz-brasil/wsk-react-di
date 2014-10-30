"use strict"

import { React } from 'runtime'
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
  ReactStyleAsync,
  ReactView
}

function * ReactStyle () {
  return { background: '#cbcbcb'}
}

annotate(ReactStyleAsync, new Provide(ReactStyle))
function * ReactStyleAsync () {
  // 0.1 sec long async op
  // take a look at co's API
  yield (next) => setTimeout(next, 100)
  return { background: '#cbbdbe'}
}

annotate(ReactView, new TransientScope)
annotate(ReactView, new Inject(ReactStyle))
function * ReactView (style) {
  var css = yield style
  return function () {
    return <div style={ css }> { this.state.msg() } </div>
  }
}

