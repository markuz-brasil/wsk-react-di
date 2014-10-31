"use strict"

import { c0, di } from 'libs'
import * as flux from './annotations'

import { View, InitView } from './view'
import { Store, InitStore } from './store'
import { NextTick, RePaint, ActionPipeline } from './actions'
export { Dispatcher } from './dispatcher'

var { annotate, Inject, Provide } = di

export { flux }

export var AppDeps = [
  Context, InitState,
  View, InitView,
  Store, InitStore,
  NextTick, RePaint, ActionPipeline
]
// Action which genetarates the CtrlView context
annotate(Context, new Provide(flux.Context))
annotate(Context, new Inject(flux.InitState, flux.NextTick))
function Context (init, nextTick) {
  var iterator = Context()
  function * Context () {
    var ctx = yield init
    nextTick.async()
    return ctx
  }
  return iterator
}

annotate(InitState, new Provide(flux.InitState))
annotate(InitState, new Inject(flux.InitStore, flux.InitView))
function InitState (store, view) {
  var iterator = InitState()
  function * InitState () {
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
