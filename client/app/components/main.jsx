
"use strict"
import {co, React, di} from 'libs'
import {
  fetchJsonp,
  ReactStore,
  ReactState,
  ReactElem,
  ReactAsyncState,
  ReactSyncState,
  createReactCtrl
} from 'core'

var {
  Inject,
  InjectLazy,
  Injector,
  annotate,
  Provide,
  TransientScope
} = di

export function Main (...args) {
  return createReactCtrl(args, [RootElem, InitState, Store])
  // return createReactCtrl(args)
}

var mainStore = new Map
annotate(Store, new Provide(ReactStore))
export function Store () { return mainStore }

annotate(InitState, new Provide(ReactState))
annotate(InitState, new Inject(ReactStore))
annotate(InitState, new InjectLazy(syncState))
function InitState (store, lazySyncState) {
  if (!store.injector) {
    store.injector = new Injector([State, Store])
  }
  store.injector.get(ReactState)
  return lazySyncState()
}

annotate(State, new TransientScope)
annotate(State, new Provide(ReactState))
annotate(State, new Inject(ReactStore))
annotate(State, new InjectLazy(syncState, asyncState))
export function State (store, lazySyncState, lazyAsyncState) {
  lazyAsyncState().then(store.setState)
  return lazySyncState()
}

annotate(syncState, new TransientScope)
annotate(syncState, new Inject(ReactStore))
function syncState (store) {
  if (!store.has(syncState)) {
    store.set(syncState, {counter: 0})
  }
  store.get(syncState).counter++
  store.get(syncState).t0 = new Date
  var msg = {
    ctx: `sync (${store.get(syncState).counter}) lazy injected state (${new Date - store.get(syncState).t0}ms)`,
  }

  if (!store.has(asyncState) || !store.get(asyncState).resolvedOnce) { store.setState(msg) }
  return msg
}

annotate(fetchJsonp, new TransientScope)
annotate(asyncState, new TransientScope)
annotate(asyncState, new Inject(fetchJsonp, ReactStore))
function asyncState (promise, store) {

  if (!store.has(asyncState)) {
    store.set(asyncState, {
      counter: 0,
      limit: 10,
      resolvedOnce: false
    })
  }

  store.get(asyncState).t0 = new Date

  return new Promise((resolve, reject) => {
    if (store.get(asyncState).counter < store.get(asyncState).limit) {
      setTimeout(() => {
        if (store.get(asyncState).counter < store.get(asyncState).limit) {
          store.injector.get(ReactState)
        }
      }, 500)
    }

    store.get(asyncState).counter++

    co(function* () {
      try { var json = yield promise }
      catch (err) {console.error(err)}
      store.get(asyncState).resolvedOnce = true
      resolve({
        ctx: `async (${store.get(asyncState).counter}) lazy injected state (${new Date - store.get(asyncState).t0}ms) --- ${json}`,
      })
    })()
  })
}

annotate(StatusElem, new TransientScope)
annotate(StatusElem, new Provide(ReactElem))
annotate(StatusElem, new Inject(ReactStore))
function StatusElem (store) {
  return <div key='StatusElem'> {store.self.state.ctx} </div>
}

annotate(ElemWrap, new TransientScope)
annotate(ElemWrap, new Inject(ReactStore, StatusElem))
function ElemWrap (store, status) {
  return function ElemWrap () {
    return <div key='Elem'> {"This is the state status:"} status  </div>
  }
}

annotate(RootElem, new TransientScope)
annotate(RootElem, new Provide(ReactElem))
annotate(RootElem, new Inject(ReactStore, ElemWrap))
function RootElem (store, wrap) {
  return <div key='RootElem'> wrap() </div>
}
