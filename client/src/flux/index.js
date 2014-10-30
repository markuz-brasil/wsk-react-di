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
  ReactNextState,

  ReactStyle,
  ReactStyleAsync,
  ReactView
}

var _injector
function createReactCtrl (injector) {
  _injector = injector || new Injector([ReactState])
  // _injector = injector || new Injector([ReactStateAsync])

  return function * ReactCtrl () {
    return React.createClass(yield _injector.get(ReactContext))
  }
}

// TODO: combine ReactStore, ReactState, into one big ReactStore
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

annotate(ReactNextState, new TransientScope)
annotate(ReactNextState, new Inject(ReactStore))
function * ReactNextState (store) {
  store.pagePaints++
  if (store.pagePaints > 1000) return

  store.setState(yield _injector.get(ReactState))

  // On sync mode it may blow the stack
  // or it is too fast and the browser drops most of the frames
  var next = c0(_injector.get(ReactNextState))
  if (store.pagePaints % 9 !== 0) return next()
  setImmediate(next)
}

