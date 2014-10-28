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

export function createReactCtrl (injector) {
  return React.createClass(injector.get(ReactContext))
}

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
export function ReactContext (store, lazyElem, lazyState) {
  return {
    render () { return lazyElem() },

    getInitialState () {
      if (typeof store === 'object' && store !== null) {
        store.context = this
        store.setState = function setState (...args) {
          if (store.pending === 0) {
            store.context.setState(...args)
          }
        }
      }
      return lazyState()
    }
  }
}

var _store = {
  pending: 0, paintCount: 0
}
export function ReactStore () { return _store }

var _initState = {
  t0: new Date,
  msg: '',
  style: { background: '#989898' },
  div: () => <div key='body'> {`sync lazy injected`} </div>,
}

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
export function ReactState (store) {
  var t0 = new Date
  store.pending += 1
  setTimeout(() => {
    // simulating a long state resolution (like ajax calls an stuff)
    var state = store.context.state = store.context.state || {}
    state.msg = () => `async lazy injected ${new Date - state.t0}`
    state.div = () => <div key='body'> {state.msg()} </div>
    store.pending -= 1
    store.setState(state)

  }, 1000)

  return _initState
}

annotate(ReactStyle, new TransientScope)
annotate(ReactStyle, new Inject(ReactStore))
export function ReactStyle (store) {

  if (store.paintCount === 0) {
    store.pending += 1
    store.paintCount += 1
    setTimeout(() => {
      // simulating a long css state resolution (long lesscss compilation)

      var state = store.context.state
      state.style = { background: '#cbcbcb' }
      state.paintCount += 1
      store.pending -= 1
      store.setState(state)

    }, 1500)
  }
  return store.context.state.style
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
annotate(ReactElem, new InjectLazy(ReactStyle))
export function ReactElem (store, lazyStyle) {
  var msg = `... ${store.context.state.msg} (${new Date - store.context.state.t0}ms) ...`

  return <div style={lazyStyle()}>
      {store.context.state.div()}
    </div>
}

