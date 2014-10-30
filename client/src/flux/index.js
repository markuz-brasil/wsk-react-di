"use strict"

import { React } from 'runtime'
import { c0, di } from 'libs'

import {
  ReactStyle,
  ReactStyleAsync,
  ReactView
} from './view'

import {
  ReactStore,
  ReactState,
  ReactStateAsync,
  ReactNextState
} from './state'

var {
  annotate,
  Inject,
  Injector,
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  createReactCtrl,
  ReactContext,

  ReactStore,
  ReactState,
  ReactStateAsync,
  ReactNextState,

  ReactStyle,
  ReactStyleAsync,
  ReactView
}

function createReactCtrl (injector) {
  injector = injector || new Injector([ReactState])
  // injector = injector || new Injector([ReactStateAsync])
  ReactStore().injector = injector

  return function * ReactCtrl () {
    return React.createClass(yield injector.get(ReactContext))
  }
}

// TODO: combine ReactStore, ReactState, ReactNextState into one big ReactState
annotate(ReactContext, new Inject(ReactView, ReactStore, ReactState, ReactNextState))
function * ReactContext (view, store, state, next) {
  var initState = yield state
  var render = yield view

  return {
    render () { return render.call(this) },
    getInitialState () {
      store.context = this
      store.state = initState
      setImmediate(() => {
        store.setState = store.context.setState.bind(this)
        c0(next)()
      })
      return initState
    },
  }
}
