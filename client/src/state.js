"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

annotate(State, new Provide(flux.State))
annotate(State, new Inject(flux.$Store))
export function State ($store) {
  var iterator = State()

  function * State () {
    Object.assign($store.state, {counter:0})

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
