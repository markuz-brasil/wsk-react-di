"use strict"

import { React } from 'runtime'
import { c0, di } from 'libs'

var {
  annotate,
  Inject,
  Provide,
  InjectLazy,
  Injector,
  TransientScope
} = di

// there is a bug on 6to5. It doesnt export generators
// so just defining all exports at the top
export {
  createReactCtrl,
  ReactContext,
  ReactStore,
  ReactState,
  ReactStateAsync,
  ReactNextState,
  ReactStyle,
  ReactElem
}

function createReactCtrl (injector) {
  injector = injector || new Injector([])
  // injector = injector || new Injector([ReactStateAsync])
  _store.injector = injector

  return function * ReactCtrl () {
    var RootElem = React.createClass(yield injector.get(ReactContext))
    return <RootElem />
  }
}

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
function * ReactContext (store, lazyElem, lazyState) {
  var state = yield lazyState()

  return {
      render () { return lazyElem() },

      getInitialState () {
        store.context = this
        store.state = state
        setImmediate(()=>{
          store.injector.get(ReactNextState)
        })

        return state
      }
    }
}

var _store = {
  pagePaints: 0,
  state: {}
}
function ReactStore () { return _store }

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
annotate(ReactState, new InjectLazy(ReactStyle))
function * ReactState (store, lazyStyle) {
  store.t0 = store.t0 || new Date
  return Object.assign(store.state, {
    style: lazyStyle,
    msg: () => `... sync lazy injected ${store.pagePaints} times
      (${( store.pagePaints*1000/(new Date - store.t0))|0} FPS) ...`,
  })
}

annotate(ReactStateAsync, new Provide(ReactState))
annotate(ReactStateAsync, new TransientScope)
annotate(ReactStateAsync, new Inject(ReactStore))
annotate(ReactStateAsync, new InjectLazy(ReactStyle))
function * ReactStateAsync (store, lazyStyle) {
  return yield new Promise((res, rej)=>{
    store.t0 = store.t0 || new Date
    setTimeout(()=>{
      res(Object.assign(store.state, {
        style: lazyStyle,
        msg: () => `... async lazy injected ${store.pagePaints} times
          (${( store.pagePaints*1000/(new Date - store.t0))|0} FPS) ...`,
      }))
    }, 0)
  })
}

annotate(ReactNextState, new TransientScope)
annotate(ReactNextState, new Inject(ReactStore))
function ReactNextState (store) {
  store.pagePaints++
  if (store.pagePaints <= 1000) {
    c0(store.injector.get(ReactState))((state) => {
      store.context.setState(state)
      if (store.pagePaints % 10 === 0) {
        // On sync mode it may blow the stack
        // or it is too fast and the browser drops most of the frames
        return setImmediate(()=>{
          store.injector.get(ReactNextState)
        })
      }
      store.injector.get(ReactNextState)
    })
  }
}

function ReactStyle () {
  return { background: '#cbcbcb'}
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
function ReactElem (store) {
  return <div style={ store.state.style() }> { store.state.msg() } </div>
}
