import {BaseCtrl} from '../Core'

export class DefautCardBody extends BaseCtrl {
  constructor () {
    return super()
  }
  render () {
    return <div> .. DefaultCardBody .. </div>
  }
}

export class CardCtrl extends BaseCtrl {
  constructor () {
    return super()
  }
  getInitialState () {
    return {
      Body: !!this.props.Body ? new this.props.Body() : new DefautCardBody(),
      title: !!this.props.title ? this.props.title: `${Math.random()}`,
    }
  }

  render() {
    return (
       <div className="card-wrap">
          <div className="panel-heading">
              <h3 className="panel-title"> {this.state.title} </h3>
          </div>
          <div className="panel-body">
            <this.state.Body ctx={this.props.ctx}/>
          </div>
        </div>
    );
  }
}

export var Card = new CardCtrl()

