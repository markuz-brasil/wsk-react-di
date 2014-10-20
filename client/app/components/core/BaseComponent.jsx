"use strict"

import { React, di } from 'libs'
var {annotate, Inject, InjectLazy, Injector } = di

export function createReactClass (args, deps = []) {
  return new Injector(deps).get(ReactClass)(...args)
}

export function ReactSyncState () {
  var t0 = new Date
  return function  reactSyncState() {
    return { ctx: `lazy injected ReactSyncState (${new Date - t0}ms)`,}
  }
}

export function ReactAsyncState (lazyGetAsyncData) {
  var t0 = new Date
  return function reactAsyncState (self) {
    return Promise.resolve({
      ctx: `lazy injected ReactAsyncState (${new Date - t0}ms)`
    })
  }
}

export function ReactElem () {
  var t0 = new Date
  return function reactElem (self) {
    console.log(`... ReactElem :: ${self.state.ctx} :: (${new Date - t0}ms) ...`)
    return <div> {} </div>
  }
}

annotate(ReactClass, new InjectLazy(ReactContext))
function ReactClass (lazyCtx) {
  return React.createClass(lazyCtx())
}

annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
function ReactContext (lazyElem, lazyState) {
  return {
    render () { return lazyElem()(this) },
    getInitialState () { return lazyState()(this) }
  }
}

annotate(ReactState, new InjectLazy(ReactSyncState, ReactAsyncState))
function ReactState (lazySyncState, lazyAsyncState) {
  return function reactState (self) {
    lazyAsyncState()(self).then(self.setState.bind(self))
    return lazySyncState()(self)
  }
}


