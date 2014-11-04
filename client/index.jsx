"use strict"
var t0 = new Date

import { flux } from 'flux'
import { c0, di } from 'libs'
import { readFileSync } from 'fs'

import { App } from './src'

var { annotate, Inject, Injector, Provide, TransientScope } = di

main()
function main () {
  return +c0(function * main () {
    console.log(readFileSync('./LICENSE', 'utf8'))

    // event loop init
    yield new Injector(App).get(flux.Startup)

    var t1 = new Date
    console.log(`*** first paint took: (${t1 - t0}ms) ***`)
  })((err, value) => { if (err) return console.error(err) })
}
