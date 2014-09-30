import {assert, TYPE_NAMESPACE} from './assert'
// import {testRun} from './types-test'

var {
  isArray,
  isBoolean,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  // isBuffer,
} = require('./core-is')

// basic types
import {
 array, bool, num, str, reg, obj, date, error, fun, sym, nil, undef, undefnil
} from './types'


function Num (){}
assert.define(Num, isNumber)

function NullOrUndefined () {}
assert.define(NullOrUndefined, isNullOrUndefined)

console.log('%%%%', TYPE_NAMESPACE.get(Num))
assert.delete(Num)
console.log('%%%%', TYPE_NAMESPACE.get(Num))
console.log(TYPE_NAMESPACE.get(isNullOrUndefined))
// export var buf = assert.define(Array, isBuffer)

var counter = 0
var counter2 = 0
var badStack = []

export function testRun (types, sample) {
  var ans = types.map((type, i) => {
    // console.log(array[i], type)
    return sample[i].map((s) => {
      var res = assert(s).is(type)
      if (res) {
        console.log(counter2, res,  'type:', type, 'value:', s, sample[i])
      }
      else {
        badStack.push(counter2)
        console.warn(counter2, res, 'type:', type, 'value:', s, sample[i])
      }
      counter2++
      return res
    })

  })
  console.log(counter++, '*** *** ***')
  console.log(ans, sample)
}


export function test () {


testRun( [
    Array,
    Boolean,
    Number,
    RegExp,
    String,
    Object,
    Date,
    Error,
    Function,
  ], [
    [[2, 3, 'd'], [{}, '4', 4], [Date, Function], {wrong: 'kind'}],
    [true, false, true, 0, 1],
    [0, 1, 2, 3, 4, '5'],
    [/fg/, /fh/, 9],
    ['ff', 'dd', 'ss', 4],
    [{hi: 'there'}, {hello: ['gg']}, {oi: 3}, []],
    [new Date(), new Date(), 'l'],
    [new Error('ops'), new Error('ops2'), new Date()],
    [() => {}, function (){}, new Function(), 'p'],
  ])

testRun( [
    Array,
    Boolean,
    Number,
    RegExp,
    String,
    Object,
    Date,
    Error,
    Function,
  ], [
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
  ])

testRun( [
    Array,
    Boolean,
    Number,
    RegExp,
    String,
    Object,
    Date,
    Error,
    Function,
  ], [
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],

  ])


testRun( [
    null,
    nil,
    undefined,
    undef,
    undefnil,
    NullOrUndefined,
  ], [
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
    [ null, nil, undefined, undef, undefnil, NullOrUndefined, ],
  ])

testRun( [
    null,
    nil,
    undefined,
    undef,
    undefnil,
    NullOrUndefined,
  ], [
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
   [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,],
  ])

}
console.log(badStack)


