export function mergeCtx (obj = {}) {
    var ctx = {}

    for (var key in obj) {
      ctx[key] = obj[key]
    }

    for (var key in this) {
      ctx[key] = this[key]
    }

    return ctx
}

export class BaseCtrl {
  constructor (obj = {}) {
    return React.createClass(mergeCtx.call(this, obj))
  }

  render() { return <div> .. BaseCtrl .. </div> }

}

export class BaseState {
  constructor (ctx = {}) {
    this.ctx = ctx
  }

  getInitialState () {
    return this.ctx
  }
}
