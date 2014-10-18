"use strict"

import {co, React, Injector} from 'libs'
console.log('**** core')

// this base class just provides a wrapper around React.createClass
export class BaseView {
  constructor (state = {}) {
    return React.createClass(mergeCtx({}, baseViewMethods, {ctx: state}, getCtx(this)))
  }
}

// minimal methods for
var baseViewMethods = {
  render() {
    return ( <div> "... BaseView ..." </div> )
  },

  getInitialState () {
    console.log('injecting state')
    return this.ctx
  }
}

function mergeCtx (...objs) {
  var ctx = objs[1]
  for (var k0 in objs) {
    for (var k1 in objs[k0]) {
      ctx[k1] = objs[k0][k1]
    }
  }
  return ctx
}

function getCtx (obj) {

  var ctx = {}, base = {}
   Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((prop) => {
    if (!base[prop]) {
      ctx[prop] = obj[prop]
    }
  })
  return ctx
}

