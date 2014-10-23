
"use strict"
import { React, less } from 'runtime'
import { co, di } from 'libs'

import {
  fetchJsonp,
  ReactStore,
  ReactState
} from 'core'

var {
  Inject,
  InjectLazy,
  Injector,
  annotate,
  Provide,
  TransientScope
} = di

var _store = new Map
annotate(Store, new Provide(ReactStore))
export function Store () { return _store }

annotate(InitState, new Provide(ReactState))
annotate(InitState, new Inject(ReactStore))
annotate(InitState, new InjectLazy(SyncState))
export function InitState (store, lazySyncState) {

  store.set(SyncState, {counter: -1})
  store.set(AsyncState, {
    counter: 0,
    limit: 10,
    resolvedOnce: false
  })

  store.injector.get(State)
  return lazySyncState()
}

annotate(State, new TransientScope)
annotate(State, new Provide(ReactState))
annotate(State, new Inject(ReactStore))
annotate(State, new InjectLazy(SyncState, AsyncState))
export function State (store, lazySyncState, lazyAsyncState) {
  lazyAsyncState().then((val) => { store.context.setState(val) })
  return lazySyncState()
}

annotate(SyncState, new TransientScope)
annotate(SyncState, new Inject(ReactStore))
export function SyncState (store) {
  store.get(SyncState).counter++
  store.get(SyncState).t0 = new Date
  var msg = {
    status: `sync (${store.get(SyncState).counter}) lazy injected state (${new Date - store.get(SyncState).t0}ms)`,
  }

  if (!store.get(AsyncState).resolvedOnce) {
    store.context.setState(msg)
  }

  return msg
}

annotate(fetchJsonp, new TransientScope)
annotate(AsyncState, new TransientScope)
annotate(AsyncState, new Inject(ReactStore, fetchJsonp))
function AsyncState (store, promise) {
  store.get(AsyncState).t0 = new Date

  return new Promise((resolve, reject) => {
    if (store.get(AsyncState).counter < store.get(AsyncState).limit) {

      // setImmediate(() => {
      //   if (store.get(AsyncState).counter < store.get(AsyncState).limit) {
      //     store.injector.get(State)
      //   }
      // })

      setTimeout(() => {
        if (store.get(AsyncState).counter < store.get(AsyncState).limit) {
          store.injector.get(State)
        }
      }, 100)
    }

    store.get(AsyncState).counter++

    co(function* () {
      try { var json = yield promise }
      catch (err) {console.error(err); reject(err)}

      store.get(AsyncState).resolvedOnce = true
      resolve({
        status: `async (${store.get(AsyncState).counter}) lazy injected state (${new Date - store.get(AsyncState).t0}ms) --- ${json}`,
      })
    })()
  })
}
