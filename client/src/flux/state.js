"use strict"

import { React } from 'runtime'
import { c0, di } from 'libs'

var {
  annotate,
  Inject,
  Provide,
  TransientScope
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  ReactStore,
  ReactState,
  ReactStateAsync,
  ReactNextState
}

var _store = {
  pagePaints: 0,
  state: {}
}
function ReactStore () { return _store }

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
function * ReactState (store) {
  store.t0 = store.t0 || new Date

  return Object.assign(store.state, {
    msg: () => `... sync lazy injected ${store.pagePaints} times
      (${( store.pagePaints*1000/(new Date - store.t0))|0} FPS) ...`,
  })
}

annotate(ReactStateAsync, new Provide(ReactState))
annotate(ReactStateAsync, new TransientScope)
annotate(ReactStateAsync, new Inject(ReactStore))
function * ReactStateAsync (store) {
  store.t0 = store.t0 || new Date

  // 1 sec long async op
  // take a look at co's API
  yield (next) => setTimeout(next, 500)

  return Object.assign(store.state, {
    msg: () => `... async lazy injected ${store.pagePaints} times
      (${( store.pagePaints*1000/(new Date - store.t0))|0} FPS) ...`,
  })
}

annotate(ReactNextState, new TransientScope)
annotate(ReactNextState, new Inject(ReactStore))
function * ReactNextState (store) {
  store.pagePaints++
  if (store.pagePaints > 1000) return
  store.setState(yield store.injector.get(ReactState))


  // On sync mode it may blow the stack
  // or it is too fast and the browser drops most of the frames
  var next = c0(store.injector.get(ReactNextState))
  if (store.pagePaints % 9 !== 0) return next()
  setImmediate(next)
}


