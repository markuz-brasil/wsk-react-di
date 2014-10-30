"use strict"

import { di } from 'libs'

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
  ReactState
  // ReactStateAsync
}

var _store = {
  pagePaints: 0,
  state: {},
}
function ReactStore () { return _store }

annotate(ReactState, new TransientScope)
annotate(ReactState, new Inject(ReactStore))
function * ReactState (store) {
  store.t0 = store.t0 || new Date

  return Object.assign(store.state, {
    msg: () => {
      store.t1 = store.t1 || new Date
      return `
        first paint @ ${store.t1 - store.t0}ms ::
        ${store.pagePaints} injected @
        ${( store.pagePaints*1000/(new Date - store.t0))|0} FPS
      `
    },
  })
}
