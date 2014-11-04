"use strict"

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'

var { annotate, Inject, Injector, Provide, TransientScope } = di

import { View } from './view'
import { $store, State } from './store'

import {
  Context,
  NextTick,
  RePaint,
  Actions
} from './actions'

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
    $store,              // services
  ])

  var iterator = _Startup()
  function * _Startup () {

    //
    // add anything else into the components ctx.
    // (but not render and getInitialState, or maybe you can :)
    // is defined by the flux.Context
    //

    // extending and shallow cloning ctx
    var ctx = yield _dispatcher.get(flux.Context)
    ctx = Object.assign({}, ctx, {
      componentWillMount(){},
      componentDidMount(){},
    })

    // React init
    var App = React.createClass(ctx)
    React.initializeTouchEvents(true)
    React.renderComponent(<App />, document.body);

    // entering event loop
    return yield _dispatcher.get(flux.NextTick)
  }

  return iterator
}
