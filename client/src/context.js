"use strict"

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'

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
