import {CardCtrl} from './components/Card'
// import {React} from 'reactjs'
import {Model} from './models'

import {Injector} from 'di';

function* idMaker(){
    var index = 0;
    while(true)
        yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

React.initializeTouchEvents(true)

class _DefautCard {
  render() {
    return <div> .. {Math.random()} .. </div>
  }
}

var DefautCard = React.createClass(_DefautCard.prototype)



class _App {

  render() {
    return (
      <div >
        <CardCtrl body={DefautCard}/>
        <CardCtrl body={DefautCard}/>
        <CardCtrl body={DefautCard}/>
        <CardCtrl body={DefautCard}/>
        <CardCtrl body={DefautCard}/>
      </div>
    );
  }
}
/*
        <CardCtrl ctx={new Model()} body={TableCtrl}/>
        <CardCtrl ctx={new Model()} body={TableCtrl}/>
*/
export var App = React.createClass(_App.prototype);

var renderApp = () =>
  React.renderComponent(<App />, document.getElementById('react-app'));

renderApp();

/*


*/

