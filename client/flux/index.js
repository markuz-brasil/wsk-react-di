"use strict"

import { c0, di } from 'libs'

import {
  View
} from './view'

// import {
//   Store
// } from './store'

var {
  annotate,
  Inject,
  Injector,
  TransientScope
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  Context,
  Dispatcher,
  Store,
  View
}



function Dispatcher () { return new Injector([]) }

// annotate(Actions, new Inject(UpdateView))
annotate(Actions, new Inject(NextPaint))
var a_ct = 0
function Actions (paint) {
  return c0(function * Actions () {
    a_ct++
    console.log('actions', a_ct)
    if (a_ct >= 5) return

    yield (next) => setTimeout(next, 1000)
    var next = yield paint
    next()
  })

}

annotate(NextPaint, new Inject(Store))
function NextPaint (store) {
  return function * NextPaint () {
    store.paintCount++

    var t0 = new Date
    // console.log('next')
    console.log('next', new Date - t0)

    store.state.msg = 'store-data-' + store.paintCount
    store.state.style = { background: '#45ba76' }
    store.setState()
    return store.dispatcher.get(Actions)
  }
}

// TODO: combine Store, FluxState, into one big Store
annotate(InitState, new Inject(Store, View))
function * InitState (store, view) {
  store.t0 = new Date

  var ctx = Object.assign.apply(null, yield [
    {},
    store.init,
    view.init,
  ])

  store._state.style = view.style
  store.t1 = new Date

  return ctx
}


// TODO: combine Store, FluxState, into one big Store
annotate(Context, new Inject(InitState, Actions))
function * Context (init, next) {
  var ctx = yield init
  setImmediate(next)
  return ctx
}

// Store

annotate(Store, new Inject(Dispatcher))
function Store (dispatcher) {
  _store.dispatcher = dispatcher
  return _store
}

var _store = {
  dispatcher: null,
  state: null,
  context: null,
  _state: {},
  init: storeInit,
  setState: setState,
  paintCount: 1,
}

var ct0 = 10
function * storeInit () {

  var t0 = new Date
  console.log('1: store')
  yield (next) => setTimeout(next, Math.random()*10|0)
  console.log('1: done store', new Date - t0)

  _store._state.msg = 'store-data'
  return {
    getInitialState () {
      _store.state = _store._state
      _store.context = this

      return _store.state
    },
  }
}

function setState () {
  _store.context.setState(_store.state)
  return _store.state
}


// annotate(FluxRuntime, new Inject(PreView, Store))
// function FluxRuntime (view, store) {
//   c0(function * () {
//     console.log('0: runtime')

//     while (true) {
//       yield (next) => setImmediate(next)
//       if (store.state && store.state.style) break
//     }

//     // store.setState(store.state)
//     store.setState(_injector.get(Store).state)
//     console.log('0: done runtime')
//   })()
// }

//

