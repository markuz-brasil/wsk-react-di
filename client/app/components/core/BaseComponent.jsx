"use strict"

import { React, di } from 'libs'
var {annotate, Inject, InjectLazy, Injector, TransientScope } = di

export function createReactClass (args, deps = []) {
  return new Injector(deps).get(ReactClass)(...args)
}

annotate(ReactClass, new InjectLazy(ReactContext))
export function ReactClass (lazyCtx) {
  return React.createClass(lazyCtx())
}

var store = {}
export function ReactStore () {
  return store
}

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
export function ReactContext (store, lazyElem, lazyState) {
  return {
    render () { return lazyElem() },
    getInitialState () {
      store.self = this
      store.setState = this.setState.bind(this)
      return lazyState() }
  }
}

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
annotate(ReactState, new InjectLazy(ReactSyncState, ReactAsyncState))
export function ReactState (store, lazySyncState, lazyAsyncState) {
  lazyAsyncState().then(store.setState)
  return lazySyncState()
}

export function ReactSyncState () {
  var t0 = new Date
  return { ctx: `lazy injected ReactSyncState (${new Date - t0}ms)`,}
}

export function ReactAsyncState () {
  var t0 = new Date
  return Promise.resolve({
    ctx: `lazy injected ReactAsyncState (${new Date - t0}ms)`
  })
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
export function ReactElem (store) {
  var t0 = new Date
  console.log(`... ReactElem :: ${store.self.state.ctx} :: (${new Date - t0}ms) ...`)
  return <div> {} </div>
}


