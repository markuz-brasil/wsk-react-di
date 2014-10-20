
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
  var t0 = new Date
  if (!store.has(getDataSync)) {
    store.set(getDataSync, {counter: 0})
  }
  store.get(getDataSync).counter++
  var msg = { ctx: `sync (${store.get(getDataSync).counter}) lazy injected state (${new Date - t0}ms)`,}

  if (!store.get(getDataAsync).counter) { store.setState(msg) }
  return msg
}

annotate(getDataAsync, new TransientScope)
annotate(getDataAsync, new Provide(ReactAsyncState))
annotate(getDataAsync, new Inject(fetchJsonp, ReactStore))
function getDataAsync (promise, store) {
  var t0 = new Date

  if (!store.has(getDataAsync)) {
    store.set(getDataAsync, {counter: 0})
  }

  return new Promise((resolve, reject) => {
    if (store.get(getDataAsync).counter < 10) {
      setTimeout(() => {
        stateInjector.get(ReactState)
      }, 500)
    }

    co(function* () {
      try { var json = yield promise }
      catch (err) {console.error(err)}

      store.get(getDataAsync).counter++
      resolve({ ctx: `async (${store.get(getDataAsync).counter}) lazy injected state (${new Date - t0}ms) --- ${json}`,})
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
