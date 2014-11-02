"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

annotate(Context, new Provide(flux.Context))
annotate(Context, new Inject(flux.Init$store, flux.Init$view, flux.NextTick))
export function Context (init$store, init$view, nextTick) {
  var iterator = Context()
  function * Context () {

    var ctx = Object.assign.apply(null, yield [
      {}, init$store, init$view,
    ])

    ctx.$store.state.style = init$view.style
    nextTick.async()
    return ctx
  }
  return iterator
}

var _tick = {
  count: 0,
  fps: 120,
  t0: new Date,
  cache: [],
  snapshot () { this.count++ },
}

export function $tick () { return _tick }

//
annotate(NextTick, new TransientScope)
annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject($tick, flux.$dispatcher, flux.Actions, flux.RePaint))
export function NextTick ($tick, $dispatcher, actions, paint) {
  var nextTick = c0(function * () {
    $tick.snapshot()
    if ($tick.count > 200) return console.log('done', $tick)

    yield actions   // resolving actions
    yield paint     // painting

    // TODO: dynamically find fix and $tick.delay
    var fix = 2
    $tick.delay = (1000/$tick.fps - fix)|0

    // console.log($tick.delay, (new Date - $tick.t0)/$tick.count)

    if ($tick.fps === 0) return
    if ($tick.fps < 0) return $dispatcher.get(NextTick)()
    if ($tick.fps >= 1000/4) return $dispatcher.get(NextTick).async()

    return $dispatcher.get(NextTick).timeout()
  })

  nextTick.async = setImmediate.bind(null, nextTick)
  nextTick.timeout = setTimeout.bind(null, nextTick, $tick.delay)
  return nextTick
}

//
annotate(Actions, new TransientScope)
annotate(Actions, new Provide(flux.Actions))
export function Actions (...actions) {
  var iterator = Actions()
  function * Actions () {
    for (let action of actions) {
      // processing all actions in series
      yield action
    }
  }
  return iterator
}

Actions.add = function add (...deps) {
  for (let dep of deps) {
    annotate(Actions, new Inject(dep))
  }
}

//
annotate(RePaint, new TransientScope)
annotate(RePaint, new Provide(flux.RePaint))
annotate(RePaint, new Inject(flux.$store, flux.$view))
export function RePaint ($store, $view) {
  var iterator = RePaint()

  function * RePaint () {
    $store.paintCount++
    // simulating async op
    // see co's API for help
    // yield (next) => setTimeout(next, Math.random()*1000|0)

    $store.state.msg = 'store-data-' + $store.paintCount
    $store.state.style = { background: '#45ba76' }
    $store.context.setState($store.state)
    return $store.state

  }

  return iterator
}

Actions.add(Log)
export function Log () {
  var t0 = new Date
  return (next) => {
    // console.log('log:', new Date() - t0)
    next()
  }
}

