"use strict"
var t0 = new Date

import { AppDeps, flux } from 'flux'
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
  AppDeps.push(ViewDispatcher)
  annotate(ViewDispatcher, new Provide(flux.Dispatcher))
  function ViewDispatcher () { return injector }

  var injector = new Injector(AppDeps)
  var ctx = yield injector.get(flux.Dispatcher).get(flux.Context)
  var App = React.createClass(ctx)

  React.initializeTouchEvents(true)
  React.renderComponent(<App />, document.getElementById('react-app'));

  var t1 = new Date
  console.log(`*** real first paint took: (${t1 - t0}ms) ***`)

})((err, value) => {if (err) return console.error(err)})
