import {Injector} from 'di';

import {BaseCtrl} from '../Core'
import {Card, MockBody, MockTitle, CardCtrl} from '../Card'


var CardMockBody = new Injector([MockBody]).get(CardCtrl)
var CardMockTitle = new Injector([MockTitle]).get(CardCtrl)
var CardReal = new Injector([]).get(CardCtrl)

export class AppCtrl extends BaseCtrl {
  constructor () { return super() }

  render() {
    return (
      <div>
        <CardMockBody />
        <CardMockTitle />
        <CardReal />
        <Card />
      </div>
    );
  }
}

export var App = new AppCtrl()
