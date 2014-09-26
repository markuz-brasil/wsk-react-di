import {Card} from '../Card'
import {BaseCtrl} from '../core'
import {Injector} from 'di';

class CardBody extends BaseCtrl {
  constructor () { return super() }

  render () {
    return <div> .. {Math.random()} .. </div>
  }
}

class AppCtrl extends BaseCtrl {
  constructor () { return super() }

  render() {
    return (
      <div >
        <Card />
        <Card Body={CardBody}/>
        <Card Body={CardBody}/>
        <Card Body={CardBody}/>
        <Card Body={CardBody}/>
      </div>
    );
  }
}

export function init () {
  var App = new AppCtrl()
  var renderApp = () =>
    React.renderComponent(<App />, document.getElementById('react-app'));

  renderApp();
}
