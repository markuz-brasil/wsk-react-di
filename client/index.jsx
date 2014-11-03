"use strict"
var t0 = new Date

import { flux } from 'flux'
import { c0, di } from 'libs'
import { React, less } from 'runtime'
import { readFileSync } from 'fs'

import { AppProviders } from './src'


var { annotate, Inject, Injector, Provide, TransientScope } = di

c0(function * main () {
  console.log(readFileSync('./LICENSE', 'utf8'))

  // TODO: explain what is the deal with
  // $dispatcher service and this _injector

  AppProviders.push($dispatcher)
  annotate($dispatcher, new Provide(flux.$dispatcher))
  function $dispatcher () { return _injector }
  var _injector = new Injector(AppProviders)

  //
  // add anything else into the components ctx.
  // (but not render and getInitialState, or maybe you can :)
  // is defined by the flux.Context
  //
  // extending and shallow cloning ctx
  var ctx = yield _injector.get(flux.Context)
  ctx = Object.assign({}, ctx, {
    componentWillMount(){},
    componentDidMount(){},
  })

  // React init
  var App = React.createClass(ctx)
  React.initializeTouchEvents(true)
  React.renderComponent(<App />, document.body);

  // event loop init
  setImmediate(c0(function * nextTick () {
    console.log('pre init tick')
    var payload = ({
      count: 0,
    })
    for (let tick of _injector.get(flux.NextTick)) {
      console.log('^^^^^^^^^')
      var next = yield tick(payload)
      if (!next)  break

      console.log('----------')
      var render = yield _injector.get(flux.RePaint)
      if (!render)  break
      render()
      console.log('+++++++++++')
    }
    console.log('post init tick')
  }))

  var t1 = new Date
  console.log(`*** first paint took: (${t1 - t0}ms) ***`)

})((err, value) => { if (err) return console.error(err) })
