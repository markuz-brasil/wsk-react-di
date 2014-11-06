"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

//
// TODO: better error handling.
annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject(flux.$dispatcher, flux.Actions, flux.RePaint))
var _nextTickCounter = 0
export function NextTick ($dispatcher, actions, paint) {
  var _act = {}
  var FPS = 60 //negative => setImmediate
  var _delay = (1000/FPS)// => 16.6 millisec @ 60 FPS
  var _laps = 0
  var _t0 = new Date().getTime()

  return function * _NextTick () {
    // halting
    if (++_nextTickCounter > 1000) return

    _t0 = new Date().getTime()

    try { paint(_act).next() }
    catch (err) { console.error(err) }

    _act = yield actions

    var delta = new Date().getTime() - _t0
    var delay = _delay - delta
    var nextTick = c0($dispatcher.get(flux.NextTick))

    try {
      if (++_laps > 10) {
        _laps = 0
        // stop tail recursion after 10 laps.
        // letting the iterators unwind
        if (delay < 1) { return setImmediate(nextTick) }
        if (delay >= 1) { return setTimeout(nextTick, delay|0) }
      }

      if (delay < 1) yield (next) => setImmediate(next)
      if (delay >= 1) yield (next) => setTimeout(next, delay|0)
    }
    catch (err) { console.error('wat:', err) }

    console.log('... new render-action-loop ...')
    // start a new injection loop
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
