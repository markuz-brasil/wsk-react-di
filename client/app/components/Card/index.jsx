import {BaseCtrl, BaseState} from '../Core'
import {annotate, Inject, Injector} from 'di'

export class Body {
  html () {
    return Math.random()
  }
}

export class CardBody extends BaseCtrl {
  constructor (obj) { return super(obj) }
  render () { return <div> .. {this.html()} .. </div> }
}
annotate(CardBody, new Inject(Body))

export class Title {
  html () {
    return Math.random()
  }
}

export class CardTitle extends BaseCtrl {
  constructor (obj) { return super(obj) }
  render () { return <div> {this.html()} </div> }
}
annotate(CardTitle, new Inject(Title))


export class CardState extends BaseState {
  constructor(body = CardBody, title = CardTitle) {
    return super({
      Body: body, Title: title
    })
  }
}
annotate(CardState, new Inject(CardBody, CardTitle))

export class CardCtrl extends BaseCtrl {
  constructor (state) { return super(state) }

  render() {
    return (
       <div className="card-wrap">
          <div className="panel-heading">
              <h3 className="panel-title">
                <this.state.Title />
              </h3>
          </div>
          <div className="panel-body">
            <this.state.Body />
          </div>
        </div>
    );
  }
}
annotate(CardCtrl, new Inject(CardState))


