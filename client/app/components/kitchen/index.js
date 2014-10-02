import {Injector} from 'di'
import {Kitchen} from './kitchen'
import {MockHeater} from './mock_heater'
// import {assert} from '../Core/assert'
import {test} from '../Core/types/specs'

var co = require('co')


function main() {
  var injector = new Injector([MockHeater]);
  var kitchen = injector.get(Kitchen);

  kitchen.makeBreakfast();

}

// main();
