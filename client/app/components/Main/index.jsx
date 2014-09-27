import {BaseCtrl} from '../Core'
import {Card, CardCtrl} from '../Card'

import {Injector} from 'di';

var injector = new Injector([])
var Card = injector.get(CardCtrl)

export class AppCtrl extends BaseCtrl {
  constructor () { return super() }

  render() {
    return (
      <div>
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    );
  }
}

export var App = new AppCtrl()
