import {assert, defineType, TYPE_NAMESPACE, removeType} from './assert'
// import {test} from './types-test'

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
export var array = defineType(Array, isArray)
export var bool = defineType(Boolean, isBoolean)
export var num = defineType(Number, isNumber)
export var str = defineType(String, isString)
export var reg = defineType(RegExp, isRegExp)
export var obj = defineType(Object, isObject)
export var date = defineType(Date, isDate)
export var error = defineType(Error, isError)
export var fun = defineType(Function, isFunction)
export var sym = defineType(Symbol, isSymbol)

export var nil = defineType(null, isNull)
export var undef = defineType(undefined, isUndefined)
export var undefnil = defineType(isNullOrUndefined)
export var primitive = defineType(isPrimitive)

function Num (){}
defineType(Num, isNumber)

function NullOrUndefined () {}
defineType(NullOrUndefined, isNullOrUndefined)

console.log('%%%%', TYPE_NAMESPACE.get(Num))
assert.delete(Num)
console.log('%%%%', TYPE_NAMESPACE.get(Num))
console.log(TYPE_NAMESPACE.get(isNullOrUndefined))
// export var buf = defineType(Array, isBuffer)
// TODO: write comments
export function arrayOf(...types) {
  return defineType('array of ' + types.map(prettyPrint).join('/'), function(value) {
    if (assert(value).is(Array)) {
      for (var item of value) {
        assert(item).is(...types);
      }
    }
  });
}

// TODO: write comments
export function structure(definition, rm = false) {
  var properties = Object.keys(definition);
  var ret = defineType('object with properties ' + properties.join(', '), function(value) {
    if (assert(value).is(Object)) {
      for (var property of properties) {
        assert(value[property]).is(definition[property]);
      }
    }
  }, rm)
  return ret
}



var counter = 0

function test (types, sample) {
  var ans = types.map((type, i) => {
    // console.log(array[i], type)
    return sample[i].map((s) => {
      var res = assert(s).is(type)
      if (res) {
        console.log(res,  'type:', type, 'value:', s, sample[i])
      }
      else {
        console.warn(res, 'type:', type, 'value:', s, sample[i])
      }
      return res
    })

  })
  console.log(counter++, '*** *** ***')
  console.log(ans, sample)
}



test( [
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
    [true, false, true],
    [0, 1, 2, 3, 4],
    [/fg/, /fh/],
    ['ff', 'dd', 'ss', 4],
    [{hi: 'there'}, {hello: ['gg']}, {oi: 3}],
    [new Date(), new Date()],
    [new Error('ops'), new Error('ops2')],
    [() => {}, function (){}, new Function()],
  ])

test( [
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

test( [
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


test( [
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

test( [
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




