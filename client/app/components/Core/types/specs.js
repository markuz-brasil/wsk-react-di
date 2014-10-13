import {assert} from '../types/assert'

import {
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
} from '../utils/core-is'

export {test} from './specs2'

var nil = assert.define(null, isNull)
var undef = assert.define(undefined, isUndefined)
var undefnil = assert.define(isNullOrUndefined, {types: [null, undefined]})
var primitive = assert.define(isPrimitive, {
  types: [Boolean, Number, String, Symbol, undefined,],
})


function Num (){}
assert.define(Num, isNumber)

function NullOrUndefined () {}
assert.define(NullOrUndefined, isNullOrUndefined, {types: [null, undefined]})

// testing basic add - deletion
if (!assert._store.has(Num)) {
  console.warn(Num, 'not found on', assert._store)
}

assert.delete(Num)

if (assert._store.has(Num)) {
  console.warn(Num, 'found on', assert._store)
}

[Boolean, String, Number, Symbol, undefined].forEach((type) => {
  var res = assert(type).is(primitive)
  if (!res) {console.log('primitive test failed', type, primitive)}
})

var COUNTER = 0
var COUNTER2 = 0
var FAIL_STACK = []
var FAIL_STACK2 = []

export function testRun (types, sample, expect) {

  types.forEach((type, i) => {
    if (!sample[i]) {return}
    if (!sample[i].forEach) {return}

    sample[i].forEach((s, j) => {
      var res = assert(s).is(type)
      var exp = expect[i][j]
      if (res === exp) {
        COUNTER2++
        return
      }

      var v = s
      var t = type
      if (s instanceof assert.Type) {
         v = s.type
      }

      if (type instanceof assert.Type) {
        t = type.type
      }

      FAIL_STACK.push(COUNTER2)
      FAIL_STACK2.push(COUNTER2)
      console.warn(COUNTER2++, i, j, 'exp:', exp, 'got:', res, 't:', t, 'v:', v)
      // console.warn(COUNTER2++, i, j, 't:', t, 'v:', v, 'exp:', exp, 'got:', res, 'type:', type, 'sample', s)
    })

  })

  console.log('test#', COUNTER++, ', failed specs:' ,FAIL_STACK.length)
  FAIL_STACK = []
}



export function test2 () {
  var t0 = new Date()

  var array00 = [Array, Boolean, Number, RegExp, String, Object, Date, Error, Function,]
  var array01 = [ null, nil, undefined, undef, undefnil, NullOrUndefined, ]

  var array00a = [
    [[2, 3, 'd'], [{}, '4', 4], [Date, Function], {wrong: 'kind'}],
    [true, false, true, 0, 1],
    [0, 1, 2, 3, 4, '5'],
    [/fg/, /fh/, 9],
    ['ff', 'dd', 'ss', 4],
    [{hi: 'there'}, {hello: ['gg']}, {oi: 3}, [], 'll'],
    [new Date(), new Date(), 'l'],
    [new Error('ops'), new Error('ops2'), new Date()],
    [() => {}, function (){}, new Function(), 'p'],
  ]


 var array00a = [[
    0, 1, 2, 3, 0, 1, 2, true, false, true, false,
    Math.PI, Math.E, Math.PI, 2.34, Math.E,
    null, null, undefined, void 0, NaN, NaN,
    Math.NEGATIVE_INFINITY, Math.POSITIVE_INFINITY,
    Math.NEGATIVE_INFINITY, Math.POSITIVE_INFINITY,

    [], [{}], {}, NaN, NaN, Object.create(null), Object.create(null), function place (){}, function(){},
    new Error, new Date, new RegExp, new Error, new Date, new RegExp,

    'string', 'another', 'string',
  ]]

  var exp00a = [
    [true, true, true, false],
    [true, true, true, false, false],
    [true, true, true, true, true, false],
    [true, true, false],
    [true, true, true, false],
    [true, true, true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, true, false],
  ]

  var array00b = [array00, array00, array00, array00, array00, array00, array00, array00, array00,]
  var exp00b = [
    [true, false, false, false, false, false, false, false, true,],
    [false, true, false, false, false, false, false, false, true,],
    [false, false, true, false, false, false, false, false, true,],
    [false, false, false, true, false, false, false, false, true,],
    [false, false, false, false, true, false, false, false, true,],
    [false, false, false, false, false, true, false, false, true,],
    [false, false, false, false, false, false, true, false, true,],
    [false, false, false, false, false, false, false, true, true,],
    [true, true, true, true, true, true, true, true, true],
  ]
// debugger
  var array00c = [array01, array01, array01, array01, array01, array01, array01, array01, array01,]
  var exp00c = [
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, false, false,],
    [false, false, false, false, true, true,],
  ]

  console.log('------------------')
  testRun(array00, array00a, exp00a)
  testRun(array00, array00b, exp00b)
  testRun(array00, array00c, exp00c)

  var array01a = [
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
    [[], {}, new Date(), new Error('ops'), () => {}, Date, Function, {wrong: 'kind'}, true, false, 0, 1, 2, 3, '5', /fg/, /fh/, {hello: ['gg']}, ],
  ]

  var exp01a = [
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    [false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, ],
  ]

  var array01b = [array00, array00, array00, array00, array00, array00,]
  var exp01b = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, true, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false, false],
    [false, false, false, false, false, false, false, false, true],
  ]

  var array01c = [array01, array01, array01, array01, array01, array01,]
  var exp01c = [
    [true, true, false, false, true, true],
    [true, true, false, false, true, true],
    [false, false, true, true, true, true],
    [false, false, true, true, true, true],
    [true, true, true, true, true, true],
    [true, true, true, true, true, true],
  ]

  console.log('xxxxxxxxxxxxxxxxx')
  testRun(array01, array01a, exp01a)
  testRun(array01, array01b, exp01b)
  testRun(array01, array01c, exp01c)

  console.log('\n\n----- isListOf ----\n')

  console.log(assert([5, 6, 9]).isListOf([Number, String])                         , "[5, 6, 9] isListOf [Number, String]")
  console.log(assert([5, '6', 9]).isListOf([Number, String])                       , "[5, '6', 9] isListOf [Number, String]")
  console.log(assert([() => {}, new Date(), {}]).isListOf([Number, String, Date])  , "[() => {}, new Date(), {}] isListOf [Number, String, Date]")
  console.log(assert([null, {}]).isListOf([Function, null])                        , "[null, {}] isListOf [Function, null]" )
  console.log(!assert([null, {}]).isListOf([Function, undefined])                  , "[null, {}] ! isListOf [Function, undefined]")
  console.log(!assert([[], {}, undefined]).isListOf([Function, null])              , "[[], {}, undefined] ! isListOf [Function, null]")
  console.log(assert([[], {}, undefined]).isListOf([String, undefined])            , "[[], {}, undefined] isListOf [String, undefined]")


  // assert.define(Map, {types: [Map]})
  // assert.define(Set)



  // console.log('&&&', assert.type(new Map(), Map))

  var t1 = new Date()

  console.log('\n\n tests took:',
    t1 - t0,
    'ms to complete',
    COUNTER2,
    'tests with total fails of',
    FAIL_STACK2.length, 'tests', 'avg:', COUNTER2/(t1-t0) + '/ms \n\n')
}


