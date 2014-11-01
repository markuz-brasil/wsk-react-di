"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Provide } = di

annotate($view, new Provide(flux.$view))
export function $view () { return _view }

var _style = { display: 'none' }
var _view = {}

annotate(Init$view, new Provide(flux.Init$view))
annotate(Init$view, new Inject(flux.$view))
export function Init$view (view) {
  var iterator = Init$view()

  function * Init$view () {
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
