
"use strict"
import {co, React, di} from 'libs'
import {
  fetchJsonp,
  ReactStore,
  ReactState,
  ReactElem,
  ReactAsyncState,
  ReactSyncState,
  createReactClass
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
  return createReactClass(args, [Elem, InitState, Store])
}

var mainStore = new Map
annotate(Store, new Provide(ReactStore))
export function Store () { return mainStore }

annotate(InitState, new Provide(ReactState))
annotate(InitState, new InjectLazy(getDataSync))
function InitState (lazyDataSync) {
  stateInjector.get(ReactState)
  return lazyDataSync()
}

annotate(getDataSync, new TransientScope)
annotate(getDataSync, new Provide(ReactSyncState))
annotate(getDataSync, new Inject(ReactStore))
function getDataSync (store) {
  if (!store.has(getDataSync)) {
    store.set(getDataSync, {counter: 0})
  }

  store.get(getDataSync).counter++
  store.get(getDataSync).t0 = new Date
  var msg = { ctx: `sync (${store.get(getDataSync).counter}) lazy injected state (${new Date - store.get(getDataSync).t0}ms)`,}

  if (!store.get(getDataAsync).resolvedOnce) { store.setState(msg) }
  return msg
}

annotate(fetchJsonp, new TransientScope)
annotate(getDataAsync, new TransientScope)
annotate(getDataAsync, new Provide(ReactAsyncState))
annotate(getDataAsync, new Inject(fetchJsonp, ReactStore))
function getDataAsync (promise, store) {

  if (!store.has(getDataAsync)) {
    store.set(getDataAsync, {
      counter: 0,
      limit: 10,
      resolvedOnce: false
    })
  }

  store.get(getDataAsync).t0 = new Date

  return new Promise((resolve, reject) => {
    if (store.get(getDataAsync).counter < store.get(getDataAsync).limit) {
      setTimeout(() => {
        if (store.get(getDataAsync).counter < store.get(getDataAsync).limit) {
          stateInjector.get(ReactState)
        }
      }, 500)
    }

    store.get(getDataAsync).counter++

    co(function* () {
      try { var json = yield promise }
      catch (err) {console.error(err)}
      store.get(getDataAsync).resolvedOnce = true
      resolve({ ctx: `async (${store.get(getDataAsync).counter}) lazy injected state (${new Date - store.get(getDataAsync).t0}ms) --- ${json}`,})
    })()
  })
}

annotate(Elem, new TransientScope)
annotate(Elem, new Provide(ReactElem))
annotate(Elem, new Inject(ReactStore))
function Elem (lazyStore) {
    return <div> {`... Main :: ${lazyStore.self.state.ctx} :: ...`} </div>
}

var stateInjector = new Injector([getDataAsync, getDataSync, Store])
