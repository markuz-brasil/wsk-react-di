"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

annotate(Context, new Provide(flux.Context))
annotate(Context, new Inject(flux.State, flux.View))
export function Context (state, view) {
  var iterator = Context()
  function * Context () {

    // Enhanced yield statements handling via co's API.
    // `Startup` is wrapped within a co's thunk,
    // so it manages all the yield'ed statements.

    return Object.assign.apply(null, yield [
      {}, state, view,
    ])
  }

  return iterator
}

//
// TODO: better error handling.
annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject(flux.$dispatcher, flux.Actions, flux.RePaint))
var _nextTickCounter = 0
export function NextTick ($dispatcher, actions, paint) {
  var _ticks = 0
  // nothing is catching the error here.

  return function * _NextTick () {

    try { paint(yield actions).next() }
    catch (err) { console.error(err) }

    if (++_nextTickCounter > 1000) return

    var nextTick = c0($dispatcher.get(flux.NextTick))

    var FPS = -70 //negative => setImmediate
    var delay = (1000/FPS)|0 // => 14 millisec @ 70 FPS

    try {
      if (++_ticks > 10) {
        // stop tail recursion after 10 laps
        if (delay <= 0) { return setImmediate(nextTick) }
        if (delay > 0) { return setTimeout(nextTick, delay) }
      }

      if (delay <= 0) yield (next) => setImmediate(next)
      if (delay > 0) yield (next) => setTimeout(next, delay)
    }
    catch (err) { console.error(err) }

    // start a new loop
    return yield $dispatcher.get(flux.NextTick)
  }
}

// annotate(RePaint, new TransientScope)
annotate(RePaint, new Provide(flux.RePaint))
annotate(RePaint, new Inject(flux.$store))
export function RePaint ($store) {
  return function * _RePaint (act) {

    $store.state.msg = `store-data-${$store.view.counter} :: ${act[0]}`
    $store.state.style = { background: '#45ba76' }
    $store.setState()
  }
}

//
// annotate(Actions, new TransientScope)
annotate(Actions, new Provide(flux.Actions))
export function Actions (...actions) {
  return function * Actions () {
    return yield actions // parallel resolution here. co's API
  }
}

Actions.add = function add (...deps) {
  for (let dep of deps) {
    annotate(Actions, new Inject(dep))
  }
}

Actions.add(Log)
export function Log () {
  var t0 = new Date
  //
  // look, no generator and still an action.
  // nodejs express middleware style.
  // co's API gives you express like middleware for free.
  //
  return function _Log (next) {
    var msg = `log: ${Math.random() * 1000|0}`
    console.log(msg)
    next(null, msg)
  }
}

Actions.add(AsyncOps)
function AsyncOps () {
  return function * _AsyncOps () {

    // long term async
    console.log('async ops ...')
    yield function _asyncOps (next) { setTimeout(next, Math.random()*1000|0) }
    console.log('async ops ... done')
    // yield (next) => setImmediate(next)
  }
}

Actions.add(SyncOps)
function SyncOps () {
  return function * _SyncOps () {
    console.log('blocking 10000 ops ...')

    var _c = 10000
    while (_c > 0) {_c--}
    console.log('blocking ops ... done')
  }
}

