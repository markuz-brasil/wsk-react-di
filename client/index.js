"use strict"
var t0 = new Date

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'
import { readFileSync } from 'fs'

import { AppProviders } from './src'


var { annotate, Inject, Injector, Provide, TransientScope } = di

// main
c0(function * () {
  console.log(readFileSync('./LICENSE', 'utf8'))

  // TODO: explain what is the deal with
  // $dispatcher service and this _injector

  AppProviders.push($dispatcher)
  annotate($dispatcher, new Provide(flux.$dispatcher))
  function $dispatcher () { return _injector }
  var _injector = new Injector(AppProviders)

  //
  // add anything else into the ctx.
  // Things like componentWillMount method (but not render and getInitialState)
  // is defined by the flux.Context
  //
  var ctx = yield _injector.get(flux.Context)

  // extending and shallow cloning ctx
  Object.assign({}, ctx, { componentWillMount(){} })
  var App = React.createClass(ctx)

  React.initializeTouchEvents(true)
  React.renderComponent(<App />, document.getElementById('react-app'));

  var t1 = new Date
  console.log(`*** first paint took: (${t1 - t0}ms) ***`)

})((err, value) => {if (err) return console.error(err)})
