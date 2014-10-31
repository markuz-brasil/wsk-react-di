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
  Store
  // ReactState
  // ReactStateAsync
}

var _store = {
  pagePaints: 0,
  state: null,
  _log: [],
}

_store.initState = function * initState () {
  var t0 = new Date
  console.log('2: store')
  yield (next) => setTimeout(next, Math.random()*10|0)
  console.log('2: done store', new Date - t0)

  var delta = () => (_store.t1 - _store.t0)|0

  _store.state = {}
  Object.assign(_store.state, {
    msg:  `
      first paint @ ${delta()}ms ::
      ${_store.pagePaints} injected @
      ${(_store.pagePaints*1000/(delta()))|0} FPS
    `
  })

  return {
    getInitialState() {
      _store.context = this
      _store.setState = this.setState.bind(_store.context)
      return _store.state
    },
  }
}



function Store () {
  return _store
}

// annotate(ReactState, new TransientScope)
// annotate(ReactState, new Inject(Store))
// function * ReactState (store) {
//   // store.t0 = store.t0 || new Date

//   // return Object.assign(store.state, {
//   //   msg: () => {
//   //     store.t1 = store.t1 || new Date
//   //     return `
//   //       first paint @ ${store.t1 - store.t0}ms ::
//   //       ${store.pagePaints} injected @
//   //       ${( store.pagePaints*1000/(new Date - store.t0))|0} FPS
//   //     `
//   //   },
//   // })
// }
