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

export {
  HttpProvider,
  httpJsonpProvider,
  httpGetProvider,
  http
} from './utils'

export {assert} from './types'

// import {test} from './types/specs'
// setTimeout(test, 0) //types

