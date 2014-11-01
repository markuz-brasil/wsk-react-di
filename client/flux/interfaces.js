
import { di, c0 } from 'libs'
var { annotate, Inject, Injector, Provide, TransientScope } = di

// TODO: JSDOC this stuff

//
// TODO: explain vocabulary.
// Things like Dispatcher, Actions, Providers, Services and Injectors
// Also things like Action Iterators and Action Generator
//
// Explain the role of each Provider
//

//
// A dispacher is nothing more than an instance of di's Injector
// Maybe it could be a class that extends Injector
//

export function Dispatcher () { return new Injector([]) }

//
// Initialization Actions
//

//
// The Context Action Iterator should return the Object which would be
// the input of React.createClass.
// And initiate nextTick once the whole context is ready
//

annotate(Context, new Inject(FirstPaint, NextTick))
export function Context (init, nextTick) {
  var iterator = Context()
  function * Context () {return {render, getInitialState}}
  return iterator
}

//
// The FirstPaint Action Iterator should combine Init$store and
// Init$view and return an Object where the Context Action can pass it along
//

annotate(FirstPaint, new Inject(Init$store, Init$view))
export function FirstPaint (store, view) {
  var iterator = FirstPaint()
  function * FirstPaint () {return {render, getInitialState}}
  return iterator
}

//
// $views
//

//
// This is a $view Service. It is a "singleton" for
// the views to share state
//

var _view = {}
export function $view () { return _view }

//
annotate(Init$view, new Inject($view))
export function Init$view (view) {
  var iterator = Init$view()
  function render () {}
  function * Init$view () {return { render }}
  return iterator
}

//
// $store is a Service to share non style data
//

var _store = {}
export function $store () { return _store }

annotate(Init$store, new Inject($store))
export function Init$store (store) {
  var iterator = Init$store()
  function getInitialState() {}
  function * Init$store () {return { getInitialState }}
  return iterator
}

//
// Event Loop Actions
//

annotate(ActionCreator, new TransientScope)
annotate(ActionCreator, new Inject(NextTick))
export function ActionCreator (...actions) {
  return function * ActionCreator () {
    for (let action of actions) { yield action }
  }
}

annotate(NextTick, new Inject(Dispatcher))
export function NextTick (dispatcher) {
  var nextTick = c0(function * NextTick () {})
  nextTick.async = setImmediate.bind(null, nextTick)
  return nextTick
}

annotate(ActionCreator, new Inject(RePaint))
annotate(RePaint, new TransientScope)
annotate(RePaint, new Inject($store, $view))
export function RePaint (store, view) {
  var iterator = RePaint()
  function * RePaint () {}
  return iterator
}
