
export class BaseCtrl {
  constructor (obj) {
    var obj = obj || {}
    var ctx = {}

    for (var key in obj) {
      ctx[key] = obj[key]
    }

    for (var key in this) {
      ctx[key] = this[key]
    }

    ctx.provideState = ctx.provideState || function(){ return null }
    return React.createClass(ctx)
  }

  getInitialState () { return this.provideState() }
  render() { return <div> .. BaseCtrl .. </div> }

}



export class BaseState {
  constructor (obj) {
    var obj = obj || {}
    var ctx = {}

    for (var key in obj) {
      ctx[key] = obj[key]
    }

    for (var key in this) {
      ctx[key] = this[key]
    }

    return ctx

  }

  provideState () {
    return {
      Title: this.Title,
      Body: this.Body,
    }
  }

}
