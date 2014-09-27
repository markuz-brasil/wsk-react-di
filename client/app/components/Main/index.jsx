import {Injector} from 'di';

import {BaseCtrl} from '../Core'
import {Card, CardCtrl} from '../Card'
import {MockBody, MockTitle, MockCardState} from '../Card/state'

var CardMockBody = new Injector([MockBody]).get(CardCtrl)
var CardMockTitle = new Injector([MockTitle]).get(CardCtrl)
var CardMock = new Injector([MockCardState]).get(CardCtrl)
var CardDefault = new Injector([]).get(CardCtrl)

export class AppCtrl extends BaseCtrl {
  constructor () { return super() }

  render() {
    return (
      <div>
        <CardMockBody />
        <CardMockTitle />
        <CardMock />
        <CardDefault />
        <Card />
      </div>
    );
  }
}

export var App = new AppCtrl()
