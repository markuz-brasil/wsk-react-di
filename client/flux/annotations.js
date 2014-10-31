
import { di, c0 } from 'libs'

var {
  annotate,
  Inject,
  Injector,
  Provide,
  TransientScope
} = di

//
// TODO: explain vocabulary.
// Things like Dispatcher, Actions, Providers, Services and Injectors
// Also things like Action Iterators and Action Generator
//
export function Dispatcher () { return new Injector([]) }

//
// Initialization Actions
//
annotate(Context, new Inject(InitState, NextTick))
export function Context (init, nextTick) {
  var iterator = Context()
  function * Context () {}
  return iterator
}

annotate(InitState, new Inject(InitStore, InitView))
export function InitState (store, view) {
  var iterator = InitState()
  function * InitState () {}
  return iterator
}

//
// Views
//

var _view = {}
export function View () { return _view }

annotate(InitView, new Inject(View))
export function InitView (view) {
  var iterator = InitView()
  function render () {}
  function * InitView () {return { render }}
  return iterator
}

//
// Store
//

var _store = {}
export function Store () { return _store }

annotate(InitStore, new Inject(Store))
export function InitStore (store) {
  var iterator = InitStore()
  function getInitialState() {}
  function * InitStore () {return { getInitialState }}
  return iterator
}

//
// Actions
//

annotate(ActionPipeline, new TransientScope)
annotate(ActionPipeline, new Inject(RePaint, NextTick))
export function ActionPipeline (...actions) {
  return function * ActionPipeline () {
    for (let action of actions) { yield action }
  }
}

annotate(NextTick, new Inject(Dispatcher))
export function NextTick (dispatcher) {
  var nextTick = c0(function * NextTick () {})
  nextTick.async = setImmediate.bind(null, nextTick)
  return nextTick
}

annotate(RePaint, new TransientScope)
annotate(RePaint, new Inject(Store, View))
export function RePaint (store, view) {
  var iterator = RePaint()
  function * RePaint () {}
  return iterator
}
