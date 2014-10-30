"use strict"

import { c0, di } from 'libs'

import {
  ReactStyle,
  ReactStyleAsync,
  ReactView
} from './view'

import {
  ReactStore,
  ReactState,
  ReactStateAsync
} from './state'

var {
  annotate,
  Inject,
  Injector,
  TransientScope
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  createReactCtrl,
  ReactContext,

  ReactStore,
  ReactState,
  ReactStateAsync,
  ReactNext,

  ReactStyle,
  ReactStyleAsync,
  ReactView
}

var _injector
function createReactCtrl (injector) {
  _injector = injector || new Injector([ReactState])
  // _injector = injector || new Injector([ReactStateAsync])

  return function * ReactCtrl () {
    return yield _injector.get(ReactContext)
  }
}

// TODO: combine ReactStore, ReactState, into one big ReactStore
annotate(ReactContext, new Inject(ReactView, ReactStore, ReactState, ReactNext))
function * ReactContext (view, store, state, next) {
  // pre-rendering the view (less into css)
  // pre generating initial state
  var render = yield view
  var initState = yield state

  return Object.assign({render}, {
    getInitialState () {
      // wiring the context back to the store
      store.context = this
      store.state = initState
      setImmediate(() => {
        store.setState = store.context.setState.bind(this)
        next()
        // c0(next)()
      })
      return initState
    },
  })
}

annotate(ReactNext, new TransientScope)
annotate(ReactNext, new Inject(ReactStore, ReactState))
function ReactNext (store, state) {
  return c0(function * () {
    store.pagePaints++
    if (store.pagePaints > 1000) return

    store.setState(yield state)
    // On sync mode it may blow the stack
    // or it is too fast and the browser drops most of the frames
    var next = _injector.get(ReactNext)
    if (store.pagePaints % 9 !== 0) return next()
    setImmediate(next)
  })
}

