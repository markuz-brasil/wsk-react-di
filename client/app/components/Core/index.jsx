
export class BaseCtrl {
  constructor () {
    var ctx = {}
    for (var key in this) {
      ctx[key] = this[key]
    }

    return React.createClass(ctx)
  }

  getInitialState () {
    // console.log('###')
    return null
  }

  render() {
    return <div> .. BaseCtrl .. </div>
  }

}
