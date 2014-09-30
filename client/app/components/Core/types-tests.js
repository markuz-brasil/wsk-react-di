import {assert, TYPE_NAMESPACE, Type} from './assert'

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
} = require('./core-is')

import {
 array, bool, num, str, reg,
 obj, date, error, fun, sym,
 nil, undef, undefnil
} from './types'

function Num (){}
assert.define(Num, isNumber)

function NullOrUndefined () {}
assert.define(NullOrUndefined, isNullOrUndefined, {types: [null, undefined]})

// testing basic add deletion
if (!TYPE_NAMESPACE.has(Num)) {
  console.warn(Num, 'not found on', TYPE_NAMESPACE)
}

assert.delete(Num)

if (TYPE_NAMESPACE.has(Num)) {
  console.warn(Num, 'found on', TYPE_NAMESPACE)
}

var COUNTER = 0
var COUNTER2 = 0
var FAIL_STACK = []
var FAIL_STACK2 = []

export function testRun (types, sample, expect) {

  var ans = types.map((type, i) => {
    // console.log(array[i], type)
    return sample[i].map((s, j) => {
      var res = assert(s).is(type)
      var exp = expect[i][j]
      if (res === exp) {
        COUNTER2++
        return res
      }

      var v = s
      var t = type
      if (s instanceof Type) {
         v = s.type
      }

      if (type instanceof Type) {
        t = type.type
      }

      FAIL_STACK.push(COUNTER2)
      FAIL_STACK2.push(COUNTER2)
      console.warn(COUNTER2++, i, j, 'exp:', exp, 'got:', res, 't:', t, 'v:', v)
      // console.warn(COUNTER2++, i, j, 't:', t, 'v:', v, 'exp:', exp, 'got:', res, 'type:', type, 'sample', s)
      return res
    })

  })

  console.log('test#', COUNTER++, ', failed specs:' ,FAIL_STACK.length)
  FAIL_STACK = []
}

export function test () {
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
    [true, false, false, false, false, false, false, false, false,],
    [false, true, false, false, false, false, false, false, false,],
    [false, false, true, false, false, false, false, false, false,],
    [false, false, false, true, false, false, false, false, false,],
    [false, false, false, false, true, false, false, false, false,],
    [false, false, false, false, false, true, false, false, false,],
    [false, false, false, false, false, false, true, false, false,],
    [false, false, false, false, false, false, false, true, false,],
    [true, true, true, true, true, true, true, true, true],
  ]

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
  testRun(array00, array00c, exp00c) // fails 2 tests

  var array01a = [
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

  var exp01a = [
    [false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false],
    [false, false, false, false],
    [false, false, false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false, false],
  ]

  var array01b = [array00, array00, array00, array00, array00, array00,]
  var exp01b = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
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

  console.log('\n\n tests took:',
    new Date() - t0,
    'ms to complete',
    COUNTER2,
    'tests with total fails of',
    FAIL_STACK2.length, 'tests \n\n')
}


