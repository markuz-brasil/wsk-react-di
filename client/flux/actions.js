"use strict"

import { c0, di } from 'libs'

import { View } from './view'
import { Store } from './store'
import { Dispatcher } from './dispatcher'

import * as flux from './annotations'

var {
  annotate,
  Inject,
  Injector,
  Provide,
  TransientScope
} = di

// This is an Action becouse it depends on other Actions
var a_ct = 0

annotate(ActionPipeline, new TransientScope)
annotate(ActionPipeline, new Provide(flux.ActionPipeline))
annotate(ActionPipeline, new Inject(flux.RePaint, flux.NextTick))
export function ActionPipeline (...actions) {
  return function * ActionPipeline () {
    for (let action of actions) {
      // processing actions in series
      yield action
    }
  }
}

annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject(flux.Dispatcher))
export function NextTick (dispatcher) {
  var nextTick = c0(function * NextTick () {
    a_ct++
    console.log('actions', a_ct)
    if (a_ct >= 10) return // just breaking out of the loop
    yield dispatcher.get(ActionPipeline)
  })

  nextTick.async = setImmediate.bind(null, nextTick)
  return nextTick
}

annotate(RePaint, new Provide(flux.RePaint))
annotate(RePaint, new TransientScope)
annotate(RePaint, new Inject(flux.Store, flux.View))
export function RePaint (store, view) {
  var iterator = RePaint()

  function * RePaint () {
    store.paintCount++
    // simulating async op
    // see co's API for help
    yield (next) => setTimeout(next, Math.random()*1000|0)

    store.state.msg = 'store-data-' + store.paintCount
    store.state.style = { background: '#45ba76' }

    // calling setState call NextTick at the end
    store.setState()
    // store.next()
    // returning next round actions
    // return store.dispatcher.get(NextTick)
  }

  return iterator
}

