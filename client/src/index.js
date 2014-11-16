"use strict"

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'

var { annotate, Inject, Injector, Provide, TransientScope } = di

import { View } from './view'
import { State } from './state'
import { Context } from './context'
import { NextTick, RePaint, Actions } from './actions'

// placeholder for now
function $Http () {}

export function _document () { return document }
export function _window () { return window }

var _store = {
  _global: {},
  state: {},
  view: {},
  context: null,
  setState (ctx) {
    ctx = ctx || this.state
    this.context.setState(ctx)
  },
}

annotate($Store, new Provide(flux.$Store))
export function $Store () { return Object.assign({}, _store) }

export var App = [Startup]
annotate(Startup, new Provide(flux.Startup))
annotate(Startup, new Inject(_document))
function Startup ($doc) {
  // TODO: explain whats the deal with $dispatcher

  annotate($dispatcher, new Provide(flux.$dispatcher))
  function $dispatcher () { return $dispatcher }
  var $dispatcher = new Injector([
    NextTick, Actions, RePaint, // paint-actions-loop actions
    View, State,                // init actions
    $dispatcher,                // current d.i. injector wrap
    $Store, $Http,              // services
    Startup, Context,           // boot actions
  ])

  var iterator = _Startup()
  function * _Startup () {

    // extending and shallow cloning ctx
    var ctx = Object.assign({}, yield $dispatcher.get(flux.Context), {
      componentWillMount(){},
      componentDidMount(){},
    })

    // first render
    React.initializeTouchEvents(true)
    React.renderComponent(React.createClass(ctx)(null), $doc.body);

    // entering action-render-loop
    yield (next) => setImmediate(next)
    return yield $dispatcher.get(flux.NextTick)
  }

  return iterator
}
