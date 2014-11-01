"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

annotate(Context, new Provide(flux.Context))
annotate(Context, new Inject(flux.FirstPaint, flux.NextTick))
export function Context (init, nextTick) {
  var iterator = Context()
  function * Context () {
    var ctx = yield init
    // init EventLoop
    nextTick.async()
    return ctx
  }
  return iterator
}

annotate(FirstPaint, new Provide(flux.FirstPaint))
annotate(FirstPaint, new Inject(flux.Init$store, flux.Init$view))
export function FirstPaint (store, view) {
  var iterator = FirstPaint()
  function * FirstPaint () {
    store.t0 = new Date

    var ctx = Object.assign.apply(null, yield [
      {},
      store,
      view,
    ])

    store.state.style = view.style
    store.t1 = new Date

    return ctx
  }
  return iterator
}

annotate(ActionCreator, new TransientScope)
annotate(ActionCreator, new Provide(flux.ActionCreator))
annotate(ActionCreator, new Inject(flux.NextTick))
export function ActionCreator (next, ...actions) {
  actions.push(next)
  return function * ActionCreator () {
    for (let action of actions) {
      // processing all actions in series
      yield action
    }
  }
}

//
// This is the last Action to run
//
// This is the place to break with the DI.
// Adding a circular dependency closes the EventLoop
// Botton line is that NextTick and ActionCreator implementations
// will always be bounded. And this is a feature.
//
var _ticks = 0
annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject(flux.Dispatcher))
export function NextTick (dispatcher) {
  var nextTick = c0(function * NextTick () {
    if (++_ticks >= 10) return // just breaking out the EventLoop
    yield dispatcher.get(ActionCreator)
  })

  nextTick.async = setImmediate.bind(null, nextTick)
  return nextTick
}

//
// This Action which call this.setState() in React
//
annotate(ActionCreator, new Inject(flux.RePaint))
annotate(RePaint, new TransientScope)
annotate(RePaint, new Provide(flux.RePaint))
annotate(RePaint, new Inject(flux.$store, flux.$view))
export function RePaint (store, view) {
  var iterator = RePaint()

  function * RePaint () {
    store.paintCount++
    // simulating async op
    // see co's API for help
    yield (next) => setTimeout(next, Math.random()*1000|0)

    store.state.msg = 'store-data-' + store.paintCount
    store.state.style = { background: '#45ba76' }

    return store.setState()

  }

  return iterator
}
