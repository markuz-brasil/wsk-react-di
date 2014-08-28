
require('di')
require('./scripts/main')

// TODO: add diary to di
import {Diary} from 'diary';

// requiring thi just for the sake of making the dep tree more complex
// uglify should detect `CoffeMaker` class is not used at all.
import {CoffeeMaker} from '../kitchen-di/coffee_maker/coffee_maker';

console.log(Diary, Zone)
