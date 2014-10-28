"use strict"

import { React } from 'runtime'
import { co, di } from 'libs'

var {
  annotate,
  Inject,
  InjectLazy,
  Injector,
  TransientScope
} = di

export function init () {
  var injector = _store.injector = new Injector([])
  var RootElem = React.createClass(injector.get(ReactContext))
  return <RootElem />
}

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
export function ReactContext (store, lazyElem, lazyState) {
  return {
    render () { return lazyElem() },

    getInitialState () {
      store.context = this
      store.state = {}
      return lazyState()
    }
  }
}

var _store = {pagePaints: 0}
export function ReactStore () { return _store }

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
annotate(ReactState, new InjectLazy(ReactStyle))
export function ReactState (store, lazyStyle) {
  store.t0 = store.t0 || new Date
  store.injector.get(ReactNextState)
  return Object.assign(store.state, {
    style: lazyStyle,
    msg: () => `... sync lazy injected ${store.pagePaints} times
      (${((new Date - store.t0)*1000/store.pagePaints)|0} Hz) ...`,
  })
}

annotate(ReactNextState, new TransientScope)
annotate(ReactNextState, new Inject(ReactStore))
function ReactNextState (store) {
  setImmediate(() => {
    if (store.pagePaints < 100) {
      store.context.setState(store.injector.get(ReactState))
    }
  })
}

export function ReactStyle () {
  return { background: '#cbcbcb'}
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
export function ReactElem (store) {
  store.pagePaints++
  return <div style={ store.state.style() }> { store.state.msg() } </div>
}

/*
function ReactNextState (store) {
  setTimeout(() => {
    if (store.pagePaints < 20) {
      store.context.setState(store.injector.get(ReactState))
    }
  }, 100)
}
*/

