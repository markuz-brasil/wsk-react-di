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

export function createReactStyle (str) {
  return React.createClass({
    render () {
      return <div dangerouslySetInnerHTML={{__html: `<style> ${str} </style>` }} />
    },
  })
}

annotate(ReactContext, new Inject(ReactStore))
annotate(ReactContext, new InjectLazy(ReactElem, ReactState))
export function ReactContext (store, lazyElem, lazyState) {
  return {
    render () {return lazyElem() },

    getInitialState () {
      if (typeof store === 'object' && store !== null) {
        store.context = this
      }
      return lazyState()
    }
  }
}

annotate(ReactElem, new TransientScope)
annotate(ReactElem, new Inject(ReactStore))
export function ReactElem (store) {
  var t0 = new Date
  console.log(`... ReactElem :: ${store.context.state.ctx} :: (${new Date - t0}ms) ...`)
  return <div> {} </div>
}

var store = {}
export function ReactStore () { return store }

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
export function ReactState (store) {
  var t0 = new Date
  setTimeout(() => {
    store.context.setState({
      ctx: `lazy injected ReactAsyncState (${new Date - t0}ms)`
    })
  }, 0)

  return { ctx: `lazy injected ReactSyncState (${new Date - t0}ms)`,}
}
