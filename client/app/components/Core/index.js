import {mergeCtx} from './utils'

export class BaseCtrl {
  constructor (ctrlState = {}) {
    return React.createClass(mergeCtx.call(this, ctrlState))
  }
  render() { return React.DOM.div(null, " .. BaseCtrl .. ") }
}

export class BaseState {
  constructor (ctx = {}) {
    this.ctx = ctx
  }

  getInitialState () {
    return this.ctx
  }
}

export {Http, httpJsonp, httpGet, http} from './utils'

export {types} from './types'
export {assert} from './assert'
import {test} from './types-tests'

test() //types

