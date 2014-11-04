"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

// using a Map is also great for a $store

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

annotate($store, new Provide(flux.$store))
export function $store () { return Object.assign({}, _store) }

annotate(State, new Provide(flux.State))
annotate(State, new Inject(flux.$store))
export function State ($store) {
  var iterator = State()

  function * State () {
    Object.assign($store.state, _store, {counter:0})
    if ($store.state.counter !== 0) return $store.state

    return {
      getInitialState () {
        $store.state.counter++
        $store.context = this
        return $store.state
      },
    }
  }

  return iterator
}
