"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Provide } = di

annotate($view, new Provide(flux.$view))
export function $view () { return _view }

var _style = { display: 'none' }
var _view = {}

function AAA () {}
function * it () {
  var _counter = 0
  while (true) {
    if (yield Math.random()) { break }
    console.log('agent injected')
    yield (next) => setTimeout(next, 100)

    AAA()
    if (++_counter > 2000) { break } // prevent infinity loops
  }

  yield Math.random()
  return 'done'
}

var $it = it()

annotate(Init$view, new Provide(flux.Init$view))
annotate(Init$view, new Inject(flux.$view))
export function Init$view (view) {
  var iterator = Init$view()

  function * Init$view () {
    // simulating async op
    // see co's API for help
    // yield (next) => setTimeout(next, Math.random()*10|0)

    view.style = _style
    iterator.style = _style

    return {
      render () {
        // var items = ['a', 'b']

        console.log('^^^%%%', $it.next())


        // console.log(this.state)
        return <div style={ this.state.style }> {


          [
            this.state.msg,
            this.state.msg
          ].map((val, key) => {
            return <div> val </div> ///
          })



        } </div> /// bug on syntax highlight
      }
    }
  }

  return iterator
}
