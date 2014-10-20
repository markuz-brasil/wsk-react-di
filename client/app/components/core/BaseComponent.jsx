"use strict"

import { React, di } from 'libs'
var {annotate, Inject, InjectLazy, Injector, TransientScope } = di

export function createReactCtrl (args, deps = []) {
  return new Injector(deps).get(ReactClass)(...args)
}

annotate(ReactClass, new InjectLazy(ReactContext))
export function ReactClass (lazyCtx) {
  return React.createClass(lazyCtx())
}

var store = {}
export function ReactStore () { return store }

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
export function ReactContext (store, lazyElem, lazyState) {
  return {
    render () { return lazyElem() },
    getInitialState () {
      if (typeof store === 'object' && store !== null) {
        store.self = this
        store.setState = this.setState.bind(this)
      }
      return lazyState()
    }
  }
}

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
export function ReactState (store) {
  var t0 = new Date
  setTimeout(() => {
    store.setState({
      ctx: `lazy injected ReactAsyncState (${new Date - t0}ms)`
    })
  }, 0)

  return { ctx: `lazy injected ReactSyncState (${new Date - t0}ms)`,}
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
export function ReactElem (store) {
  var t0 = new Date
  console.log(`... ReactElem :: ${store.self.state.ctx} :: (${new Date - t0}ms) ...`)
  return <div> {} </div>
}



