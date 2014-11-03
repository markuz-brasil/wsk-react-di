"use strict"

import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Injector, Provide, TransientScope } = di

annotate(Context, new Provide(flux.Context))
annotate(Context, new Inject(flux.Init$store, flux.Init$view))
export function Context (init$store, init$view) {
  var iterator = Context()
  function * Context () {

    // see co's API on yield for help.
    // Enhanced yield staments ahead.

    var ctx = Object.assign.apply(null, yield [
      {}, init$store, init$view,
    ])

    console.log('delaying ctx async: begin')
    yield (next) => setTimeout(next, 100)
    console.log('delaying ctx async: end')

    var _counter = 1000
    while (_counter--){console.log('delaying ctx sync')}

    ctx.$store.state.style = init$view.style
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

function * _asyncOps (t0) {
 // short term async.
  console.log('#### begin async ops ####')
  setImmediate(()=>{
    console.log('short async', new Date - t0)
  })

  // long term async
  yield (next) => setTimeout(next, 100)
  console.log('long async', new Date - t0)

  // blocking sync
  var _counter = 1000
  while (_counter--){console.log('...')}
  console.log('sync', new Date - t0)

  console.log('#### end async ops ####')
}
//
// annotate(NextTick, new TransientScope)
annotate(NextTick, new Provide(flux.NextTick))
annotate(NextTick, new Inject($tick, flux.$dispatcher, flux.Actions, flux.RePaint))
export function NextTick ($tick, $dispatcher, actions, paint) {
  var _counter = 100
  var _ticks = 0

  function * tick (payload) {
    payload.count++

    var t0 = new Date
    console.log('status:' ,++_ticks, payload)
    yield _asyncOps(t0)

    return true
  }

  var $nextTick = nextTick()
  function * nextTick () {
    // logic deciding when to break out
    while (_counter--) { tick.count++; yield tick }
    console.log('tick:', 'end init')
  }

  console.log('tick:', 'begin init')
  return $nextTick
}

//
annotate(RePaint, new TransientScope)
annotate(RePaint, new Provide(flux.RePaint))
annotate(RePaint, new Inject(flux.$store, flux.$view))
export function RePaint ($store, $view) {

  function * RePaint () {
    $store.paintCount++
    // simulating async op
    // see co's API for help
    // yield (next) => setTimeout(next, Math.random()*1000|0)

    $store.state.msg = 'store-data-' + $store.paintCount
    $store.state.style = { background: '#45ba76' }
    console.log('--- Repaint:')
    var render = $store.setState.bind($store)
    return render

  }

  return RePaint
}

//
annotate(Actions, new TransientScope)
annotate(Actions, new Provide(flux.Actions))
export function Actions (...actions) {
  var iterator = Actions()
  function * Actions () {
    // processing all actions in series
    for (let action of actions) { yield action }
  }
  return iterator
}

Actions.add = function add (...deps) {
  for (let dep of deps) {
    annotate(Actions, new Inject(dep))
  }
}



Actions.add(Log)
export function Log () {
  var t0 = new Date
  return (next) => {
    // console.log('log:', new Date() - t0)
    next()
  }
}


    // $tick.snapshot()
    // if ($tick.count > 200) return console.log('done', $tick)

    // yield actions   // resolving actions
    // yield paint     // painting


    // // TODO: make sure paint loop is sync and at 60FPS (if it will render or not)
    // // while actions is async and takes longer.

    // var fix = 2
    // $tick.delay = (1000/$tick.fps - fix)|0

    // // console.log($tick.delay, (new Date - $tick.t0)/$tick.count)

    // console.log('&&&', $dispatcher.get(NextTick))
    // // nextTick()
    // // if ($tick.fps === 0) return
    // // if ($tick.fps < 0) return $dispatcher.get(NextTick).sync()
    // // if ($tick.fps >= 1000/4) return $dispatcher.get(NextTick).async()

    // // return $dispatcher.get(NextTick).timeout()


  // nextTick.sync = nextTick
  // nextTick.async = setImmediate.bind(null, nextTick)
  // nextTick.timeout = (t) => {
  //   t = t || $tick.delay
  //   return setTimeout(nextTick, t|0)
  // }
  // return nextTick

