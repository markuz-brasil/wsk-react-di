
"use strict"
import {co, React, di} from 'libs'
import {
  fetchJsonp,
  ReactElem,
  ReactAsyncState,
  ReactSyncState,
  createReactClass
} from 'core'

var { Inject, InjectLazy, annotate, Provide } = di

export function Main (...args) {
  return createReactClass(args, [Elem, FetchAsync, FetchSync])
}

annotate(FetchSync, new Provide(ReactSyncState))
function FetchSync () {
  var t0 = new Date
  return function fetchSync (self) {
    return { ctx: `sync lazy injected state (${new Date - t0}ms)`,}
  }
}

annotate(FetchAsync, new Provide(ReactAsyncState))
annotate(FetchAsync, new Inject(fetchJsonp))
function FetchAsync (promise) {
  var t0 = new Date
  return function fetchAsync (self) {
    return new Promise((resolve, reject) => {
      co(function* () {

        try { var json = yield promise }
        catch (err) {console.error(err)}

        resolve({ ctx: `async lazy injected state (${new Date - t0}ms) --- ${json}`,})
      })()
    })
  }
}

annotate(Elem, new Provide(ReactElem))
function Elem () {
  return function elem (self) {
    return <div> {`... Main :: ${self.state.ctx} :: ...`} </div>
  }
}
