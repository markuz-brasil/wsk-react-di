import {assertRank} from './assertRank'
import {assert, define} from './index'


var isArray = assertRank([]).is

export function test () {
  testTypes()
  runPerf()
  testStruct()

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
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(SomeFunc).is(null) ***')
  A0 = [ fn0, fn1, fn2 ]
  A1 = [true, 10, 'a', null, {}, () => {}, []]
  A2 = [
    [false, false, false, false, false, true, false],
    [false, false, false, true, true, false, true ],
    [false, false, true, false, false, false, false ],
    [false, false, false, false, false, false, true ],
  ]
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(null).is(assert(null)) ***')
  A0 = [true, 10, 'a', null, {}, () => {}, [], 'b']
  A1 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
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
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(assert(null)).is(null) ***')
  A0 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
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
  testAssertions(A0, A1, A2, assert)

  console.log('*** assert(assert(null)).is(assert(null)) ***')
  A0 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  A1 = [assert(true), assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
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
  testAssertions(A0, A1, A2, assert)

  console.log('*** self reference test ***')
  testAssertions(typeList, typeList, makeKeyTable(), assert)

}

function testStruct () {
  var A0, A1, A2


  console.log('\n\n--- testing struct ---\n\n')
  console.log('*** assert(assert(null)).is(assert(null)) ***')

  A0 = [{k3: true, $k1: 'v1',  _k2: 'v2', s: {}, s0: [], s1: NaN, }, assert(10), 'a', assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  // A0 = [{}, assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  // A1 = [{}, assert(10), assert('a'), assert(null), assert({}), assert(() => {}), assert([]), assert('b')]
  A1 = [{$k1: 'v1',  _k2: 'v2', k3: true, s: {}, s1: NaN, s0: [], }, assert(10), 'a', null, assert({}), assert(() => {}), assert([]), assert('b')]
  A2 = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, true],
    [false, false, false, true, false, false, false, false],
    [true, false, false, false, true, false, false, false],
    [false, false, false, false, false, true, false, false],
    [false, false, false, false, false, false, true, false],
    [false, false, true, false, false, false, false, true],
  ]
  console.log('testing strucs 0')
  testAssertions(A0, A1, A2, assert)

  var ty = assert.ctor()

  for (var val0 of A0) {
    ty.define(val0, ty.assert(val0).assert)
  }

  console.log('testing strucs 1')
  testAssertions(A0, A1, A2, ty.assert)

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


var ss = [
  {k3: true, $k1: 'v1',  _k2: 'v2', s: {}, s0: [], s1: NaN, },
  {$k1: 'v1',  _k2: 'v2', k3: true, s: {}, s1: NaN, s0: [], },
]

var c = 23
var structList = []
while (--c) {
  structList.push(ss[0])
  structList.push(ss[1])
}


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

function testAssertions (listA, listB, keyTable, assert) {
  var errCounter = 0
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

      counter++
      var isMatch = token.is(val1)
      var msg = ['Expected assert(', val0, ').is(', val1, ') === ', expectedAns, ' but got ', isMatch, ' (', key0, ', ', key1, ')'].join('')

      if (isMatch !== expectedAns) {
        console.log(msg, '\n val0:', assert(val0), '\n val1:', assert(val1))
        errCounter++
      }
    })
  })

  if (errCounter === 0) {
    console.log(`matched all ${counter} assertion tests`)
  }
  else {
    console.log(`${errCounter} test failed out of ${listA.length * listB.length}` )
  }

  var t1 = new Date
    var testMsg = `\n
  it took ${t1 - t0} ms to complete all  ${counter} test at an avg of  ${listA.length * listB.length/(t1 - t0)|0} assertions/ms
  `
  console.log(testMsg)
}

function runPerf() {
  console.log('--- perf ---')

  var typeL = [...typeList, ...typeList,]
  var structL = [...structList, ...structList,]
  // JIT warm up
  var t0 = new Date()
  var ty = assert.ctor()

  perf(assertRank, typeL)
  perf(assertRank, typeL)
  console.log('start')
  console.log('\n\n:: "native" typed assert (stateless)::', typeL.length * typeL.length,'times \n\n', perf(assertRank, typeL), '\n')

  // JIT warm up
  perf(assert, typeL)
  perf(assert, typeL)
  console.log('start')
  console.log('\n\n:: undefined typed assert (stateless)::', typeL.length * typeL.length ,'times \n\n', perf(assert, typeL), '\n')

  for (var val0 of typeL) {
    define(val0)
  }

  // JIT warm up
  perf(assert, typeL)
  perf(assert, typeL)
  console.log('start')
  console.log('\n\n:: defined typed assert (statefull)::', typeL.length * typeL.length ,'times \n\n', perf(assert, typeL), '\n')

  for (var val0 of typeL) {
    ty.define(val0,  function typeTest (value, base) {
      return true
    })
  }

    // JIT warm up
  perf(ty.assert, typeL)
  perf(ty.assert, typeL)
  console.log('start')
  console.log('\n\n:: defined typed fake assert (statefull)::', typeL.length * typeL.length ,'times \n\n', perf(ty.assert, typeL), '\n')

  console.log('######## structs #######')

  // JIT warm up
  perf(assert, structL)
  perf(assert, structL)
  console.log('start')
  console.log('\n\n:: undefined struct assert (stateless)::', structL.length * structL.length ,'times \n\n', perf(assert, structL), '\n')


  for (var val0 of structL) {
    define(val0)
  }

  // JIT warm up
  perf(assert, structL)
  perf(assert, structL)
  console.log('start')
  console.log('\n\n:: defined struct assert (statefull)::', structL.length * structL.length ,'times \n\n', perf(assert, structL), '\n')

  for (var val0 of structL) {
    ty.define(val0, function structTest (value, base) {
      return true
    })
  }

  // JIT warm up
  perf(ty.assert, structL)
  perf(ty.assert, structL)
  console.log('start')
  console.log('\n\n:: defined struct fake assert (statefull)::', structL.length * structL.length ,'times \n\n', perf(ty.assert, structL), '\n')



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
