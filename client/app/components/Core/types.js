import {assert, defineType} from './assert'

var {
  isArray,
  isBoolean,
  isNull,
  isUndefined,
  isNullorUndefined,
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

export var nil = defineType(function Null (){}, isNull)
export var undef = defineType(function Undefined (){}, isUndefined)
export var undefnil = defineType(function NullorUndefined (){}, isNullorUndefined)
export var primitive = defineType(function Primitive (){}, isPrimitive)
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
export function structure(definition) {
  var properties = Object.keys(definition);
  var ret = defineType('object with properties ' + properties.join(', '), function(value) {
    if (assert(value).is(Object)) {
      for (var property of properties) {
        assert(value[property]).is(definition[property]);
      }
    }
  })
  return ret
}

console.log(assert('0').is(String)          , "assert('0').is(String)")
console.log(assert(10).is(Number)           , "assert(10).is(Number)")
console.log(assert('10').is(Number)           , "assert('10').is(Number)")
console.log(assert(true).is(Boolean)        , "assert(true).is(Boolean)")
console.log(assert().is(undef)              , "assert().is(undef)")
console.log(assert(undefined).is(undefined) , "assert(undefined).is(undefined)")
console.log(assert().is()                   , "assert().is()")
console.log(assert(null).is(null)           , "assert(null).is(null)")



