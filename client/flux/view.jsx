"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'
import * as flux from './annotations'

var { annotate, Inject, Provide } = di

annotate(View, new Provide(flux.View))
export function View () { return _view }

var _style = { background: '#cb9a76' }
var _view = {}

annotate(InitView, new Provide(flux.InitView))
annotate(InitView, new Inject(flux.View))
export function InitView (view) {
  var iterator = InitView()

  function * InitView () {
    var t0 = new Date
    // simulating async op
    // see co's API for help
    yield (next) => setTimeout(next, Math.random()*10|0)
    view.style = _style
    iterator.style = _style

    return {
      render () {
        return <div style={ this.state.style }> { this.state.msg } </div>
      }
    }
  }

  return iterator
}
