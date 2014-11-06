"use strict"

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'

var { annotate, Inject, Injector, Provide, TransientScope } = di

import { View } from './view'
import { State } from './state'
import { $store, Context } from './context'
import { NextTick, RePaint, Actions } from './actions'

function $http () {}

export var App = [Startup]
annotate(Startup, new Provide(flux.Startup))
function Startup () {
  // TODO: explain whats the deal with $dispatcher

  annotate($dispatcher, new Provide(flux.$dispatcher))
  function $dispatcher () { return _dispatcher }
  var _dispatcher = new Injector([
    NextTick, Actions, RePaint, // event loop actions
    $dispatcher,                // d.i. injector
    View, State,                // init actions
    Startup, Context,           // boot actions
    $store, $http               // services
  ])

  var iterator = _Startup()
  function * _Startup () {

    // extending and shallow cloning ctx
    var ctx = yield _dispatcher.get(flux.Context)
    ctx = Object.assign({}, ctx, {
      componentWillMount(){},
      componentDidMount(){},
    })

    // first render
    var App = React.createClass(ctx)
    React.initializeTouchEvents(true)
    React.renderComponent(<App />, document.body);

    // entering action-render-loop
    yield (next) => setImmediate(next)
    return yield _dispatcher.get(flux.NextTick)
  }

  return iterator
}
