"use strict"
var t0 = new Date

import { Context, Store, Dispatcher } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'
import { readFileSync } from 'fs'

var {
  annotate,
  Inject,
  Provide,
  Injector
} = di

// main
c0(function * () {
  console.log(readFileSync('./LICENSE', 'utf8'))

  // TODO: explain what is the deal with the Dispatch and dispatcher
  annotate(ViewDispatcher, new Provide(Dispatcher))
  function ViewDispatcher () { return dispatcher }
  var dispatcher = new Injector([ViewDispatcher])

  React.initializeTouchEvents(true)

  var App = React.createClass(yield dispatcher.get(Context))
  React.renderComponent(<App />, document.getElementById('react-app'));

  var t1 = new Date
  console.log(`*** real first paint took: (${t1 - t0}ms) ***`)

})((err, value) => { if (err) return console.error(err) })
