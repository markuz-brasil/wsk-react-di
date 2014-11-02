
import { di, c0 } from 'libs'
var { annotate, Inject, Injector, Provide, TransientScope } = di

// TODO: JSDOC this stuff

//
// TODO: explain vocabulary.
// Things like $dispatcher, Actions, Providers, Services and Injectors
// Also things like Action Iterators and Action Generator
//
// Explain the role of each Provider
//

//
// A dispacher is nothing more than an instance of di's Injector
// Maybe it could be a class that extends Injector
//

var _injector = () => {}
export function $dispatcher () { return _injector }

//
// Initialization Actions
//

//
// The Context Action Iterator should return the Object which would be
// the input of React.createClass.
// And initiate nextTick once the whole context is ready
//

annotate(Context, new Inject(Init$store, Init$view, NextTick))
export function Context (init$store, init$view, nextTick) {
  var iterator = Context()
  function * Context () {}
  return iterator
}

//
// This is a $view Service. It is a "singleton" for
// the views to share state
//

var _view = {}
export function $view () { return _view }

//
annotate(Init$view, new Inject($view))
export function Init$view ($view) {
  var iterator = Init$view()
  function * Init$view () {}
  return iterator
}

//
// $store is a Service to share non style data
//

var _store = {}
export function $store () { return _store }

annotate(Init$store, new Inject($store))
export function Init$store ($store) {
  var iterator = Init$store()
  function * Init$store () {}
  return iterator
}

//
// Event Loop Actions
//

annotate(NextTick, new TransientScope)
annotate(NextTick, new Inject($dispatcher, Actions, RePaint))
export function NextTick (dispatcher, actions, paint) {
  var nextTick = c0(function * () {})
  nextTick.async = setImmediate.bind(setImmediate, nextTick)
  return nextTick
}

annotate(RePaint, new TransientScope)
annotate(RePaint, new Inject($store, $view))
export function RePaint ($store, $view) {
  var iterator = RePaint()
  function * RePaint () {}
  return iterator
}

annotate(Actions, new TransientScope)
export function Actions (...actions) {
  var iterator = Actions()
  function * Actions () {}
  return iterator
}

Actions.add = function add (...deps) {}

Actions.add(Log)
export function Log () {
  // look ma', without generators
  return (next) => next(null, 'log')
}
