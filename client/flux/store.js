"use strict"

import { di } from 'libs'
import * as flux from './annotations'

var {
  annotate,
  Inject,
  Provide,
  TransientScope
} = di

var _store = {
  state: null,
  context: null,
  paintCount: 1,

  setState (state = _store.state) {
    _store.context.setState(state)
    return state
  },

}

annotate(Store, new Provide(flux.Store))
export function Store () { return _store }

annotate(InitStore, new Provide(flux.InitStore))
annotate(InitStore, new Inject(flux.Store))
export function InitStore (store) {
  var iterator = InitStore()

  function * InitStore () {
    // simulating async op
    // see co's API for help
    yield (next) => setTimeout(next, Math.random()*10|0)
    store.state = store.state || {}
    store.state.msg = 'store-data-' + store.paintCount
    iterator.state = store.state

    return {
      getInitialState () {
        store.context = this
        return store.state
      },
    }
  }

  return iterator
}

