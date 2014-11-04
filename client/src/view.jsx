"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'
import { flux } from 'flux'

var { annotate, Inject, Provide } = di

var _view = {
  _global: {},
  counter:0,
}

annotate(View, new Provide(flux.View))
annotate(View, new Inject(flux.$store))
export function View ($store) {
  var iterator = _View()

  function * _View () {
    Object.assign($store.view, _view)
    if ($store.view.counter !== 0) return $store.view

    return {
      render () {
        $store.view.counter++

        return <div style={ this.state.style }>
          {[
            this.state.msg,
            <i>this.state.msg</i>, ///
            <b>this.state.msg</b>, ///
          ].map((val, key) => {
            return <div> val </div> ///
          })}
        </div> /// bug on syntax highlight
      },
    }

  }

  return iterator
}
