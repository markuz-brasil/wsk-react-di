"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

var _store = {
  state: null,
  context: null,
  paintCount: 1,
}

annotate($store, new Provide(flux.$store))
export function $store () { return _store }

annotate(Init$store, new Provide(flux.Init$store))
annotate(Init$store, new Inject(flux.$store))
export function Init$store ($store) {
  var iterator = Init$store()
  function * Init$store () {
    // simulating async op
    // see co's API for help
    // yield (next) => setTimeout(next, Math.random()*10|0)
    $store.state = $store.state || {}
    $store.state.msg = 'store-data-' + $store.paintCount

    return {
      $store: $store,
      getInitialState () {
        $store.context = this
        return $store.state
      },
    }
  }

  return iterator
}
