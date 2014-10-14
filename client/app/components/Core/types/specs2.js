import {assert, types, Token} from './assert2'

import {Type, STORAGE, typeCheck } from './Type'


var isArray = assert([]).is
var typeSys =  new Type
var assertType = typeSys.assert
var defineType = typeSys.define
var storageType = typeSys.storage

export function test () {
  testTypes()
  runPerf()
  console.log('\n\nnext, test define\n\n')

  console.log(parseInt('f0', 36), parseInt('E9', 36))
}

class NoPrimitiveType {}

function testTypes () {
  function fn0 () {}

  function fn1 (value, base) {
    return typeof value === 'object'
  }

  function fn2 (value, base) {
    return typeof value === 'string'
  }

  function fn3 (value, base) {
    return isArray(value)
  }

  var A0, A1, A2

  console.log('*** assert(null).is(SomeFunc) ***')
  A0 = [true, 10, 'a', null, {}, () => {}, [],]
  A1 = [ fn0, fn1, fn2, fn3, ]
  A2 = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, true, false],
    [false, true, false, false],
    [false, true, false, false],
    [true, false, false, false],
    [false, true, false, true],
  ]
  testAssertions(A0, A1, A2, assertType)

  console.log('*** assert(SomeFunc).is(null) ***')
  A0 = [ fn0, fn1, fn2 ]
  A1 = [true, 10, 'a', null, {}, () => {}, []]
  A2 = [
    [false, false, false, false, false, true, false],
    [false, false, false, true, true, false, true ],
    [false, false, true, false, false, false, false ],
    [false, false, false, false, false, false, true ],
  ]
  testAssertions(A0, A1, A2, assertType)

  console.log('*** assert(null).is(assert(null)) ***')
  A0 = [true, 10, 'a', null, {}, () => {}, [], 'b']
  A1 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, true],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, true, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assertType)

  console.log('*** assert(assert(null)).is(null) ***')
  A0 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A1 = [true, 10, 'a', null, {}, () => {}, [], 'b']
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, true],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, true, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assertType)

  console.log('*** assert(assert(null)).is(assert(null)) ***')
  A0 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A1 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, true],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, true, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assertType)

  console.log('*** self reference test ***')
  testAssertions(typeList, typeList, makeKeyTable(), assertType)

  testStruct()
}

function testStruct () {
  var A0, A1, A2

  console.log('\n\n--- testing struct ---\n\n')
  console.log('*** assert(assert(null)).is(assert(null)) ***')

  A0 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A1 = [assertType(true), assertType(10), assertType('a'), assertType(null), assertType({}), assertType(() => {}), assertType([]), assertType('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, true],
    [false, false, false, true, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, true, false, false, false, false, true],
  ]
  testAssertions(A0, A1, A2, assertType)
}

var objNull = Object.create(null)
objNull.hi$ = NaN
objNull.$hi = '$world'

var typeList = [
  0, 1, 2, 3, 0, 1, 2, true, false, true, false,
  Math.PI, Math.E, Math.PI, 2.34, Math.E,
  null, null, undefined, void 0, NaN, NaN,
  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,

  [], [{}], {}, NaN, NaN, objNull, Object.create(null), function place (){}, function(){},
  new Error, new Date, new RegExp, new Error, new Date, /regexp/,

  'string', 'another', 'string',
]

function makeKeyTable () {
  return [
  /* 00: 0 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 01: 1 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 02: 2 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 03: 3 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 04: 0 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 05: 1 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 06: 2 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 07: true */    [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 08: false */   [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 09: true */    [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 10: false */   [false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 11: Math.PI */ [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 12: Math.E */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 13: Math.PI */ [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 14: 2.34 */    [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 15: Math.E */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 16: null */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 17: null */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 18: undefined */ [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 19: void 0 */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 20: NaN */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 21: NaN */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 22: Number.NEGATIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 23: Number.POSITIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 24: Number.NEGATIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 25: Number.POSITIVE_INFINITY */  [true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 26: [] */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 27: [{}] */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 28: {} */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 29: NaN */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 30: NaN */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false,],
  /* 31: Object.create(null) */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 32: Object.create(null) */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false,],
  /* 33: function place (){} */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false,],
  /* 34: function(){} */           [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false,],
  /* 35: new Error */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false,],
  /* 36: new Date */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false,],
  /* 37: new RegExp */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false,],
  /* 38: new Error */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false,],
  /* 39: new Date  */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false,],
  /* 40: new RegExp */  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false, false,],
  /* 41: 'string' */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true,],
  /* 42: 'another' */   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true,],
  /* 43: 'string' */    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true,],
  ]
}

function testAssertions (listA, listB, keyTable, assert, COUNTER = 0) {
  var counter = 0
  var t0 = new Date

  listA.forEach((val0, key0) => {

    try { val0|0 }
    catch (e) { val0 = new NoPrimitiveType }

    var token = assert(val0)
    listB.forEach((val1, key1) => {
      var expectedAns = keyTable[key0][key1]

      if (expectedAns === 0) { return }

      try { val1|0 }
      catch (e) { val1 = new NoPrimitiveType }

      COUNTER++
      var isMatch = token.is(val1)
      var msg = ['Expected assert(', val0, ').is(', val1, ') === ', expectedAns, ' but got ', isMatch, ' (', key0, ', ', key1, ')'].join('')

      if (isMatch !== expectedAns) {
        console.log(msg, '\n val0:', assert(val0), '\n val1:', assert(val1))
        counter++
      }
    })
  })

  if (counter === 0) {
    console.log(`matched all ${COUNTER} assertion tests`)
  }
  else {
    console.log(`${counter} test failed out of ${listA.length * listB.length}` )
  }

  var t1 = new Date
    var testMsg = `\n
  it took ${t1 - t0} ms to complete all  ${listA.length * listB.length} test at an avg of  ${listA.length * listB.length/(t1 - t0)|0} assertions/ms
  `
  console.log(testMsg)
}

function runPerf() {
  console.log('--- perf ---')
  // JIT warm up
  perf(assert, typeList)
  perf(assert, typeList)
  console.log('\n\n:: "native" typed assert (stateless)::\n\n', perf(assert, typeList), '\n')

  // JIT warm up
  perf(assertType, typeList)
  perf(assertType, typeList)
  console.log('\n\n:: undefined typed assert (stateless)::\n\n', perf(assertType, typeList), '\n')

  for (var val0 of typeList) {
    defineType(val0)
  }

  // JIT warm up
  perf(assertType, typeList)
  perf(assertType, typeList)
  console.log('\n\n:: defined typed assert (statefull)::\n\n', perf(assertType, typeList), '\n')

  // for (var item of storageType.values()) {
  //   console.log(item)
  // }
}

function perf (assert, list) {
  var res = [], t0, t1
  // preping the cached assertion array
  var isItList = list.map((v0) => {
    return assert(v0).is.bind(assert(v0))
  })


  t0 = new Date
  for (var value of list) {
    for (var isIt of isItList) {
      assert(value).is(value)
    }
  }
  t1 = new Date
  res.push(`  dynamic assertion speed: ${(list.length * list.length)/(t1 - t0)|0} assertions/ms`)

  t0 = new Date
  for (var value of list) {
    for (var isIt of isItList) {
      isIt(value) // almost twice as fast as non cached version
    }
  }
  t1 = new Date
  res.push(`    cached assertion speed: ${(list.length * list.length)/(t1 - t0)|0} assertions/ms`)

  var store =  new Map
  list.forEach((v) => {
    store.set(v, assert(v))
  })

  t0 = new Date
  for (var val0 of list) {
    for (var val1 of list) {
      if (store.has(val0)) {
        store.get(val0).is(val1)
      }
    }
  }
  t1 = new Date
  res.push(`map-cached assertion speed: ${(list.length * list.length)/(t1 - t0)|0} assertions/ms`)

  return res.join('\n')
}
