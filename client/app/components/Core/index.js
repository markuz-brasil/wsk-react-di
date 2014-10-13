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

export {types} from './types'
export {assert} from './types/assert'

import {test, test2} from './types/specs'
// test2() // this tests old assert
test() //types

