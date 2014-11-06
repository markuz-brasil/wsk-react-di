"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

export {NextTick, RePaint} from './render-action-loop'

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
  // co's API gives you express-like middleware for free.
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

    // shot-term async
    console.log('async ops ...')
    yield (next) => setTimeout(next, Math.random()*10|0)
    console.log('async ops ... done')
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

