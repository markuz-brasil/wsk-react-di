import {assert, types, NonPrimitive} from './assert2'


export function test () {
  var t0 = new Date

  var COUNTER = 0

  function runEg (listA, listB) {
    var counter = 0
    var ret = listA.map((val0, key0) => {
      var token = assert(val0)
      return listB.map((val1, key1) => {
        COUNTER++

        try { val0|0 }
        catch (e) { val0 = new NonPrimitive }

        try { val1|0 }
        catch (e) { val1 = new NonPrimitive }

        var isMatch = token.is(val1)

        if (!isMatch && key0 === key1) {
          // logic here goes as follows.
          // if if token assertion fails and the key are the same, it means it failed to
          // detect itself
          console.log(`${isMatch} ${key0}, ${key1} ::: ${val0}, ${val1}
            #`, val0, ', ', val1)
        }

        if (isMatch && (key0 === key1)) {
          counter++
        }

        return isMatch
      })
    })

    if (counter === listA.length) {
      console.log(`matched all ${counter} self reference tests`)
    }
    else {
      console.log(`some test failed, expected pass ${listA.length} but got ${counter}` )
    }
    return ret
  }

  console.log('-----======-----')

  var testTypeList = [
    0, 1, 2, 3, 0, 1, 2, true, false, true, false,
    Math.PI, Math.E, Math.PI, 2.34, Math.E,
    null, null, undefined, void 0, NaN, NaN,
    Math.NEGATIVE_INFINITY, Math.POSITIVE_INFINITY,
    Math.NEGATIVE_INFINITY, Math.POSITIVE_INFINITY,

    [], [{}], {}, NaN, NaN, Object.create(null), Object.create(null), function place (){}, function(){},
    new Error, new Date, new RegExp, new Error, new Date, new RegExp,

    'string', 'another', 'string',
  ]

  runEg(testTypeList, testTypeList)

  var tk = assert(Object.create(null))
  console.log('&&', tk.is(Object.create(null)))

  var t1 = new Date
  console.log('\n\n tests took:',
    t1 - t0,
    'ms to complete',
    testTypeList.length * testTypeList.length,
    'tests, avg:', (testTypeList.length * testTypeList.length)/(t1 - t0) +'/ms\n\n' )
}

